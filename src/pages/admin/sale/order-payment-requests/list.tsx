import BaseSearch from '@base/components/BaseSearch';
import PageHeader from '@base/components/PageHeader';
import PageWrapper from '@base/container/PageWrapper';
import { Toolbox } from '@lib/utils/toolbox';
import WithAuthorization from '@modules/auth/components/WithAuthorization';
import OrderPaymentRequestsFilter from '@modules/order-payment-requests/components/OrderPaymentRequestsFilter';
import OrderPaymentRequestsList from '@modules/order-payment-requests/components/OrderPaymentRequestsList';
import { OrderPaymentRequestsHooks } from '@modules/order-payment-requests/lib/hooks';
import { IOrderPaymentRequestsFilter } from '@modules/order-payment-requests/lib/interfaces';
import { ISettingsIdentity } from '@modules/settings/lib/interfaces';
import { SettingsServices } from '@modules/settings/lib/services';
import { Tag } from 'antd';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';

interface IProps {
  settingsIdentity: ISettingsIdentity;
}

const OrderPaymentRequestsPage: NextPage<IProps> = ({ settingsIdentity }) => {
  const router = useRouter();
  const { page = '1', limit = '10', ...rest } = Toolbox.parseQueryParams<IOrderPaymentRequestsFilter>(router.asPath);

  const orderPaymentRequestsQuery = OrderPaymentRequestsHooks.useFind({
    options: {
      ...rest,
      page,
      limit,
      search_field: 'code',
    },
  });

  return (
    <PageWrapper
      title="Order Payment Requests"
      baseTitle={settingsIdentity?.name}
      description={settingsIdentity?.description}
      icon={settingsIdentity?.icon_url}
      image={settingsIdentity?.social_image_url}
    >
      <PageHeader
        title="Order Payment Requests"
        subTitle={<BaseSearch />}
        tags={[<Tag key={1}>Total: {orderPaymentRequestsQuery.data?.meta?.total || 0}</Tag>]}
      />
      <OrderPaymentRequestsFilter
        initialValues={Toolbox.toCleanObject(router.query)}
        onChange={(values) => {
          router.push({
            query: Toolbox.toCleanObject({ ...router.query, ...values }),
          });
        }}
      />
      <OrderPaymentRequestsList
        isLoading={orderPaymentRequestsQuery.isLoading}
        data={orderPaymentRequestsQuery.data?.data}
        pagination={{
          current: +page,
          pageSize: +limit,
          total: orderPaymentRequestsQuery.data?.meta?.total,
          onChange: (page, limit) =>
            router.push({
              query: Toolbox.toCleanObject({ ...router.query, page, limit }),
            }),
        }}
      />
    </PageWrapper>
  );
};

export default WithAuthorization(OrderPaymentRequestsPage, { allowedPermissions: ['order_payment_requests:read'] });

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
