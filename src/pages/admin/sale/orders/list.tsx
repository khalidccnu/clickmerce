import BaseSearch from '@base/components/BaseSearch';
import PageHeader from '@base/components/PageHeader';
import PageWrapper from '@base/container/PageWrapper';
import { Toolbox } from '@lib/utils/toolbox';
import WithAuthorization from '@modules/auth/components/WithAuthorization';
import OrdersFilter from '@modules/orders/components/OrdersFilter';
import OrdersList from '@modules/orders/components/OrdersList';
import { OrdersHooks } from '@modules/orders/lib/hooks';
import { IOrdersFilter } from '@modules/orders/lib/interfaces';
import { ISettingsIdentity } from '@modules/settings/lib/interfaces';
import { SettingsServices } from '@modules/settings/lib/services';
import { Tag } from 'antd';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';

interface IProps {
  settingsIdentity: ISettingsIdentity;
}

const OrdersPage: NextPage<IProps> = ({ settingsIdentity }) => {
  const router = useRouter();
  const { page = '1', limit = '10', ...rest } = Toolbox.parseQueryParams<IOrdersFilter>(router.asPath);

  const ordersQuery = OrdersHooks.useFind({
    options: {
      ...rest,
      page,
      limit,
      search_field: 'code',
    },
  });

  return (
    <PageWrapper
      title="Orders"
      baseTitle={settingsIdentity?.name}
      description={settingsIdentity?.description}
      icon={settingsIdentity?.icon_url}
      image={settingsIdentity?.social_image_url}
    >
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
