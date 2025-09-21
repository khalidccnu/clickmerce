import BaseSearch from '@base/components/BaseSearch';
import PageHeader from '@base/components/PageHeader';
import PageWrapper from '@base/container/PageWrapper';
import { Toolbox } from '@lib/utils/toolbox';
import Authorization from '@modules/auth/components/Authorization';
import WithAuthorization from '@modules/auth/components/WithAuthorization';
import GenericsFilter from '@modules/generics/components/GenericsFilter';
import GenericsForm from '@modules/generics/components/GenericsForm';
import GenericsList from '@modules/generics/components/GenericsList';
import { GenericsHooks } from '@modules/generics/lib/hooks';
import { IGenericsFilter } from '@modules/generics/lib/interfaces';
import { Button, Drawer, Form, message, Tag } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';

const GenericsPage = () => {
  const router = useRouter();
  const [messageApi, messageHolder] = message.useMessage();
  const [formInstance] = Form.useForm();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const { page = '1', limit = '10', ...rest } = Toolbox.parseQueryParams<IGenericsFilter>(router.asPath);

  const genericsQuery = GenericsHooks.useFind({
    options: {
      ...rest,
      page,
      limit,
      search_field: 'name',
    },
  });

  const genericCreateFn = GenericsHooks.useCreate({
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
        title="Generics"
        subTitle={<BaseSearch />}
        tags={[<Tag key={1}>Total: {genericsQuery.data?.meta?.total || 0}</Tag>]}
        extra={
          <Authorization allowedPermissions={['generics:write']}>
            <Button type="primary" onClick={() => setDrawerOpen(true)}>
              Create
            </Button>
          </Authorization>
        }
      />
      <GenericsFilter
        initialValues={Toolbox.toCleanObject(router.query)}
        onChange={(values) => {
          router.push({
            query: Toolbox.toCleanObject({ ...router.query, ...values }),
          });
        }}
      />
      <GenericsList
        isLoading={genericsQuery.isLoading}
        data={genericsQuery.data?.data}
        pagination={{
          current: +page,
          pageSize: +limit,
          total: genericsQuery.data?.meta?.total,
          onChange: (page, limit) =>
            router.push({
              query: Toolbox.toCleanObject({ ...router.query, page, limit }),
            }),
        }}
      />
      <Drawer width={640} title="Create a new generic" open={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
        <GenericsForm
          form={formInstance}
          initialValues={{ is_active: 'true' }}
          isLoading={genericCreateFn.isPending}
          onFinish={(values) => genericCreateFn.mutate(values)}
        />
      </Drawer>
    </PageWrapper>
  );
};

export default WithAuthorization(GenericsPage, { allowedPermissions: ['generics:read'] });
