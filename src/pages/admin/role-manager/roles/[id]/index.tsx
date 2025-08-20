import PageHeader from '@base/components/PageHeader';
import PageWrapper from '@base/container/PageWrapper';
import { Roles } from '@lib/constant/roles';
import { Toolbox } from '@lib/utils/toolbox';
import WithAuthorization from '@modules/auth/components/WithAuthorization';
import { getAccess } from '@modules/auth/lib/utils';
import { IPermission } from '@modules/permissions/lib/interfaces';
import { RolesHooks } from '@modules/roles/lib/hooks';
import { Checkbox, Empty, message, Spin } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { RiAlarmWarningFill } from 'react-icons/ri';

const RolesIdPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [messageApi, messageHolder] = message.useMessage();
  const [groupedPermissions, setGroupedPermissions] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const roleQuery = RolesHooks.useFindById({
    id: String(id),
    config: {
      queryKey: [],
      enabled: !!id,
    },
  });

  const roleAvailablePermissionsQuery = RolesHooks.useFindAvailablePermissionsById({
    id: String(id),
    config: {
      queryKey: [],
      enabled: !!id,
    },
  });

  const rolePermissionsCreateFn = RolesHooks.useAddPermissionsById({
    config: {
      onSuccess: (res) => {
        if (!res.success) {
          messageApi.error(res.message);
          return;
        }

        messageApi.success(res.message);
      },
    },
  });

  const rolePermissionsRemoveFn = RolesHooks.useRemovePermissionsById({
    config: {
      onSuccess: (res) => {
        if (!res.success) {
          messageApi.error(res.message);
          return;
        }

        messageApi.success(res.message);
      },
    },
  });

  useEffect(() => {
    if (roleAvailablePermissionsQuery.data?.data) {
      const purifiedGroupedPermissions = Toolbox.groupByProperty(
        roleAvailablePermissionsQuery.data?.data || [],
        'permission_type.name',
      );

      setGroupedPermissions(purifiedGroupedPermissions);
      setLoading(false);
    }
  }, [roleAvailablePermissionsQuery.data?.data]);

  if (roleQuery.isLoading || isLoading) {
    return (
      <div className="text-center">
        <Spin />
      </div>
    );
  }

  if (roleQuery.data?.data?.name === Roles.SUPER_ADMIN) {
    return (
      <div className="flex justify-center">
        <div className="flex flex-col items-center bg-white p-5 rounded-lg shadow-md">
          <RiAlarmWarningFill color="#ef4444" size={32} className="animate-pulse" />
          <h3 className="text-2xl font-bold text-red-500">Unauthorized Access</h3>
          <p className="mt-2 text-gray-500">You do not have permission to access this page!</p>
        </div>
      </div>
    );
  }

  return (
    <PageWrapper>
      {messageHolder}
      <PageHeader
        title={
          <h2 className="text-xl font-semibold">
            Manage permissions for <span className="text-[var(--color-primary)]">{roleQuery.data?.data?.name}</span>
          </h2>
        }
        onBack={() => router.back()}
      />
      <div className="flex flex-col gap-4">
        {groupedPermissions?.length ? (
          groupedPermissions?.map((permission: { name: string; values: IPermission[] }) => {
            return (
              <div key={permission?.name} className="flex flex-col gap-2">
                <div className="flex justify-between items-center gap-4">
                  <h3 className="font-medium text-lg">{permission?.name}</h3>
                  <Checkbox
                    className="font-medium"
                    checked={permission?.values?.every((permission) => permission.is_already_added)}
                    indeterminate={
                      permission?.values?.some((permission) => permission.is_already_added) &&
                      !permission?.values?.every((permission) => permission.is_already_added)
                    }
                    onChange={() => {
                      getAccess(['roles:update'], () => {
                        const checkedAll = permission?.values?.every((permission) => permission?.is_already_added);

                        if (checkedAll) {
                          rolePermissionsRemoveFn.mutate({
                            id: String(id),
                            permissions: permission?.values
                              ?.filter((permission) => permission?.is_already_added)
                              .map((permission) => permission?.id),
                          });
                        } else {
                          rolePermissionsCreateFn.mutate({
                            id: String(id),
                            permissions: permission?.values
                              ?.filter((permission) => !permission?.is_already_added)
                              .map((permission) => permission?.id),
                          });
                        }
                      });
                    }}
                  >
                    Select All
                  </Checkbox>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xxl:grid-cols-5 gap-4">
                  {permission?.values?.map((value) => (
                    <li key={value?.id}>
                      <Checkbox
                        checked={value?.is_already_added}
                        onChange={() => {
                          getAccess(['roles:update'], () => {
                            if (value?.is_already_added) {
                              rolePermissionsRemoveFn.mutate({
                                id: String(id),
                                permissions: [value?.id],
                              });
                            } else {
                              rolePermissionsCreateFn.mutate({
                                id: String(id),
                                permissions: [value?.id],
                              });
                            }
                          });
                        }}
                      >
                        {value.name}
                      </Checkbox>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })
        ) : (
          <Empty description="No permissions available" />
        )}
      </div>
    </PageWrapper>
  );
};

export default WithAuthorization(RolesIdPage, {
  allowedAccess: ['roles:update'],
});
