import { fileTypeFromBuffer } from 'file-type';
import { Jimp, JimpMime } from 'jimp';

export const optimizeImageFn = async (file: Buffer, width = 1200, quality = 65): Promise<Buffer> => {
  const type = await fileTypeFromBuffer(file);

  if (type?.mime?.startsWith('image/')) {
    const image = await Jimp.read(file);

    if (image.width > width) {
      image.resize({ w: width });
    }

    if (type.mime === JimpMime.png) {
      return await image.getBuffer(JimpMime.png);
    } else {
      return await image.getBuffer(JimpMime.jpeg, { quality });
    }
  }

  return file;
};
