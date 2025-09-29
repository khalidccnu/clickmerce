import { Env } from '.environments';
import { IBaseResponse } from '@base/interfaces';
import { supabaseServiceClient } from '@lib/config/supabase/serviceClient';
import { Database } from '@lib/constant/database';
import { TPermission } from '@lib/constant/permissions';
import { buildSelectionFn, SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import { validate } from '@lib/utils/yup';
import { loginSchema, TLoginDto } from '@modules/auth/lib/dtos';
import { IUser } from '@modules/users/lib/interfaces';
import bcrypt from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { jwtSign } from '../lib/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'OPTIONS':
      return res.status(200).end();
    case 'POST':
      return handleLogin(req, res);
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

async function handleLogin(req: NextApiRequest, res: NextApiResponse) {
  const { success, data, ...restProps } = await validate<TLoginDto>(loginSchema, req.body);

  if (!success) return res.status(400).json({ success, data, ...restProps });

  const { phone, password } = data;

  const user = await SupabaseAdapter.findOne<IUser & { password: string }>(supabaseServiceClient, Database.users, {
    textFilters: { conditions: { phone: { eq: phone } } },
  });

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

  const isPasswordMatched = await bcrypt.compare(password, user.data.password);

  if (!isPasswordMatched) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 401,
      message: 'Invalid password',
      data: null,
      meta: null,
    };

    return res.status(401).json(response);
  }

  if (!user.data.is_admin) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 403,
      message: 'User is not permitted to login',
      data: null,
      meta: null,
    };

    return res.status(403).json(response);
  }

  const userRoles = await SupabaseAdapter.find(
    supabaseServiceClient,
    Database.userRoles,
    {
      textFilters: { conditions: { user_id: { eq: user.data.id as string } } },
    },
    { selection: buildSelectionFn({ relations: { role: { table: 'roles' } } }) },
  );

  const roles = userRoles.data.map((ur) => ur.role.name);
  const roleIds = userRoles.data.map((ur) => ur.role.id);
  let permissions: TPermission[] = [];

  if (roleIds.length) {
    const rolePermissions = await SupabaseAdapter.find(
      supabaseServiceClient,
      Database.rolePermissions,
      {
        textFilters: { conditions: { role_id: { in: roleIds } } },
      },
      { selection: buildSelectionFn({ relations: { permission: { table: 'permissions' } } }) },
    );

    permissions = rolePermissions?.data?.map((rp) => rp?.permission?.name);
  }

  const token = jwtSign({ user: { id: user.data.id, roles, permissions } });
  delete user.data.password;

  const response: IBaseResponse<{ user: IUser; token: string }> = {
    success: true,
    statusCode: 200,
    message: 'Logged in successfully',
    data: {
      user: Env.isProduction ? null : user.data,
      token,
    },
    meta: null,
  };

  return res.status(200).json(response);
}
