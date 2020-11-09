/// <reference types="node" />
/**
 * 压缩目录及子目录成zip文件
 *
 * @export
 * @param {string} sourcePath - 目录
 * @param {string} key - 密码
 * @param {string} zipFile - zip文件
 */
export declare function zipPath(sourcePath: string, key: string, zipFile: string): Promise<void>;
/**
 * 解压zip文件
 *
 * @export
 * @param {string} zipFile - zip 文件
 * @param {string} key - 密码
 * @param {string} targetPath - 目标目录
 */
export declare function unzipPath(zipFile: string, key: string, targetPath: string): Promise<void>;
/**
 * 读取一个zip文件
 *
 * @export
 * @param {string} zipFile - zip 文件
 * @param {string} key - 密码
 * @param {(fileName: string, buffer: Buffer) => {}} eachEntry - 文件Buffer
 */
export declare function readZip(zipFile: string, key: string, eachEntry: (fileName: string, buffer: Buffer) => void): Promise<unknown>;
