import BaseSearch from '@base/components/BaseSearch';
import PageHeader from '@base/components/PageHeader';
import PageWrapper from '@base/container/PageWrapper';
import { IBaseFilter } from '@base/interfaces';
import { Toolbox } from '@lib/utils/toolbox';
import Authorization from '@modules/auth/components/Authorization';
import WithAuthorization from '@modules/auth/components/WithAuthorization';
import PermissionTypesForm from '@modules/permission-types/components/PermissionTypesForm';
import PermissionTypesList from '@modules/permission-types/components/PermissionTypesList';
import { PermissionTypesHooks } from '@modules/permission-types/lib/hooks';
import { Button, Drawer, Form, message, Tag } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';

const PermissionTypesPage = () => {
  const router = useRouter();
  const [messageApi, messageHolder] = message.useMessage();
  const [formInstance] = Form.useForm();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const { page = 1, limit = 10, ...rest } = Toolbox.parseQueryParams<IBaseFilter>(router.asPath);

  const permissionTypesQuery = PermissionTypesHooks.useFind({
    options: {
      ...rest,
      page,
      limit,
      search_field: 'name',
    },
  });

  const permissionTypeCreateFn = PermissionTypesHooks.useCreate({
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
        title="Permission Types"
        subTitle={<BaseSearch />}
        tags={[<Tag key={1}>Total: {permissionTypesQuery.data?.meta?.total || 0}</Tag>]}
        extra={
          <Authorization allowedAccess={['permission_types:write']}>
            <Button type="primary" onClick={() => setDrawerOpen(true)}>
              Create
            </Button>
          </Authorization>
        }
      />
      <PermissionTypesList
        isLoading={permissionTypesQuery.isLoading}
        data={permissionTypesQuery.data?.data}
        pagination={{
          current: page,
          pageSize: limit,
          total: permissionTypesQuery.data?.meta?.total,
          onChange: (page, limit) =>
            router.push({
              query: Toolbox.toCleanObject({ ...router.query, page, limit }),
            }),
        }}
      />
      <Drawer width={450} title="Create a new permission type" open={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
        <PermissionTypesForm
          form={formInstance}
          initialValues={{ is_active: 'true' }}
          isLoading={permissionTypeCreateFn.isPending}
          onFinish={(values) => permissionTypeCreateFn.mutate(values)}
        />
      </Drawer>
    </PageWrapper>
  );
};

export default WithAuthorization(PermissionTypesPage, {
  allowedAccess: ['permission_types:read'],
});
