import { IBaseResponse } from '@base/interfaces';
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { decompressBufferFn } from '../lib/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { webUrl, baseApiUrl, path, ...rest } = req.query;

  if (!webUrl || !baseApiUrl) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 400,
      message: 'Missing required query parameters: web url or api url',
      data: null,
      meta: null,
    };

    return res.status(400).json(response);
  }

  res.setHeader('Access-Control-Allow-Origin', webUrl);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const apiUrlPath = Array.isArray(path) ? path.join('/') : path;
    const apiUrl = `${baseApiUrl}/${apiUrlPath}`;

    const { host: _host, connection: _connection, 'content-length': _contentLength, ...restHeaders } = req.headers;

    const arraybufferResponse = await axios({
      method: req.method,
      url: apiUrl,
      headers: {
        ...restHeaders,
        origin: webUrl,
      },
      params: rest,
      responseType: 'arraybuffer',
      data: req.method !== 'GET' ? req.body : undefined,
      validateStatus: () => true,
    });

    const responseEncoding = arraybufferResponse.headers['content-encoding'];
    const buffer = Buffer.from(arraybufferResponse.data);
    const decodedResponse = decompressBufferFn(buffer, responseEncoding);
    const upstreamStatus = arraybufferResponse.status;

    let parsedResponse;

    try {
      parsedResponse = JSON.parse(decodedResponse);
    } catch {
      const response: IBaseResponse = {
        success: false,
        statusCode: upstreamStatus >= 400 ? upstreamStatus : 500,
        message: 'Expected JSON but received non-JSON (likely HTML).',
        data: null,
        meta: null,
      };

      return res.status(response.statusCode).json(response);
    }

    const isSuccess = upstreamStatus >= 200 && upstreamStatus < 300;

    const response: IBaseResponse = {
      success: isSuccess,
      statusCode: upstreamStatus,
      message: parsedResponse.message || (isSuccess ? 'Successfully Retrieved!' : 'Request Failed'),
      data: parsedResponse.data || parsedResponse,
      meta: parsedResponse.meta || null,
    };

    res.status(upstreamStatus).json(response);
  } catch (error) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 500,
      message: 'Server Error',
      data: null,
      meta: null,
    };

    res.status(500).json(response);
  }
}
