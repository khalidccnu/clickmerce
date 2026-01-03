import { Env } from '.environments';
import { HomeOutlined } from '@ant-design/icons';
import PageWrapper from '@base/container/PageWrapper';
import { TId } from '@base/interfaces';
import OrderSuccessSection from '@components/OrderSuccessSection';
import { Dayjs } from '@lib/constant/dayjs';
import { Paths } from '@lib/constant/paths';
import Invoice from '@modules/orders/components/Invoice';
import { IOrder } from '@modules/orders/lib/interfaces';
import { OrdersServices } from '@modules/orders/lib/services';
import { ISettingsIdentity } from '@modules/settings/lib/interfaces';
import { SettingsServices } from '@modules/settings/lib/services';
import { Breadcrumb, Button } from 'antd';
import dayjs from 'dayjs';
import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';

const PDFDownloadLink = dynamic(() => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink), { ssr: false });

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
      <div className="text-end mt-4">
        <PDFDownloadLink
          document={
            <Invoice
              order={{
                webLogo: settingsIdentity?.logo_url || Env.webBrandLogo,
                webTitle: settingsIdentity?.name || Env.webTitle,
                moneyReceiptDate: dayjs(order.created_at).format(Dayjs.dateTimeSecondsWithAmPm),
                trxId: order?.code,
                customerName: order?.customer?.name,
                phone: order?.customer?.phone,
                streetAddress: order?.street_address,
                deliveryZone: order?.delivery_zone?.name,
                products: order?.products
                  ?.flatMap((product) =>
                    (product?.variations || []).map((variation) => ({
                      name: product?.current_info?.name,
                      specification: product?.current_info?.specification,
                      salePrice: variation?.sale_price,
                      saleDiscountPrice: variation?.sale_discount_price,
                      quantity: variation?.quantity,
                      mfg: variation?.mfg,
                      exp: variation?.exp,
                      color: variation?.color,
                      size: variation?.size,
                      weight: variation?.weight,
                    })),
                  )
                  .filter(Boolean),
                coupon: 0,
                discount: order?.redeem_amount,
                vat: order?.vat_amount,
                vatPercent: 0,
                tax: order?.tax_amount,
                taxPercent: 0,
                deliveryCharge: order?.delivery_charge,
                subTotal: order?.sub_total_amount,
                roundOff: order?.round_off_amount,
                grandTotal: order?.grand_total_amount,
                paymentStatus: order?.payment_status,
                receivedBy: order?.created_by?.name,
              }}
            />
          }
          fileName={`Invoice-${order.code}.pdf`}
        >
          {({ loading }) => (
            <Button type="primary" loading={loading}>
              Download Invoice
            </Button>
          )}
        </PDFDownloadLink>
      </div>
      <OrderSuccessSection className="mt-8" needContainerClass={false} showActionButtons={false} order={order} />
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
