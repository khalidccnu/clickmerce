import BaseSearch from '@base/components/BaseSearch';
import PageHeader from '@base/components/PageHeader';
import PageWrapper from '@base/container/PageWrapper';
import { Toolbox } from '@lib/utils/toolbox';
import Authorization from '@modules/auth/components/Authorization';
import WithAuthorization from '@modules/auth/components/WithAuthorization';
import DeliveryServiceTypesFilter from '@modules/delivery-service-types/components/DeliveryServiceTypesFilter';
import DeliveryServiceTypesForm from '@modules/delivery-service-types/components/DeliveryServiceTypesForm';
import DeliveryServiceTypesList from '@modules/delivery-service-types/components/DeliveryServiceTypesList';
import { DeliveryServiceTypesHooks } from '@modules/delivery-service-types/lib/hooks';
import { IDeliveryServiceTypesFilter } from '@modules/delivery-service-types/lib/interfaces';
import { ISettingsIdentity } from '@modules/settings/lib/interfaces';
import { SettingsServices } from '@modules/settings/lib/services';
import { Button, Drawer, Form, message, Tag } from 'antd';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';

interface IProps {
  settingsIdentity: ISettingsIdentity;
}

const DeliveryServiceTypesPage: NextPage<IProps> = ({ settingsIdentity }) => {
  const router = useRouter();
  const [messageApi, messageHolder] = message.useMessage();
  const [formInstance] = Form.useForm();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const { page = '1', limit = '10', ...rest } = Toolbox.parseQueryParams<IDeliveryServiceTypesFilter>(router.asPath);

  const deliveryServiceTypesQuery = DeliveryServiceTypesHooks.useFind({
    options: {
      ...rest,
      page,
      limit,
      search_field: 'name',
    },
  });

  const deliveryServiceTypeCreateFn = DeliveryServiceTypesHooks.useCreate({
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
      title="Delivery Service Types"
      baseTitle={settingsIdentity?.name}
      description={settingsIdentity?.description}
      icon={settingsIdentity?.icon_url}
      image={settingsIdentity?.social_image_url}
    >
      {messageHolder}
      <PageHeader
        title="Delivery Service Types"
        subTitle={<BaseSearch />}
        tags={[<Tag key={1}>Total: {deliveryServiceTypesQuery.data?.meta?.total || 0}</Tag>]}
        extra={
          <Authorization allowedPermissions={['delivery_service_types:write']}>
            <Button type="primary" onClick={() => setDrawerOpen(true)}>
              Create
            </Button>
          </Authorization>
        }
      />
      <DeliveryServiceTypesFilter
        initialValues={Toolbox.toCleanObject(router.query)}
        onChange={(values) => {
          router.push({
            query: Toolbox.toCleanObject({ ...router.query, ...values }),
          });
        }}
      />
      <DeliveryServiceTypesList
        isLoading={deliveryServiceTypesQuery.isLoading}
        data={deliveryServiceTypesQuery.data?.data}
        pagination={{
          current: +page,
          pageSize: +limit,
          total: deliveryServiceTypesQuery.data?.meta?.total,
          onChange: (page, limit) =>
            router.push({
              query: Toolbox.toCleanObject({ ...router.query, page, limit }),
            }),
        }}
      />
      <Drawer
        width={640}
        title="Create a new delivery service type"
        open={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <DeliveryServiceTypesForm
          form={formInstance}
          initialValues={{ is_active: 'true' }}
          isLoading={deliveryServiceTypeCreateFn.isPending}
          onFinish={(values) => deliveryServiceTypeCreateFn.mutate(values)}
        />
      </Drawer>
    </PageWrapper>
  );
};

export default WithAuthorization(DeliveryServiceTypesPage, { allowedPermissions: ['delivery_service_types:read'] });

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
