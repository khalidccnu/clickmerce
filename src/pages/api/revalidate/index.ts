import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { secret, route } = req.body;

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

  if (secret !== process.env.REVALIDATION_SECRET) {
    return res.status(401).json({
      success: false,
      statusCode: 401,
      message: 'Invalid token',
      meta: null,
      data: {
        revalidated: false,
      },
    });
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
