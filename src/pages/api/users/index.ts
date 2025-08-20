import { IBaseResponse, TId } from '@base/interfaces';
import { supabaseServiceClient } from '@lib/config/supabase';
import { Database } from '@lib/constant/database';
import { Roles } from '@lib/constant/roles';
import { SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import { Toolbox } from '@lib/utils/toolbox';
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
  const filters = req.query;

  try {
    const result = await SupabaseAdapter.find<IUser & { password: string }>(
      supabaseServiceClient,
      Database.users,
      filters,
      {
        selection: '*, user_info:users_info(*), user_roles(*)',
      },
    );

    if (!result.success) {
      const response: IBaseResponse<[]> = {
        success: false,
        statusCode: result.statusCode || 400,
        message: 'Failed to fetch users',
        data: [],
        meta: null,
      };

      return res.status(result.statusCode || 400).json(response);
    }

    const safeUsers = result.data.map((user) => {
      const { password: _, ...safeUser } = user;
      return safeUser;
    });

    const response: IBaseResponse<typeof safeUsers> = {
      success: true,
      statusCode: 200,
      message: 'Users fetched successfully',
      data: safeUsers,
      meta: result.meta,
    };

    return res.status(200).json(response);
  } catch (error) {
    const response: IBaseResponse<[]> = {
      success: false,
      statusCode: 500,
      message: 'Failed to fetch users',
      data: [],
      meta: null,
    };

    return res.status(500).json(response);
  }
}

async function handleCreate(req: NextApiRequest, res: NextApiResponse) {
  const { name, phone_code, phone, email, password, is_admin, is_active, roles, ...rest } = req.body;

  if (!phone) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 400,
      message: 'Missing required phone field',
      data: null,
      meta: null,
    };

    return res.status(400).json(response);
  }

  try {
    const phoneCheck = await SupabaseAdapter.findOne<IUser & { password: string }>(
      supabaseServiceClient,
      Database.users,
      { textFilters: { phone: { eq: phone } } },
    );

    if (phoneCheck.data) {
      const response: IBaseResponse = {
        success: false,
        statusCode: 409,
        message: 'Phone already exists',
        data: null,
        meta: null,
      };

      return res.status(409).json(response);
    }

    if (email) {
      const emailCheck = await SupabaseAdapter.findOne<IUser & { password: string }>(
        supabaseServiceClient,
        Database.users,
        { textFilters: { email: { eq: email } } },
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

    const userPayload: any = {
      name,
      phone_code,
      phone,
      email,
      is_admin,
      is_active,
    };

    if (password) {
      userPayload.password = await bcrypt.hash(password, 12);
    }

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

    if (Toolbox.isEmpty(roles)) {
      const customerRoleResult = await SupabaseAdapter.findOne<IRole>(supabaseServiceClient, Database.roles, {
        textFilters: { name: { eq: Roles.CUSTOMER } },
      });

      let customerRoleId: TId;

      if (customerRoleResult.data) {
        customerRoleId = customerRoleResult.data.id;
      } else {
        const roleResult = await SupabaseAdapter.create<IRole>(supabaseServiceClient, Database.roles, {
          name: Roles.CUSTOMER,
        });

        if (!roleResult.success) {
          const response: IBaseResponse = {
            success: false,
            statusCode: 500,
            message: roleResult.message || 'Failed to create default role',
            data: null,
            meta: null,
          };

          return res.status(500).json(response);
        }

        customerRoleId = roleResult.data.id;
      }

      const userRoleResult = await SupabaseAdapter.create(supabaseServiceClient, Database.userRoles, {
        user_id: newUser.id,
        role_id: customerRoleId,
      });

      if (!userRoleResult.success) {
        const response: IBaseResponse = {
          success: false,
          statusCode: 500,
          message: userRoleResult.message || 'Failed to assign default role',
          data: null,
          meta: null,
        };

        return res.status(500).json(response);
      }
    } else {
      for (const role of roles) {
        if (role.id) {
          const userRoleResult = await SupabaseAdapter.create(supabaseServiceClient, Database.userRoles, {
            user_id: newUser.id,
            role_id: role.id,
          });

          if (!userRoleResult.success) {
            const response: IBaseResponse = {
              success: false,
              statusCode: 500,
              message: userRoleResult.message || 'Failed to assign role',
              data: null,
              meta: null,
            };

            return res.status(500).json(response);
          }
        }
      }
    }

    const result = await SupabaseAdapter.findById<IUser & { password: string }>(
      supabaseServiceClient,
      Database.users,
      newUser.id,
      {
        selection: '*, user_info:users_info(*), user_roles(*)',
      },
    );

    if (!result.success) {
      const response: IBaseResponse = {
        success: false,
        statusCode: 500,
        message: 'Failed to fetch created user',
        data: null,
        meta: null,
      };

      return res.status(500).json(response);
    }

    const { password: _, ...safeUser } = result.data;

    const response: IBaseResponse<typeof safeUser> = {
      success: true,
      statusCode: 201,
      message: 'User created successfully',
      data: safeUser,
      meta: null,
    };

    return res.status(201).json(response);
  } catch (error) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 500,
      message: 'User creation failed',
      data: null,
      meta: null,
    };

    return res.status(500).json(response);
  }
}
