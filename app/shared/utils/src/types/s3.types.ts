export type S3Props = {
  endpoint: string;
  bucket: string;
  secretKey: string;
  accessKey: string;
  region: string;
};

export type S3Mutable = {
  syncPath: (path: string, deleteLocalFiles?: boolean) => Promise<void>;

  getFiles: () => Promise<S3ObjectInfo[]>;
  removeFiles: (...files: string[]) => Promise<void>;

  getObject: (name: string) => Promise<Uint8Array>;
  addObject: (name: string, buffer: Uint8Array) => Promise<void>;
  removeObjects: (objects: S3ObjectInfo[]) => Promise<void>;
};

export type S3ObjectInfo = {
  name: string;
  lastModified: Date;
  etag: string;
  size: number;
};
