import { expect } from "chai";
import "mocha";
import { zipPath, unzipPath, readZip } from "../src/zipPath";
import { getFiles } from "path-files";
import { joinBuffers } from "../src/des";
import { existsSync, readFileSync, rmdirSync, unlinkSync } from "fs";
import { basename } from "path";

describe("zipPath", function () {
  let sourcePath = `${__dirname}/testPath`;
  let zipFile = `${__dirname}/zipFile.zip`;
  let sourcePath2 = `${__dirname}/testPath2`;
  let key = "0123456789abcd0123456789";

  before(async () => {
    if (existsSync(sourcePath2)) {
      rmdirSync(sourcePath2, { recursive: true });
    }
    if (existsSync(zipFile)) {
      unlinkSync(zipFile);
    }
  });
  after(async () => {
    if (existsSync(sourcePath2)) {
      rmdirSync(sourcePath2, { recursive: true });
    }
    if (existsSync(zipFile)) {
      unlinkSync(zipFile);
    }
  });

  it("zipPath should be success", async () => {
    await zipPath(sourcePath, key, zipFile);
    await unzipPath(zipFile, key, sourcePath2);

    let fileList1 = getFiles(sourcePath);
    let fileList2 = getFiles(sourcePath2);

    expect(fileList1.length).to.be.equal(fileList2.length);
    for (let i = 0; i < fileList1.length; i++) {
      let file1 = basename(fileList1[i]);
      let file2 = basename(fileList2[i]);
      expect(file1).to.be.equal(file2);
      expect(readFileSync(fileList1[i], { encoding: "utf8" })).to.be.equal(readFileSync(fileList2[i], { encoding: "utf8" }));
    }
  });

  it("zipPath with error", async () => {
    try {
      await zipPath(sourcePath, "123", zipFile);
      expect(true).to.be.true;
    } catch (e) {
      expect(e.message).to.be.equal("key length must be 24!");
    }

    try {
      await unzipPath(zipFile, "123", sourcePath2);
    } catch (e) {
      expect(e.message).to.be.equal("key length must be 24!");
    }

    expect(joinBuffers(null, null)).to.be.null;
  });

  it("readZip should be success", async () => {
    let fileList2 = getFiles(sourcePath2);
    let fileList1: string[] = [];
    await readZip(zipFile, key, (fileName, buffer) => {
      let sourceFile = `${sourcePath}/${fileName}`;

      expect(equalsBuffer(readFileSync(sourceFile), buffer)).to.be.true;
    });
  });
});

function equalsBuffer(buffer1: Buffer, buffer2: Buffer) {
  if (buffer1 != null && buffer2 != null && buffer1.length === buffer2.length) {
    for (let i = 0; i < buffer1.length; i++) {
      if (buffer1[i] !== buffer2[i]) {
        return false;
      }
    }
  }
  return true;
}
