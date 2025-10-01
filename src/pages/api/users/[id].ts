import { IBaseResponse, TId } from '@base/interfaces';
import { supabaseServiceClient } from '@lib/config/supabase/serviceClient';
import { Database } from '@lib/constant/database';
import { SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import { Toolbox } from '@lib/utils/toolbox';
import { validate } from '@lib/utils/yup';
import { getServerAuthSession } from '@modules/auth/lib/utils/server';
import { TUserUpdateDto, userUpdateSchema } from '@modules/users/lib/dtos';
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
  const { id }: { id?: TId } = req.query;

  if (!id) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 400,
      message: 'Missing required id parameter',
      data: null,
      meta: null,
    };

    return res.status(400).json(response);
  }

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

  try {
    const result = await SupabaseAdapter.findById<IUser & { password: string }>(
      supabaseServiceClient,
      Database.users,
      id,
      {
        selection: '*, user_info:users_info(*), user_roles(*, role:roles(*))',
      },
    );

    if (!result.success) {
      const response: IBaseResponse = {
        success: false,
        statusCode: result.statusCode || 404,
        message: 'Failed to fetch user',
        data: null,
        meta: null,
      };

      return res.status(result.statusCode || 404).json(response);
    }

    const { password: _, ...safeUser } = result.data;

    const response: IBaseResponse<typeof safeUser> = {
      success: true,
      statusCode: 200,
      message: 'User fetched successfully',
      data: safeUser,
      meta: result.meta,
    };

    return res.status(200).json(response);
  } catch (error) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 500,
      message: 'Failed to fetch user',
      data: null,
      meta: null,
    };

    return res.status(500).json(response);
  }
}

async function handleUpdate(req: NextApiRequest, res: NextApiResponse) {
  const { id }: { id?: TId } = req.query;

  if (!id) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 400,
      message: 'Missing required id parameter',
      data: null,
      meta: null,
    };

    return res.status(400).json(response);
  }

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

  const { success, data, ...restProps } = await validate<TUserUpdateDto>(userUpdateSchema, req.body);

  if (!success) return res.status(400).json({ success, data, ...restProps });

  const { name, phone, email, password, is_admin, is_default_customer, is_active, roles, ...rest } = data;

  try {
    const existingUser = await SupabaseAdapter.findById<IUser & { password: string }>(
      supabaseServiceClient,
      Database.users,
      id,
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
      phone,
      email,
      is_admin,
      is_default_customer,
      is_active,
    };

    if (password) {
      userPayload.password = await bcrypt.hash(password, 12);
    }

    let updateResult: IBaseResponse<IUser & { password: string }>;

    if (Object.keys(userPayload).length) {
      if (phone) {
        const phoneCheck = await SupabaseAdapter.findOne<IUser & { password: string }>(
          supabaseServiceClient,
          Database.users,
          {
            textFilters: { conditions: { phone: { eq: phone }, id: { neq: id as string } } },
          },
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
      }

      if (email) {
        const emailCheck = await SupabaseAdapter.findOne<IUser & { password: string }>(
          supabaseServiceClient,
          Database.users,
          { textFilters: { conditions: { email: { eq: email }, id: { neq: id as string } } } },
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

      if (!existingUser.data.is_default_customer && Toolbox.toBool(is_default_customer)) {
        const existingDefaultCustomer = await SupabaseAdapter.findOne<IUser & { password: string }>(
          supabaseServiceClient,
          Database.users,
          { booleanFilters: { conditions: { is_default_customer: { eq: true } } } },
        );

        if (!existingDefaultCustomer.success) {
          const response: IBaseResponse = {
            success: false,
            statusCode: 400,
            message: existingDefaultCustomer.message || 'Failed to check existing default customer',
            data: null,
            meta: null,
          };

          return res.status(400).json(response);
        }

        if (existingDefaultCustomer.data) {
          const response: IBaseResponse = {
            success: false,
            statusCode: 400,
            message: "Already default customer exists. You can't create more than one default customer",
            data: null,
            meta: null,
          };

          return res.status(400).json(response);
        }
      }

      updateResult = await SupabaseAdapter.update<IUser & { password: string }>(
        supabaseServiceClient,
        Database.users,
        id,
        userPayload,
      );

      if (!updateResult.success) {
        const response: IBaseResponse = {
          success: false,
          statusCode: updateResult.statusCode || 400,
          message: 'User update failed',
          data: null,
          meta: null,
        };

        return res.status(updateResult.statusCode || 400).json(response);
      }
    }

    if (Toolbox.isNotEmpty(rest)) {
      const userInfoResult = await SupabaseAdapter.rawQuery(supabaseServiceClient, Database.usersInfo, {
        method: 'update',
        filters: [{ type: 'eq', column: 'user_id', value: id }],
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

    if (Toolbox.isNotEmpty(roles)) {
      const deletedRoles = roles.filter((role) => role.is_deleted);
      const updatedRoles = roles.filter((role) => !role.is_deleted);

      for (const role of deletedRoles) {
        if (role.id) {
          const deleteRoleResult = await SupabaseAdapter.rawQuery(supabaseServiceClient, Database.userRoles, {
            method: 'delete',
            filters: [
              { type: 'eq', column: 'user_id', value: id },
              { type: 'eq', column: 'role_id', value: role.id },
            ],
          });

          if (!deleteRoleResult.success) {
            const response: IBaseResponse = {
              success: false,
              statusCode: 500,
              message: deleteRoleResult.message || 'Failed to delete user role',
              data: null,
              meta: null,
            };

            return res.status(500).json(response);
          }
        }
      }

      for (const role of updatedRoles) {
        if (role.id) {
          const existingUserRolesResult = await SupabaseAdapter.rawQuery(supabaseServiceClient, Database.userRoles, {
            filters: [
              { type: 'eq', column: 'user_id', value: id },
              { type: 'eq', column: 'role_id', value: role.id },
            ],
          });

          if (Toolbox.isEmpty(existingUserRolesResult.data)) {
            await SupabaseAdapter.create(supabaseServiceClient, Database.userRoles, {
              user_id: id,
              role_id: role.id,
            });
          }
        }
      }
    }

    const result = await SupabaseAdapter.findById<IUser & { password: string }>(
      supabaseServiceClient,
      Database.users,
      id,
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
      message: 'User updated successfully',
      data: safeUser,
      meta: null,
    };

    return res.status(200).json(response);
  } catch (error) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 500,
      message: 'User update failed',
      data: null,
      meta: null,
    };

    return res.status(500).json(response);
  }
}
