import BaseSearch from '@base/components/BaseSearch';
import PageHeader from '@base/components/PageHeader';
import PageWrapper from '@base/container/PageWrapper';
import { Toolbox } from '@lib/utils/toolbox';
import WithAuthorization from '@modules/auth/components/WithAuthorization';
import OrdersFilter from '@modules/orders/components/OrdersFilter';
import OrdersList from '@modules/orders/components/OrdersList';
import { OrdersHooks } from '@modules/orders/lib/hooks';
import { IOrdersFilter } from '@modules/orders/lib/interfaces';
import { Tag } from 'antd';
import { useRouter } from 'next/router';

const OrdersPage = () => {
  const router = useRouter();
  const { page = '1', limit = '10', ...rest } = Toolbox.parseQueryParams<IOrdersFilter>(router.asPath);

  const ordersQuery = OrdersHooks.useFind({
    options: {
      ...rest,
      page,
      limit,
      search_field: 'code',
      sort_order: 'DESC',
    },
  });

  return (
    <PageWrapper>
      <PageHeader
        title="Orders"
        subTitle={<BaseSearch />}
        tags={[<Tag key={1}>Total: {ordersQuery.data?.meta?.total || 0}</Tag>]}
      />
      <OrdersFilter
        initialValues={Toolbox.toCleanObject(router.query)}
        onChange={(values) => {
          router.push({
            query: Toolbox.toCleanObject({ ...router.query, ...values }),
          });
        }}
      />
      <OrdersList
        isLoading={ordersQuery.isLoading}
        data={ordersQuery.data?.data}
        pagination={{
          current: +page,
          pageSize: +limit,
          total: ordersQuery.data?.meta?.total,
          onChange: (page, limit) =>
            router.push({
              query: Toolbox.toCleanObject({ ...router.query, page, limit }),
            }),
        }}
      />
    </PageWrapper>
  );
};

export default WithAuthorization(OrdersPage, { allowedPermissions: ['orders:read'] });
