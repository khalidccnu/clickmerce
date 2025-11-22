import BaseHeroWrapper from '@base/components/BaseHeroWrapper';
import PageWrapper from '@base/container/PageWrapper';
import { IBasePageProps, TId } from '@base/interfaces';
import OrderSuccessSection from '@components/OrderSuccessSection';
import { IOrder } from '@modules/orders/lib/interfaces';
import { OrdersServices } from '@modules/orders/lib/services';
import { pageTypes } from '@modules/pages/lib/enums';
import { PagesServices } from '@modules/pages/lib/services';
import { SettingsServices } from '@modules/settings/lib/services';
import { GetServerSideProps, NextPage } from 'next';

interface IProps extends IBasePageProps {
  order: IOrder;
}

const OrderSuccessPage: NextPage<IProps> = ({ settingsIdentity, order }) => {
  return (
    <PageWrapper
      title="Order Success"
      baseTitle={settingsIdentity?.name}
      description={settingsIdentity?.description}
      icon={settingsIdentity?.icon_url}
      image={settingsIdentity?.social_image_url}
    >
      <BaseHeroWrapper title="Your Order is Successful" />
      <OrderSuccessSection className="py-10 md:py-16" order={order} />
    </PageWrapper>
  );
};

export default OrderSuccessPage;

export const getServerSideProps: GetServerSideProps<IProps> = async ({ query }) => {
  const { order_id }: { order_id?: TId } = query;

  try {
    const { success: settingsSuccess, data: settings } = await SettingsServices.find();

    const { success: pagesSuccess, data: pages } = await PagesServices.find({
      page: '1',
      limit: pageTypes.length.toString(),
    });

    const { success: orderSuccess, data: order } = await OrdersServices.quickFindById(order_id);

    if (!settingsSuccess || !pagesSuccess || !orderSuccess) {
      return {
        notFound: true,
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
