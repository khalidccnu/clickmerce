import { fileTypeFromBuffer } from 'file-type';
import sharp from 'sharp';

export const optimizeImageFn = async (file: Buffer, width = 1200, quality = 65) => {
  const type = await fileTypeFromBuffer(file);

  if (type?.mime?.startsWith('image/')) {
    const format = type.mime.split('/')[1];

    return await sharp(file)
      .resize({ width, withoutEnlargement: true })
      .toFormat(format as keyof sharp.FormatEnum, { quality })
      .toBuffer();
  }

  return file;
};
