import { IBaseResponse } from '@base/interfaces';
import { getServerAuthSession } from '@modules/auth/lib/utils/server';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { route } = req.body;

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      statusCode: 405,
      message: 'Method Not Allowed',
      meta: null,
      data: {
        revalidated: false,
      },
    });
  }

  const { token } = getServerAuthSession(req);

  if (!token) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 401,
      message: 'Unauthorized',
      data: {
        revalidated: false,
      },
      meta: null,
    };

    return res.status(401).json(response);
  }

  if (!route) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Route parameter is required',
      meta: null,
      data: {
        revalidated: false,
      },
    });
  }

  try {
    await res.revalidate(route as string);

    return res.json({
      success: true,
      statusCode: 200,
      message: `Route "${route}" revalidated successfully`,
      meta: null,
      data: {
        revalidated: true,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: `Error revalidating route "${route}"`,
      meta: null,
      data: {
        revalidated: false,
      },
    });
  }
}
