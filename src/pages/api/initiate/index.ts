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
    case 'OPTIONS':
      return res.status(200).end();
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
      is_system_generated: 'true',
      is_verified: 'true',
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

    const { identity, s3, vat, tax, email: settingsEmail, sms } = settings;

    const purifiedSettingsIdentity = {
      ...identity,
      icon_url: identity.icon_url || null,
      logo_url: identity.logo_url || null,
      social_image_url: identity.social_image_url || null,
      description: identity.description || null,
      phone: identity.phone || null,
      email: identity.email || null,
      address: identity.address || null,
      fb_url: identity.fb_url || null,
      ig_url: identity.ig_url || null,
      yt_url: identity.yt_url || null,
      is_user_registration_acceptance: identity.is_user_registration_acceptance || false,
      need_user_registration_verification: identity.need_user_registration_verification || false,
    };

    const purifiedSettingsS3 = {
      provider: s3?.provider || null,
      access_key_id: s3?.access_key_id || null,
      secret_access_key: s3?.secret_access_key || null,
      endpoint: s3?.endpoint || null,
      custom_url: s3?.custom_url || null,
      region: s3?.region || null,
      bucket: s3?.bucket || null,
    };

    const purifiedSettingsEmail = {
      ...settingsEmail,
      host: settingsEmail?.host || null,
      port: settingsEmail?.port || null,
      username: settingsEmail?.username || null,
      password: settingsEmail?.password || null,
      is_secure: settingsEmail?.is_secure || false,
      api_key: settingsEmail?.api_key || null,
      region: settingsEmail?.region || null,
    };

    const purifiedSettingsSms = {
      ...sms,
      account_sid: sms?.account_sid || null,
      auth_token: sms?.auth_token || null,
      api_key: sms?.api_key || null,
      api_secret: sms?.api_secret || null,
      region: sms?.region || null,
    };

    const settingsResult = await SupabaseAdapter.create(supabaseServiceClient, Database.settings, {
      identity: purifiedSettingsIdentity,
      s3: purifiedSettingsS3,
      vat,
      tax,
      email: purifiedSettingsEmail,
      sms: purifiedSettingsSms,
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
