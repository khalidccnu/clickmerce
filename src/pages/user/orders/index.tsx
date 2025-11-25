import { HomeOutlined } from '@ant-design/icons';
import PageWrapper from '@base/container/PageWrapper';
import { ENUM_SORT_ORDER_TYPES } from '@base/enums';
import { Paths } from '@lib/constant/paths';
import { Toolbox } from '@lib/utils/toolbox';
import { OrdersHooks } from '@modules/orders/lib/hooks';
import { ISettingsIdentity } from '@modules/settings/lib/interfaces';
import { SettingsServices } from '@modules/settings/lib/services';
import { Breadcrumb, Button, Empty, Pagination, Skeleton } from 'antd';
import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useState } from 'react';

const OrderCard = dynamic(() => import('@components/OrderCard'), { ssr: false });

interface IProps {
  settingsIdentity: ISettingsIdentity;
}

const OrdersPage: NextPage<IProps> = ({ settingsIdentity }) => {
  const router = useRouter();

  const [ordersOptions, setOrdersOptions] = useState({
    page: '1',
    limit: '10',
  });

  const ordersQuery = OrdersHooks.useQuickFind({
    options: {
      page: ordersOptions.page,
      limit: ordersOptions.limit,
      search_field: 'code',
      sort_order: ENUM_SORT_ORDER_TYPES.DESC,
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
      <Breadcrumb
        items={[
          {
            href: Paths.root,
            title: <HomeOutlined />,
          },
          {
            title: 'Orders',
          },
        ]}
      />
      <div className="mt-8 grid grid-cols-1 gap-4">
        {ordersQuery.isLoading ? (
          [...Array(2)].map((_, idx) => <Skeleton key={idx} active paragraph={{ rows: 5 }} />)
        ) : Toolbox.isEmpty(ordersQuery.data?.data) ? (
          <Empty description="No orders found">
            <Button type="primary" onClick={() => router.push(Paths.products.root)}>
              Shop Now
            </Button>
          </Empty>
        ) : (
          ordersQuery.data?.data.map((order) => <OrderCard key={order.id} order={order} />)
        )}
      </div>
      {ordersQuery.data?.meta?.total > +ordersOptions.limit && (
        <Pagination
          className="orders_page_pagination"
          defaultCurrent={+ordersOptions?.page}
          total={ordersQuery.data?.meta?.total}
          pageSize={+ordersOptions?.limit}
          onChange={(page, limit) => {
            setOrdersOptions({ ...ordersOptions, page: page.toString(), limit: limit.toString() });
          }}
        />
      )}
      <style jsx global>{`
        .orders_page_pagination {
          width: fit-content;
          margin: 3rem auto 0 !important;
          a {
            color: var(--color-gray-700);
          }
          .ant-pagination-disabled {
            a {
              color: var(--color-gray-300);
            }
          }
          .ant-pagination-item {
            &.ant-pagination-item-active {
              color: var(--color-primary);
              border-color: var(--color-primary);
              a {
                color: inherit;
              }
            }
          }
        }
      `}</style>
    </PageWrapper>
  );
};

export default OrdersPage;

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
