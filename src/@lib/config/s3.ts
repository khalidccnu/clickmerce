import { Env } from '.environments';
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { IBaseResponse } from '@base/interfaces';
import { ENUM_SETTINGS_S3_PROVIDER_TYPES, TSettingsS3ProviderType } from '@modules/settings/lib/enums';
import * as fs from 'fs';

const buildPublicUrlFn = ({
  provider,
  endpoint,
  bucket,
  region,
  filePath,
  customUrl,
}: {
  provider: TSettingsS3ProviderType;
  endpoint: string;
  bucket: string;
  region: string;
  filePath: string;
  customUrl?: string;
}): string => {
  if (customUrl) {
    return `${customUrl}/${filePath}`;
  }

  switch (provider) {
    case ENUM_SETTINGS_S3_PROVIDER_TYPES.AWS_S3:
      if (region) {
        return `https://${bucket}.s3.${region}.amazonaws.com/${filePath}`;
      } else {
        return `https://s3.amazonaws.com/${bucket}/${filePath}`;
      }

    case ENUM_SETTINGS_S3_PROVIDER_TYPES.DIGITALOCEAN:
      if (region) {
        return `https://${bucket}.${region}.digitaloceanspaces.com/${filePath}`;
      } else {
        return `${endpoint}/${bucket}/${filePath}`;
      }

    case ENUM_SETTINGS_S3_PROVIDER_TYPES.CLOUDFLARE_R2:
      return `${endpoint}/${bucket}/${filePath}`;

    case ENUM_SETTINGS_S3_PROVIDER_TYPES.SUPABASE_STORAGE:
      const url = `${endpoint}/object/public/${bucket}/${filePath}`;
      return url.replace('/s3/', '/');

    case ENUM_SETTINGS_S3_PROVIDER_TYPES.BACKBLAZE:
      return `${endpoint}/file/${bucket}/${filePath}`;

    case ENUM_SETTINGS_S3_PROVIDER_TYPES.MINIO:
    case ENUM_SETTINGS_S3_PROVIDER_TYPES.CUSTOM:
    default:
      return `${endpoint}/${bucket}/${filePath}`;
  }
};

const formatS3FilePathFn = (fileName: string, folderPath?: string): string => {
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

const s3FileUrlFn = async ({
  fileName,
  folderPath,
  makePublic,
  expiresIn = 3600,
  bucket,
  endpoint,
  region,
  provider,
  customUrl,
  s3Client,
}: {
  fileName: string;
  folderPath?: string;
  makePublic: boolean;
  expiresIn?: number;
  bucket: string;
  endpoint: string;
  region: string;
  provider: TSettingsS3ProviderType;
  customUrl?: string;
  s3Client: S3Client;
}): Promise<{ url: string; expires_in: number }> => {
  try {
    const filePath = formatS3FilePathFn(fileName, folderPath);
    let url: string;

    if (makePublic) {
      url = buildPublicUrlFn({
        provider,
        endpoint,
        bucket,
        region,
        filePath,
        customUrl,
      });
    } else {
      const command = new GetObjectCommand({ Bucket: bucket, Key: filePath });
      url = await getSignedUrl(s3Client, command, { expiresIn });
    }

    return { url, expires_in: makePublic ? 0 : expiresIn };
  } catch (error) {
    throw new Error('Failed to generate URL');
  }
};

export const s3FileUploadFn = async ({
  file,
  fileName,
  folderPath,
  contentType,
  makePublic = false,
  bucket,
  endpoint,
  region,
  provider,
  customUrl,
  s3Client,
}: {
  file: string | Buffer;
  fileName: string;
  folderPath?: string;
  contentType?: string;
  makePublic?: boolean;
  bucket: string;
  endpoint: string;
  region: string;
  provider: TSettingsS3ProviderType;
  customUrl?: string;
  s3Client: S3Client;
}): Promise<
  IBaseResponse<{
    file_name: string;
    file_path: string;
    file_url: string;
    bucket: string;
    etag: string;
    version_id: string;
  }>
> => {
  const filePath = formatS3FilePathFn(fileName, folderPath);
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
    const file = await s3FileUrlFn({
      fileName,
      folderPath,
      makePublic,
      bucket,
      endpoint,
      region,
      provider,
      customUrl,
      s3Client,
    });

    const response: IBaseResponse = {
      success: true,
      statusCode: 201,
      message: 'File uploaded successfully',
      data: {
        file_name: fileName,
        file_path: filePath,
        file_url: file.url,
        bucket,
        etag: result.ETag,
        version_id: result.VersionId,
      },
      meta: null,
    };

    return response;
  } catch (error) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 500,
      message: Env.isProduction ? 'Failed to upload file to S3' : error.message,
      data: null,
      meta: null,
    };

    return response;
  }
};

export const s3FileDeleteFn = async ({
  filePath,
  bucket,
  s3Client,
}: {
  filePath?: string;
  bucket: string;
  s3Client: S3Client;
}): Promise<IBaseResponse> => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: filePath,
    });

    await s3Client.send(command);

    return {
      success: true,
      statusCode: 200,
      message: 'File deleted successfully',
      data: null,
      meta: null,
    };
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: Env.isProduction ? 'Failed to delete file from S3' : error.message,
      data: null,
      meta: null,
    };
  }
};
