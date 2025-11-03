import BaseSearch from '@base/components/BaseSearch';
import PageHeader from '@base/components/PageHeader';
import PageWrapper from '@base/container/PageWrapper';
import { Toolbox } from '@lib/utils/toolbox';
import Authorization from '@modules/auth/components/Authorization';
import WithAuthorization from '@modules/auth/components/WithAuthorization';
import { ISettingsIdentity } from '@modules/settings/lib/interfaces';
import { SettingsServices } from '@modules/settings/lib/services';
import SuppliersFilter from '@modules/suppliers/components/SuppliersFilter';
import SuppliersForm from '@modules/suppliers/components/SuppliersForm';
import SuppliersList from '@modules/suppliers/components/SuppliersList';
import { SuppliersHooks } from '@modules/suppliers/lib/hooks';
import { ISuppliersFilter } from '@modules/suppliers/lib/interfaces';
import { Button, Drawer, Form, message, Tag } from 'antd';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';

interface IProps {
  settingsIdentity: ISettingsIdentity;
}

const SuppliersPage: NextPage<IProps> = ({ settingsIdentity }) => {
  const router = useRouter();
  const [messageApi, messageHolder] = message.useMessage();
  const [formInstance] = Form.useForm();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const { page = '1', limit = '10', ...rest } = Toolbox.parseQueryParams<ISuppliersFilter>(router.asPath);

  const suppliersQuery = SuppliersHooks.useFind({
    options: {
      ...rest,
      page,
      limit,
      search_fields: ['name', 'phone', 'email'],
    },
  });

  const supplierCreateFn = SuppliersHooks.useCreate({
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
    <PageWrapper
      title="Suppliers"
      baseTitle={settingsIdentity?.name}
      description={settingsIdentity?.description}
      icon={settingsIdentity?.icon_url}
      image={settingsIdentity?.social_image_url}
    >
      {messageHolder}
      <PageHeader
        title="Suppliers"
        subTitle={<BaseSearch />}
        tags={[<Tag key={1}>Total: {suppliersQuery.data?.meta?.total || 0}</Tag>]}
        extra={
          <Authorization allowedPermissions={['suppliers:write']}>
            <Button type="primary" onClick={() => setDrawerOpen(true)}>
              Create
            </Button>
          </Authorization>
        }
      />
      <SuppliersFilter
        initialValues={Toolbox.toCleanObject(router.query)}
        onChange={(values) => {
          router.push({
            query: Toolbox.toCleanObject({ ...router.query, ...values }),
          });
        }}
      />
      <SuppliersList
        isLoading={suppliersQuery.isLoading}
        data={suppliersQuery.data?.data}
        pagination={{
          current: +page,
          pageSize: +limit,
          total: suppliersQuery.data?.meta?.total,
          onChange: (page, limit) =>
            router.push({
              query: Toolbox.toCleanObject({ ...router.query, page, limit }),
            }),
        }}
      />
      <Drawer width={640} title="Create a new supplier" open={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
        <SuppliersForm
          form={formInstance}
          initialValues={{ is_active: 'true' }}
          isLoading={supplierCreateFn.isPending}
          onFinish={(values) => supplierCreateFn.mutate(values)}
        />
      </Drawer>
    </PageWrapper>
  );
};

export default WithAuthorization(SuppliersPage, { allowedPermissions: ['suppliers:read'] });

export const getServerSideProps: GetServerSideProps<IProps> = async () => {
  try {
    const { success, data: settings } = await SettingsServices.find();

    if (!success) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        settingsIdentity: settings?.identity ?? null,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
