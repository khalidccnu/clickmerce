import BaseSearch from '@base/components/BaseSearch';
import PageHeader from '@base/components/PageHeader';
import PageWrapper from '@base/container/PageWrapper';
import { Toolbox } from '@lib/utils/toolbox';
import Authorization from '@modules/auth/components/Authorization';
import WithAuthorization from '@modules/auth/components/WithAuthorization';
import DeliveryZonesFilter from '@modules/delivery-zones/components/DeliveryZonesFilter';
import DeliveryZonesForm from '@modules/delivery-zones/components/DeliveryZonesForm';
import DeliveryZonesList from '@modules/delivery-zones/components/DeliveryZonesList';
import { DeliveryZonesHooks } from '@modules/delivery-zones/lib/hooks';
import { IDeliveryZonesFilter } from '@modules/delivery-zones/lib/interfaces';
import { Button, Drawer, Form, message, Tag } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';

const DeliveryZonesPage = () => {
  const router = useRouter();
  const [messageApi, messageHolder] = message.useMessage();
  const [formInstance] = Form.useForm();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const { page = '1', limit = '10', ...rest } = Toolbox.parseQueryParams<IDeliveryZonesFilter>(router.asPath);

  const deliveryZonesQuery = DeliveryZonesHooks.useFind({
    options: {
      ...rest,
      page,
      limit,
      search_field: 'name',
    },
  });

  const deliveryZoneCreateFn = DeliveryZonesHooks.useCreate({
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
        title="Delivery Zones"
        subTitle={<BaseSearch />}
        tags={[<Tag key={1}>Total: {deliveryZonesQuery.data?.meta?.total || 0}</Tag>]}
        extra={
          <Authorization allowedPermissions={['delivery_service_types:write']}>
            <Button type="primary" onClick={() => setDrawerOpen(true)}>
              Create
            </Button>
          </Authorization>
        }
      />
      <DeliveryZonesFilter
        initialValues={Toolbox.toCleanObject(router.query)}
        onChange={(values) => {
          router.push({
            query: Toolbox.toCleanObject({ ...router.query, ...values }),
          });
        }}
      />
      <DeliveryZonesList
        isLoading={deliveryZonesQuery.isLoading}
        data={deliveryZonesQuery.data?.data}
        pagination={{
          current: +page,
          pageSize: +limit,
          total: deliveryZonesQuery.data?.meta?.total,
          onChange: (page, limit) =>
            router.push({
              query: Toolbox.toCleanObject({ ...router.query, page, limit }),
            }),
        }}
      />
      <Drawer width={640} title="Create a new delivery zone" open={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
        <DeliveryZonesForm
          form={formInstance}
          initialValues={{ is_active: 'true' }}
          isLoading={deliveryZoneCreateFn.isPending}
          onFinish={(values) => deliveryZoneCreateFn.mutate(values)}
        />
      </Drawer>
    </PageWrapper>
  );
};

export default WithAuthorization(DeliveryZonesPage, { allowedPermissions: ['delivery_service_types:read'] });
