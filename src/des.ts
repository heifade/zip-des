import { createCipheriv, createDecipheriv } from "crypto";
import { Buffer } from "buffer";

export function joinBuffers(buffer1: Buffer, buffer2: Buffer) {
  if (buffer1 === null && buffer2 === null) {
    return null;
  }

  if (buffer1 === null || buffer1.length === 0) {
    return buffer2;
  }
  if (buffer2 === null || buffer2.length === 0) {
    return buffer1;
  }

  let targetBuffer = new Buffer(buffer1.length + buffer2.length);

  buffer1.copy(targetBuffer);
  buffer2.copy(targetBuffer, buffer1.length);

  return targetBuffer;
}

export let des = {
  iv: new Buffer([31, -11, 111, -121, -41, -91, 17, 131]),
  alg: "des-ede3-cbc",
  encrypt: function(data: Buffer, key: string) {
    if (!key || key.length != 24) {
      throw new Error("key length must be 24!");
    }

    let cipher = createCipheriv(this.alg, new Buffer(key), this.iv);
    cipher.setAutoPadding(true);

    let buffer1 = cipher.update(data);
    let buffer2 = cipher.final();

    return joinBuffers(buffer1, buffer2);
  },
  decrypt: function(encryptData: Buffer, key: string) {
    if (!key || key.length != 24) {
      throw new Error("key length must be 24!");
    }
    let decipher = createDecipheriv(this.alg, new Buffer(key), this.iv);
    decipher.setAutoPadding(true);

    let buffer1 = decipher.update(encryptData);
    let buffer2 = decipher.final();

    return joinBuffers(buffer1, buffer2);
  }
};
