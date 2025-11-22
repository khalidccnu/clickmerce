import PageWrapper from '@base/container/PageWrapper';
import { IBasePageProps, TId } from '@base/interfaces';
import OrderPaymentSection from '@components/OrderPaymentSection';
import { Paths } from '@lib/constant/paths';
import { ENUM_ORDER_PAYMENT_STATUS_TYPES } from '@modules/orders/lib/enums';
import { IOrder } from '@modules/orders/lib/interfaces';
import { OrdersServices } from '@modules/orders/lib/services';
import { pageTypes } from '@modules/pages/lib/enums';
import { PagesServices } from '@modules/pages/lib/services';
import { ENUM_PAYMENT_METHOD_REFERENCE_TYPES } from '@modules/payment-methods/lib/enums';
import { SettingsServices } from '@modules/settings/lib/services';
import { GetServerSideProps, NextPage } from 'next';

interface IProps extends IBasePageProps {
  order: IOrder;
}

const OrderPaymentPage: NextPage<IProps> = ({ settingsIdentity, order }) => {
  return (
    <PageWrapper
      title="Order Payment"
      baseTitle={settingsIdentity?.name}
      description={settingsIdentity?.description}
      icon={settingsIdentity?.icon_url}
      image={settingsIdentity?.social_image_url}
    >
      <OrderPaymentSection className="py-10 md:py-16" order={order} />
    </PageWrapper>
  );
};

export default OrderPaymentPage;

export const getServerSideProps: GetServerSideProps<IProps> = async ({ query }) => {
  const { order_id }: { order_id?: TId } = query;

  try {
    const { success: settingsSuccess, data: settings } = await SettingsServices.find();

    const { success: pagesSuccess, data: pages } = await PagesServices.find({
      page: '1',
      limit: pageTypes.length.toString(),
    });

    const { success: orderPayment, data: order } = await OrdersServices.quickFindById(order_id);

    if (!settingsSuccess || !pagesSuccess || !orderPayment) {
      return {
        notFound: true,
      };
    }

    if (
      order.payment_method?.reference_type === ENUM_PAYMENT_METHOD_REFERENCE_TYPES.AUTO ||
      order?.payment_status !== ENUM_ORDER_PAYMENT_STATUS_TYPES.PROCESSING ||
      order?.payment_reference
    ) {
      return {
        redirect: {
          destination: `${Paths.order.success}?order_id=${order.id}`,
          permanent: false,
        },
      };
    }

    return {
      props: {
        settingsIdentity: settings?.identity ?? null,
        settingsTrackingCodes: settings?.tracking_codes ?? null,
        pages: pages ?? [],
        order: order ?? null,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
