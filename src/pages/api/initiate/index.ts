import { IBaseResponse } from '@base/interfaces';
import { supabaseServiceClient } from '@lib/config/supabase/serviceClient';
import { Database } from '@lib/constant/database';
import { Roles } from '@lib/constant/roles';
import { SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import { Toolbox } from '@lib/utils/toolbox';
import { validate } from '@lib/utils/yup';
import { initiateCreateSchema, TInitiateCreateDto } from '@modules/initiate/lib/dtos';
import { IRole } from '@modules/roles/lib/interfaces';
import { IUser } from '@modules/users/lib/interfaces';
import bcrypt from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return handleGet(req, res);
    case 'POST':
      return handleCreate(req, res);
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
  const users = await SupabaseAdapter.find(supabaseServiceClient, Database.users);
  const isInitiate = Toolbox.isNotEmpty(users.data);

  const response: IBaseResponse<{ success: boolean }> = {
    success: true,
    statusCode: 200,
    message: 'Initiate status fetched',
    data: { success: isInitiate },
    meta: null,
  };

  return res.status(200).json(response);
}

async function handleCreate(req: NextApiRequest, res: NextApiResponse) {
  const { success, data, ...restProps } = await validate<TInitiateCreateDto>(initiateCreateSchema, req.body, {
    stripUnknown: true,
  });

  if (!success) return res.status(400).json({ success, data, ...restProps });

  const { type: _, user, settings } = data;
  const { name, phone, email, password, ...rest } = user;

  try {
    const users = await SupabaseAdapter.find(supabaseServiceClient, Database.users);
    const isInitiate = Toolbox.isNotEmpty(users.data);

    if (isInitiate) {
      const response: IBaseResponse = {
        success: false,
        statusCode: 400,
        message: 'Initiate already exists',
        data: null,
        meta: null,
      };

      return res.status(400).json(response);
    }

    const userPayload = {
      name,
      phone,
      email,
      password: null,
      is_admin: true,
      is_active: true,
    };

    userPayload.password = await bcrypt.hash(password, 12);

    const createResult = await SupabaseAdapter.create<IUser & { password: string }>(
      supabaseServiceClient,
      Database.users,
      userPayload,
    );

    if (!createResult.success) {
      const response: IBaseResponse = {
        success: false,
        statusCode: 400,
        message: 'User creation failed',
        data: null,
        meta: null,
      };

      return res.status(400).json(response);
    }

    const newUser = createResult.data;

    const userInfoResult = await SupabaseAdapter.create(supabaseServiceClient, Database.usersInfo, {
      ...rest,
      user_id: newUser.id,
    });

    if (!userInfoResult.success) {
      await SupabaseAdapter.delete(supabaseServiceClient, Database.users, newUser.id);

      const response: IBaseResponse = {
        success: false,
        statusCode: 500,
        message: userInfoResult.message || 'Failed to create user info',
        data: null,
        meta: null,
      };

      return res.status(500).json(response);
    }

    const roleResult = await SupabaseAdapter.create<IRole>(supabaseServiceClient, Database.roles, {
      name: Roles.SUPER_ADMIN,
    });

    if (!roleResult.success) {
      await SupabaseAdapter.delete(supabaseServiceClient, Database.users, newUser.id);
      await SupabaseAdapter.rawQuery(supabaseServiceClient, Database.usersInfo, {
        method: 'delete',
        filters: [{ type: 'eq', column: 'user_id', value: newUser.id }],
      });

      const response: IBaseResponse = {
        success: false,
        statusCode: 500,
        message: roleResult.message || 'Failed to create default role',
        data: null,
        meta: null,
      };

      return res.status(500).json(response);
    }

    const userRoleResult = await SupabaseAdapter.create(supabaseServiceClient, Database.userRoles, {
      user_id: newUser.id,
      role_id: roleResult.data.id,
    });

    if (!userRoleResult.success) {
      await SupabaseAdapter.delete(supabaseServiceClient, Database.users, newUser.id);
      await SupabaseAdapter.rawQuery(supabaseServiceClient, Database.usersInfo, {
        method: 'delete',
        filters: [{ type: 'eq', column: 'user_id', value: newUser.id }],
      });
      await SupabaseAdapter.rawQuery(supabaseServiceClient, Database.roles, {
        method: 'delete',
        filters: [{ type: 'eq', column: 'name', value: Roles.SUPER_ADMIN }],
      });

      const response: IBaseResponse = {
        success: false,
        statusCode: 500,
        message: userRoleResult.message || 'Failed to assign default role',
        data: null,
        meta: null,
      };

      return res.status(500).json(response);
    }

    const { identity, s3 } = settings;

    const purifiedSettingsS3 = {
      access_key_id: s3?.access_key_id || null,
      secret_access_key: s3?.secret_access_key || null,
      endpoint: s3?.endpoint || null,
      r2_worker_endpoint: s3?.r2_worker_endpoint || null,
      region: s3?.region || null,
      bucket: s3?.bucket || null,
    };

    const settingsResult = await SupabaseAdapter.create(supabaseServiceClient, Database.settings, {
      identity,
      s3: purifiedSettingsS3,
    });

    if (!settingsResult.success) {
      await SupabaseAdapter.delete(supabaseServiceClient, Database.users, newUser.id);
      await SupabaseAdapter.rawQuery(supabaseServiceClient, Database.usersInfo, {
        method: 'delete',
        filters: [{ type: 'eq', column: 'user_id', value: newUser.id }],
      });
      await SupabaseAdapter.rawQuery(supabaseServiceClient, Database.roles, {
        method: 'delete',
        filters: [{ type: 'eq', column: 'name', value: Roles.SUPER_ADMIN }],
      });
      await SupabaseAdapter.rawQuery(supabaseServiceClient, Database.userRoles, {
        method: 'delete',
        filters: [
          { type: 'eq', column: 'user_id', value: newUser.id },
          { type: 'eq', column: 'role_id', value: roleResult.data.id },
        ],
      });

      const response: IBaseResponse = {
        success: false,
        statusCode: 500,
        message: settingsResult.message || 'Failed to create settings',
        data: null,
        meta: null,
      };

      return res.status(500).json(response);
    }

    const response: IBaseResponse = {
      success: true,
      statusCode: 201,
      message: 'Initiate successfully',
      data: null,
      meta: null,
    };

    return res.status(201).json(response);
  } catch (error) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 500,
      message: 'Initiate failed',
      data: null,
      meta: null,
    };

    return res.status(500).json(response);
  }
}
