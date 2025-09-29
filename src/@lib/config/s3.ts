import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { IBaseResponse } from '@base/interfaces';
import * as fs from 'fs';

const formatS3FilePath = (fileName: string, folderPath?: string): string => {
  let path = '';

  if (folderPath) path += `${folderPath}/`;
  path += fileName;

  return path;
};

export const s3 = (accessKeyId: string, secretAccessKey: string, endpoint: string, region: string) => {
  return new S3Client({
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    endpoint,
    region,
    forcePathStyle: true,
  });
};

const s3FileUrl = async ({
  fileName,
  folderPath,
  makePublic,
  expiresIn = 3600,
  bucket,
  endpoint,
  r2WorkerEndpoint,
  s3Client,
}: {
  fileName: string;
  folderPath?: string;
  makePublic: boolean;
  expiresIn?: number;
  bucket: string;
  endpoint: string;
  r2WorkerEndpoint?: string;
  s3Client: S3Client;
}): Promise<{ url: string; expiresIn: number }> => {
  try {
    const filePath = formatS3FilePath(fileName, folderPath);
    let url = r2WorkerEndpoint ? r2WorkerEndpoint : `${endpoint}/${bucket}`;

    if (makePublic) {
      url += `/${filePath}`;
    } else {
      const command = new GetObjectCommand({ Bucket: bucket, Key: filePath });
      url = await getSignedUrl(s3Client, command, { expiresIn });
    }

    return { url, expiresIn: makePublic ? 0 : expiresIn };
  } catch (error) {
    throw new Error('Failed to generate URL');
  }
};

export const s3FileUpload = async ({
  file,
  fileName,
  folderPath,
  contentType,
  makePublic = false,
  bucket,
  endpoint,
  r2WorkerEndpoint,
  s3Client,
}: {
  file: string | Buffer;
  fileName: string;
  folderPath?: string;
  contentType?: string;
  makePublic?: boolean;
  bucket: string;
  endpoint: string;
  r2WorkerEndpoint?: string;
  s3Client: S3Client;
}): Promise<
  IBaseResponse<{
    fileName: string;
    filePath: string;
    fileUrl: string;
    bucket: string;
    etag: string;
    versionId: string;
  }>
> => {
  const filePath = formatS3FilePath(fileName, folderPath);
  const payload = typeof file === 'string' && fs.existsSync(file) ? fs.createReadStream(file) : file;

  try {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: filePath,
      Body: payload,
      ContentType: contentType || 'application/octet-stream',
      ACL: makePublic ? 'public-read' : undefined,
      Metadata: makePublic ? { accessible: 'public-read' } : undefined,
    });

    const result = await s3Client.send(command);
    const file = await s3FileUrl({
      fileName,
      folderPath,
      makePublic,
      bucket,
      endpoint,
      r2WorkerEndpoint,
      s3Client,
    });

    const response: IBaseResponse = {
      success: true,
      statusCode: 201,
      message: 'File uploaded successfully',
      data: {
        fileName,
        filePath,
        fileUrl: file.url,
        bucket,
        etag: result.ETag,
        versionId: result.VersionId,
      },
      meta: null,
    };

    return response;
  } catch (error) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 500,
      message: 'Failed to upload file to S3',
      data: null,
      meta: null,
    };

    return response;
  }
};
