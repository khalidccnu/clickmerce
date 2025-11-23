import { IBaseResponse } from '@base/interfaces';
import { supabaseServiceClient } from '@lib/config/supabase/serviceClient';
import { Database } from '@lib/constant/database';
import { SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import { Toolbox } from '@lib/utils/toolbox';
import { validate } from '@lib/utils/yup';
import { profileUpdateSchema, TProfileUpdateDto } from '@modules/auth/lib/dtos';
import { getServerAuthSession } from '@modules/auth/lib/utils/server';
import { IUser } from '@modules/users/lib/interfaces';
import { NextApiRequest, NextApiResponse } from 'next';
import { jwtVerify } from '../lib/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'OPTIONS':
      return res.status(200).end();
    case 'GET':
      return handleGet(req, res);
    case 'PATCH':
      return handleUpdate(req, res);
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

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
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

    const payload = jwtVerify(token);

    if (!payload) {
      const response: IBaseResponse = {
        success: false,
        statusCode: 401,
        message: 'Invalid token',
        data: null,
        meta: null,
      };

      return res.status(401).json(response);
    }

    const user = await SupabaseAdapter.findById<IUser & { password: string }>(
      supabaseServiceClient,
      Database.users,
      payload.user.id,
      {
        selection: '*, user_info:users_info(*), user_roles(*, role:roles(*))',
      },
    );

    const { password: _, ...safeUser } = user.data || {};

    if (!user.success || !user.data) {
      const response: IBaseResponse = {
        success: false,
        statusCode: 401,
        message: 'User not found',
        data: null,
        meta: null,
      };

      return res.status(401).json(response);
    }

    const response: IBaseResponse<typeof safeUser> = {
      success: true,
      statusCode: 200,
      message: 'User profile retrieved successfully',
      data: safeUser,
      meta: null,
    };

    return res.status(200).json(response);
  } catch (error) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 500,
      message: 'Failed to retrieve user profile',
      data: null,
      meta: null,
    };

    return res.status(500).json(response);
  }
}

async function handleUpdate(req: NextApiRequest, res: NextApiResponse) {
  const { token, user } = getServerAuthSession(req);

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

  const payload = jwtVerify(token);

  if (!payload) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 401,
      message: 'Invalid token',
      data: null,
      meta: null,
    };

    return res.status(401).json(response);
  }

  const { success, data, ...restProps } = await validate<TProfileUpdateDto>(profileUpdateSchema, req.body);

  if (!success) return res.status(400).json({ success, data, ...restProps });

  const { name, email, ...rest } = data;

  try {
    const existingUser = await SupabaseAdapter.findById<IUser & { password: string }>(
      supabaseServiceClient,
      Database.users,
      user?.id,
    );

    if (!existingUser.success) {
      const response: IBaseResponse = {
        success: false,
        statusCode: 404,
        message: 'User does not exist',
        data: null,
        meta: null,
      };

      return res.status(404).json(response);
    }

    const userPayload: any = {
      name,
      email,
    };

    let updateResult: IBaseResponse<IUser & { password: string }>;

    if (Object.keys(userPayload).length) {
      if (email) {
        const emailCheck = await SupabaseAdapter.findOne<IUser & { password: string }>(
          supabaseServiceClient,
          Database.users,
          { textFilters: { conditions: { email: { eq: email }, id: { neq: user?.id as string } } } },
        );

        if (emailCheck.data) {
          const response: IBaseResponse = {
            success: false,
            statusCode: 409,
            message: 'Email already exists',
            data: null,
            meta: null,
          };

          return res.status(409).json(response);
        }
      }

      updateResult = await SupabaseAdapter.update<IUser & { password: string }>(
        supabaseServiceClient,
        Database.users,
        user?.id,
        userPayload,
      );

      if (!updateResult.success) {
        const response: IBaseResponse = {
          success: false,
          statusCode: updateResult.statusCode || 400,
          message: 'User profile update failed',
          data: null,
          meta: null,
        };

        return res.status(updateResult.statusCode || 400).json(response);
      }
    }

    if (Toolbox.isNotEmpty(rest)) {
      const userInfoResult = await SupabaseAdapter.rawQuery(supabaseServiceClient, Database.usersInfo, {
        method: 'update',
        filters: [{ type: 'eq', column: 'user_id', value: user?.id }],
        values: rest,
      });

      if (!userInfoResult.success) {
        const response: IBaseResponse = {
          success: false,
          statusCode: 500,
          message: userInfoResult.message || 'Failed to update user info',
          data: null,
          meta: null,
        };

        return res.status(500).json(response);
      }
    }

    const result = await SupabaseAdapter.findById<IUser & { password: string }>(
      supabaseServiceClient,
      Database.users,
      user?.id,
      {
        selection: '*, user_info:users_info(*), user_roles(*, role:roles(*))',
      },
    );

    if (!result.success) {
      const response: IBaseResponse = {
        success: false,
        statusCode: 500,
        message: 'Failed to fetch updated user',
        data: null,
        meta: null,
      };

      return res.status(500).json(response);
    }

    const { password: _, ...safeUser } = result.data;

    const response: IBaseResponse<typeof safeUser> = {
      success: true,
      statusCode: 200,
      message: 'User profile updated successfully',
      data: safeUser,
      meta: null,
    };

    return res.status(200).json(response);
  } catch (error) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 500,
      message: 'User profile update failed',
      data: null,
      meta: null,
    };

    return res.status(500).json(response);
  }
}
