import { Env } from '.environments';
import { IBaseResponse } from '@base/interfaces';
import { AxiosInstance } from '@lib/config/axiosInstance';
import { CSRF_TOKEN_KEY } from '@modules/auth/lib/constant';
import { getServerAuthSession } from '@modules/auth/lib/utils/server';
import { NextApiRequest, NextApiResponse } from 'next';
import { handleGetCookieFn, handleSetCookieFn } from '../../lib/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'OPTIONS':
      return res.status(200).end();
    case 'POST':
      return handlePost(req, res);
    default:
      const response: IBaseResponse = {
        success: false,
        statusCode: 405,
        message: 'Method not allowed',
        data: null,
        meta: null,
      };

      return res.status(405).json(response);
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { token } = getServerAuthSession(req);

  if (!token) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 401,
      message: 'Unauthorized',
      data: null,
      meta: null,
    };

    return res.status(401).json(response);
  }

  const { phone } = req.body;

  if (!phone) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 400,
      message: 'Phone number is required',
      data: null,
      meta: null,
    };

    return res.status(400).json(response);
  }

  const csrfTokenFn = async () => {
    const { data: csrfData } = await AxiosInstance.get<IBaseResponse<{ token: string }>>('/relay/csrf-token', {
      params: {
        webUrl: Env.tpCourierApiUrl,
        baseApiUrl: Env.tpCourierApiUrl,
      },
    });

    const csrfToken = csrfData.data.token;

    handleSetCookieFn(res, CSRF_TOKEN_KEY, JSON.stringify(csrfToken), {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: !Env.isDevelopment,
    });

    return csrfToken;
  };

  const makeRequestFn = async (csrfToken: string) => {
    return await AxiosInstance.post<IBaseResponse>(
      'relay/statistics',
      { phone: phone?.length > 11 ? phone.slice(-11) : phone },
      {
        params: {
          webUrl: Env.tpCourierApiUrl,
          baseApiUrl: Env.tpCourierApiUrl,
        },
        headers: {
          'X-CSRF-TOKEN': csrfToken,
        },
      },
    );
  };

  try {
    let csrfToken: string = handleGetCookieFn(req, CSRF_TOKEN_KEY);

    if (!csrfToken) {
      csrfToken = await csrfTokenFn();
    }

    let { data } = await makeRequestFn(csrfToken);

    if (data?.statusCode === 419) {
      csrfToken = await csrfTokenFn();
      const { data: retryData } = await makeRequestFn(csrfToken);

      data = retryData;
    }

    if (!data.success) {
      const response: IBaseResponse = {
        success: false,
        statusCode: data.statusCode || 400,
        message: data.message || 'Failed to fetch health',
        data: null,
        meta: null,
      };

      return res.status(data.statusCode || 400).json(response);
    }

    const response: IBaseResponse = {
      success: true,
      statusCode: 200,
      message: 'Health fetched successfully',
      data: data.data,
      meta: null,
    };

    return res.status(200).json(response);
  } catch (error) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 500,
      message: 'Failed to fetch health',
      data: null,
      meta: null,
    };

    return res.status(500).json(response);
  }
}
