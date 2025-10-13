import BaseSearch from '@base/components/BaseSearch';
import PageHeader from '@base/components/PageHeader';
import PageWrapper from '@base/container/PageWrapper';
import { Toolbox } from '@lib/utils/toolbox';
import WithAuthorization from '@modules/auth/components/WithAuthorization';
import OrderReturnsFilter from '@modules/order-returns/components/OrderReturnsFilter';
import OrderReturnsList from '@modules/order-returns/components/OrderReturnsList';
import { OrderReturnsHooks } from '@modules/order-returns/lib/hooks';
import { IOrderReturnsFilter } from '@modules/order-returns/lib/interfaces';
import { Tag } from 'antd';
import { useRouter } from 'next/router';

const OrderReturnsPage = () => {
  const router = useRouter();
  const { page = '1', limit = '10', ...rest } = Toolbox.parseQueryParams<IOrderReturnsFilter>(router.asPath);

  const orderReturnsQuery = OrderReturnsHooks.useFind({
    options: {
      ...rest,
      page,
      limit,
      search_field: 'code',
    },
  });

  return (
    <PageWrapper>
      <PageHeader
        title="Order Returns"
        subTitle={<BaseSearch />}
        tags={[<Tag key={1}>Total: {orderReturnsQuery.data?.meta?.total || 0}</Tag>]}
      />
      <OrderReturnsFilter
        initialValues={Toolbox.toCleanObject(router.query)}
        onChange={(values) => {
          router.push({
            query: Toolbox.toCleanObject({ ...router.query, ...values }),
          });
        }}
      />
      <OrderReturnsList
        isLoading={orderReturnsQuery.isLoading}
        data={orderReturnsQuery.data?.data}
        pagination={{
          current: +page,
          pageSize: +limit,
          total: orderReturnsQuery.data?.meta?.total,
          onChange: (page, limit) =>
            router.push({
              query: Toolbox.toCleanObject({ ...router.query, page, limit }),
            }),
        }}
      />
    </PageWrapper>
  );
};

export default WithAuthorization(OrderReturnsPage, { allowedPermissions: ['order_returns:read'] });
