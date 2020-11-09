/// <reference types="node" />
import { Buffer } from "buffer";
export declare function joinBuffers(buffer1: Buffer, buffer2: Buffer): Buffer;
export declare let des: {
    iv: Buffer;
    alg: string;
    encrypt: (data: Buffer, key: string) => Buffer;
    decrypt: (encryptData: Buffer, key: string) => Buffer;
};
