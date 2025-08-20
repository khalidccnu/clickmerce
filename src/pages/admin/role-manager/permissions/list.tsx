import BaseSearch from '@base/components/BaseSearch';
import PageHeader from '@base/components/PageHeader';
import PageWrapper from '@base/container/PageWrapper';
import { Toolbox } from '@lib/utils/toolbox';
import Authorization from '@modules/auth/components/Authorization';
import WithAuthorization from '@modules/auth/components/WithAuthorization';
import PermissionsForm from '@modules/permissions/components/PermissionsForm';
import PermissionsList from '@modules/permissions/components/PermissionsList';
import { PermissionsHooks } from '@modules/permissions/lib/hooks';
import { IPermissionsFilter } from '@modules/permissions/lib/interfaces';
import { Button, Drawer, Form, message, Tag } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';

const PermissionsPage = () => {
  const router = useRouter();
  const [messageApi, messageHolder] = message.useMessage();
  const [formInstance] = Form.useForm();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const { page = 1, limit = 10, ...rest } = Toolbox.parseQueryParams<IPermissionsFilter>(router.asPath);

  const permissionsQuery = PermissionsHooks.useFind({
    options: {
      ...rest,
      page,
      limit,
      search_field: 'name',
    },
  });

  const permissionCreateFn = PermissionsHooks.useCreate({
    config: {
      onSuccess: (res) => {
        if (!res.success) {
          messageApi.error(res.message);
          return;
        }

        setDrawerOpen(false);
        formInstance.resetFields();
        messageApi.success(res.message);
      },
    },
  });

  return (
    <PageWrapper>
      {messageHolder}
      <PageHeader
        title="Permissions"
        subTitle={<BaseSearch />}
        tags={[<Tag key={1}>Total: {permissionsQuery.data?.meta?.total || 0}</Tag>]}
        extra={
          <Authorization allowedAccess={['permissions:write']}>
            <Button type="primary" onClick={() => setDrawerOpen(true)}>
              Create
            </Button>
          </Authorization>
        }
      />
      <PermissionsList
        isLoading={permissionsQuery.isLoading}
        data={permissionsQuery.data?.data}
        pagination={{
          current: page,
          pageSize: limit,
          total: permissionsQuery.data?.meta?.total,
          onChange: (page, limit) =>
            router.push({
              query: Toolbox.toCleanObject({ ...router.query, page, limit }),
            }),
        }}
      />
      <Drawer width={450} title="Create a new permission" open={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
        <PermissionsForm
          form={formInstance}
          initialValues={{ is_active: 'true' }}
          isLoading={permissionCreateFn.isPending}
          onFinish={(values) => permissionCreateFn.mutate(values)}
        />
      </Drawer>
    </PageWrapper>
  );
};

export default WithAuthorization(PermissionsPage, {
  allowedAccess: ['permissions:read'],
});
