import { HomeOutlined } from '@ant-design/icons';
import PageWrapper from '@base/container/PageWrapper';
import { TId } from '@base/interfaces';
import OrderSuccessSection from '@components/OrderSuccessSection';
import { Paths } from '@lib/constant/paths';
import { IOrder } from '@modules/orders/lib/interfaces';
import { OrdersServices } from '@modules/orders/lib/services';
import { ISettingsIdentity } from '@modules/settings/lib/interfaces';
import { SettingsServices } from '@modules/settings/lib/services';
import { Breadcrumb } from 'antd';
import { GetServerSideProps, NextPage } from 'next';

interface IProps {
  settingsIdentity: ISettingsIdentity;
  order: IOrder;
}

const OrdersPage: NextPage<IProps> = ({ settingsIdentity, order }) => {
  return (
    <PageWrapper
      title={order?.code as string}
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
            href: Paths.user.orders.root,
            title: 'Orders',
          },
        ]}
      />
      <OrderSuccessSection className="mt-8" showActionButtons={false} order={order} />
    </PageWrapper>
  );
};

export default OrdersPage;

export const getServerSideProps: GetServerSideProps<IProps> = async ({ params }) => {
  const { orderId }: { orderId?: TId } = params;

  try {
    const { success, data: settings } = await SettingsServices.find();

    const { success: orderSuccess, data: order } = await OrdersServices.quickFindById(orderId);

    if (!success || !orderSuccess) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        settingsIdentity: settings?.identity ?? null,
        order: order ?? null,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
