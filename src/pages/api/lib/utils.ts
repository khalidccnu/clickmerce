import { Env } from '.environments';
import { fileTypeFromBuffer } from 'file-type';
import { Jimp, JimpMime } from 'jimp';
import { NextApiRequest, NextApiResponse } from 'next';
import zlib from 'zlib';

export const handleGetCookieFn = (req: NextApiRequest, name: string) => {
  const prefix = `${Env.webIdentifier}_`;
  const cookie = req.cookies?.[prefix + name];

  if (!cookie) return null;

  try {
    return JSON.parse(cookie);
  } catch {
    return cookie;
  }
};

export const handleSetCookieFn = (
  res: NextApiResponse,
  name: string,
  value: string,
  options?: { [key: string]: any },
) => {
  const prefix = `${Env.webIdentifier}_`;
  const cookieOptions = options || {};
  let cookieString = `${prefix + name}=${value}`;

  if (cookieOptions.maxAge) cookieString += `; Max-Age=${cookieOptions.maxAge}`;
  if (cookieOptions.path) cookieString += `; Path=${cookieOptions.path}`;
  if (cookieOptions.domain) cookieString += `; Domain=${cookieOptions.domain}`;
  if (cookieOptions.httpOnly) cookieString += '; HttpOnly';
  if (cookieOptions.secure) cookieString += '; Secure';
  if (cookieOptions.sameSite) cookieString += `; SameSite=${cookieOptions.sameSite}`;

  res.setHeader('Set-Cookie', cookieString);
};

export const handleSetManyCookieFn = (
  res: NextApiResponse,
  cookies: Array<{ name: string; value: string; options?: { [key: string]: any } }>,
) => {
  const prefix = `${Env.webIdentifier}_`;

  const cookieStrings = cookies.map(({ name, value, options }) => {
    const cookieOptions = options || {};
    let cookieString = `${prefix + name}=${value}`;

    if (cookieOptions.maxAge) cookieString += `; Max-Age=${cookieOptions.maxAge}`;
    if (cookieOptions.path) cookieString += `; Path=${cookieOptions.path}`;
    if (cookieOptions.domain) cookieString += `; Domain=${cookieOptions.domain}`;
    if (cookieOptions.httpOnly) cookieString += '; HttpOnly';
    if (cookieOptions.secure) cookieString += '; Secure';
    if (cookieOptions.sameSite) cookieString += `; SameSite=${cookieOptions.sameSite}`;

    return cookieString;
  });

  res.setHeader('Set-Cookie', cookieStrings);
};

export const optimizeImageFn = async (file: Buffer, width = 1200, quality = 65): Promise<Buffer> => {
  const type = await fileTypeFromBuffer(file);

  if (
    type?.mime?.startsWith('image/') &&
    Object.values(JimpMime).includes(type.mime as (typeof JimpMime)[keyof typeof JimpMime])
  ) {
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

export const decompressBufferFn = (buffer: Buffer, encoding: string): string => {
  if (encoding === 'gzip') return zlib.gunzipSync(buffer).toString();
  else if (encoding === 'deflate') return zlib.inflateSync(buffer).toString();
  else if (encoding === 'br') return zlib.brotliDecompressSync(buffer).toString();
  return buffer.toString();
};
