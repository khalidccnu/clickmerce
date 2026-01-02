import { Toolbox } from '@lib/utils/toolbox';
import { NextApiRequest, NextApiResponse } from 'next';

const startTime = Date.now();
let requestCount = 0;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const uptimeMs = Date.now() - startTime;
  requestCount = requestCount + 1;

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Health check successful',
    data: {
      system: {
        retry: requestCount,
        uptime: Toolbox.msToDurationString(uptimeMs),
        uptimeMs,
      },
      timestamp: new Date().toISOString(),
    },
    meta: null,
  });
}
