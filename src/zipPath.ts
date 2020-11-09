import { readFileSync, writeFileSync } from "fs";
import { getFiles } from "path-files";
import * as AdmZip from "adm-zip";
import { des } from "./des";
import { mkdirSync } from "fs";

/**
 * 压缩目录及子目录成zip文件
 *
 * @export
 * @param {string} sourcePath - 目录
 * @param {string} key - 密码
 * @param {string} zipFile - zip文件
 */
export async function zipPath(sourcePath: string, key: string, zipFile: string) {
  const admZip = new AdmZip();

  sourcePath = sourcePath.replace(/\\/g, "/").replace(/\/$/g, "") + "/";

  const fileList = getFiles(sourcePath);

  fileList.map((file) => {
    let subPathFileName = file.substr(sourcePath.length).replace(/\\/g, "/");
    let lastPIndex = subPathFileName.lastIndexOf("/");
    let subPath = subPathFileName.substr(0, lastPIndex);
    let fileName = subPathFileName.substr(lastPIndex + 1);

    let sourceFileData = readFileSync(file);
    let encryptData = des.encrypt(sourceFileData, key);

    admZip.addFile(subPathFileName, encryptData, subPathFileName);
  });
  admZip.writeZip(zipFile);
}

/**
 * 解压zip文件
 *
 * @export
 * @param {string} zipFile - zip 文件
 * @param {string} key - 密码
 * @param {string} targetPath - 目标目录
 */
export async function unzipPath(zipFile: string, key: string, targetPath: string) {
  targetPath = targetPath.replace(/\\/g, "/").replace(/\/$/, "");

  mkdirSync(targetPath, { recursive: true });

  let admZip = new AdmZip(zipFile);

  let zipEntries = admZip.getEntries();
  zipEntries.forEach((entry) => {
    let encryptData = admZip.readFile(entry.entryName);

    let sourceFileData = des.decrypt(encryptData, key);

    let subPath = entry.entryName.replace(/\\/g, "/");
    subPath = subPath.substr(0, subPath.lastIndexOf("/"));

    mkdirSync(`${targetPath}/${subPath}`, { recursive: true });

    writeFileSync(`${targetPath}/${entry.entryName}`, sourceFileData);
  });
}

/**
 * 读取一个zip文件
 *
 * @export
 * @param {string} zipFile - zip 文件
 * @param {string} key - 密码
 * @param {(fileName: string, buffer: Buffer) => {}} eachEntry - 文件Buffer
 */
export async function readZip(zipFile: string, key: string, eachEntry: (fileName: string, buffer: Buffer) => void) {
  return new Promise((resolve, reject) => {
    let admZip = new AdmZip(zipFile);

    let zipEntries = admZip.getEntries();
    zipEntries.forEach((entry, index, array) => {
      let zipEntry = admZip.getEntry(entry.entryName);

      let sourceFileData = des.decrypt(zipEntry.getData(), key);

      eachEntry(zipEntry.entryName, sourceFileData);

      if (index == array.length - 1) {
        resolve();
      }
    });
  });
}
