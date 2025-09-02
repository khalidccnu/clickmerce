import BaseSearch from '@base/components/BaseSearch';
import PageHeader from '@base/components/PageHeader';
import PageWrapper from '@base/container/PageWrapper';
import { IBaseFilter } from '@base/interfaces';
import { Toolbox } from '@lib/utils/toolbox';
import Authorization from '@modules/auth/components/Authorization';
import WithAuthorization from '@modules/auth/components/WithAuthorization';
import RolesForm from '@modules/roles/components/RolesForm';
import RolesList from '@modules/roles/components/RolesList';
import { RolesHooks } from '@modules/roles/lib/hooks';
import { Button, Drawer, Form, message, Tag } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';

const RolesPage = () => {
  const router = useRouter();
  const [messageApi, messageHolder] = message.useMessage();
  const [formInstance] = Form.useForm();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const { page = '1', limit = '10', ...rest } = Toolbox.parseQueryParams<IBaseFilter>(router.asPath);

  const rolesQuery = RolesHooks.useFind({
    options: {
      ...rest,
      page,
      limit,
      search_field: 'name',
    },
  });

  const roleCreateFn = RolesHooks.useCreate({
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
        title="Roles"
        subTitle={<BaseSearch />}
        tags={[<Tag key={1}>Total: {rolesQuery.data?.meta?.total || 0}</Tag>]}
        extra={
          <Authorization allowedPermissions={['roles:write']}>
            <Button type="primary" onClick={() => setDrawerOpen(true)}>
              Create
            </Button>
          </Authorization>
        }
      />
      <RolesList
        isLoading={rolesQuery.isLoading}
        data={rolesQuery.data?.data}
        pagination={{
          current: +page,
          pageSize: +limit,
          total: rolesQuery.data?.meta?.total,
          onChange: (page, limit) =>
            router.push({
              query: Toolbox.toCleanObject({ ...router.query, page, limit }),
            }),
        }}
      />
      <Drawer width={450} title="Create a new role" open={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
        <RolesForm
          form={formInstance}
          initialValues={{ is_active: 'true' }}
          isLoading={roleCreateFn.isPending}
          onFinish={(values) => roleCreateFn.mutate(values)}
        />
      </Drawer>
    </PageWrapper>
  );
};

export default WithAuthorization(RolesPage, {
  allowedPermissions: ['roles:read'],
});
