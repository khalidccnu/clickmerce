import BaseSearch from '@base/components/BaseSearch';
import PageHeader from '@base/components/PageHeader';
import PageWrapper from '@base/container/PageWrapper';
import { Toolbox } from '@lib/utils/toolbox';
import WithAuthorization from '@modules/auth/components/WithAuthorization';
import OrderReturnsFilter from '@modules/order-returns/components/OrderReturnsFilter';
import OrderReturnsList from '@modules/order-returns/components/OrderReturnsList';
import { OrderReturnsHooks } from '@modules/order-returns/lib/hooks';
import { IOrderReturnsFilter } from '@modules/order-returns/lib/interfaces';
import { ISettingsIdentity } from '@modules/settings/lib/interfaces';
import { SettingsServices } from '@modules/settings/lib/services';
import { Tag } from 'antd';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';

interface IProps {
  settingsIdentity: ISettingsIdentity;
}

const OrderReturnsPage: NextPage<IProps> = ({ settingsIdentity }) => {
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
    <PageWrapper
      title="Order Returns"
      baseTitle={settingsIdentity?.name}
      description={settingsIdentity?.description}
      icon={settingsIdentity?.icon_url}
      image={settingsIdentity?.social_image_url}
    >
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
