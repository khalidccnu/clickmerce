import { IBaseFilter, IBaseResponse, TId } from '@base/interfaces';
import { supabaseBrowserClient } from '@lib/config/supabase/browserClient';
import { Database } from '@lib/constant/database';
import { responseHandlerFn } from '@lib/utils/errorHandler';
import { SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import { IPermission, IPermissionsResponse } from '../../permissions/lib/interfaces';
import { IRole, IRoleCreate, IRolesResponse } from './interfaces';

const END_POINT: string = Database.roles;

export const RolesServices = {
  NAME: END_POINT,

  findById: async (id: TId): Promise<IBaseResponse<IRole>> => {
    try {
      const res = await SupabaseAdapter.findById<IRole>(supabaseBrowserClient, END_POINT, id);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  find: async (filters: IBaseFilter): Promise<IRolesResponse> => {
    const { start_date, end_date, ...restFilters } = filters;
    const newFilters: any = { ...restFilters };

    if (start_date) {
      newFilters.start_date = decodeURIComponent(start_date);
    }

    if (end_date) {
      newFilters.end_date = decodeURIComponent(end_date);
    }

    try {
      const res = await SupabaseAdapter.find<IRole>(supabaseBrowserClient, END_POINT, newFilters);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  findSpecifics: async (roleIds: TId[]): Promise<IRolesResponse> => {
    try {
      const res = await SupabaseAdapter.findByIds<IRole>(supabaseBrowserClient, END_POINT, roleIds);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  create: async (payload: IRoleCreate): Promise<IBaseResponse<IRole>> => {
    try {
      const res = await SupabaseAdapter.create<IRole>(supabaseBrowserClient, END_POINT, payload);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  update: async (payload: { id: TId; data: Partial<IRoleCreate> }): Promise<IBaseResponse<IRole>> => {
    try {
      const res = await SupabaseAdapter.update<IRole>(supabaseBrowserClient, END_POINT, payload.id, payload.data);
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  findAvailablePermissionsById: async (id: TId): Promise<IPermissionsResponse> => {
    try {
      const roleResponse = await SupabaseAdapter.findById<IRole>(supabaseBrowserClient, END_POINT, id);

      if (!roleResponse.data) {
        return {
          success: false,
          statusCode: 404,
          message: 'Role does not exist',
          data: null,
          meta: null,
        };
      }

      const permissionsResponse = await SupabaseAdapter.find<IPermission>(
        supabaseBrowserClient,
        Database.permissions,
        {},
        {
          selection: '*, permission_type:permission_types!inner(*)',
        },
      );

      const permissions = permissionsResponse.data || [];

      const rolePermissionsResponse = await SupabaseAdapter.rawQuery(supabaseBrowserClient, Database.rolePermissions, {
        filters: [{ type: 'eq', column: 'role_id', value: id }],
      });

      const rolePermissionIds = (rolePermissionsResponse.data || []).map((rp) => rp.permission_id);

      const result = permissions.map((permission: IPermission) => ({
        ...permission,
        is_already_added: rolePermissionIds.includes(permission.id),
      }));

      return {
        success: true,
        statusCode: 200,
        message: 'Available permissions found successfully',
        data: result,
        meta: null,
      };
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  addPermissionsById: async (payload: { id: TId; permissions: TId[] }): Promise<IPermissionsResponse> => {
    try {
      const rolePermissions = payload.permissions.map((permissionId) => ({
        role_id: payload.id,
        permission_id: permissionId,
      }));

      await SupabaseAdapter.batchCreate(supabaseBrowserClient, Database.rolePermissions, rolePermissions);

      return {
        success: true,
        statusCode: 201,
        message: 'Permissions added successfully',
        data: [],
        meta: null,
      };
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  removePermissionsById: async (payload: { id: TId; permissions: TId[] }): Promise<IPermissionsResponse> => {
    try {
      const res = await SupabaseAdapter.rawQuery(supabaseBrowserClient, Database.rolePermissions, {
        method: 'delete',
        filters: [
          { type: 'eq', column: 'role_id', value: payload.id },
          { type: 'in', column: 'permission_id', value: payload.permissions },
        ],
      });

      if (!res.success) {
        throw new Error(res.message);
      }

      return {
        success: true,
        statusCode: 200,
        message: 'Permissions removed successfully',
        data: [],
        meta: null,
      };
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },
};
