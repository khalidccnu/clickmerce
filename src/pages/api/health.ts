import { Toolbox } from '@lib/utils/toolbox';
import { NextApiRequest, NextApiResponse } from 'next';
import os from 'os';

let requestCount = 0;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const uptimeSec = os.uptime();
  const uptimeMs = uptimeSec * 1000;
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
