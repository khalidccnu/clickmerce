import CustomUploader from '@base/components/CustomUploader';
import { TId } from '@base/interfaces';
import { Dayjs } from '@lib/constant/dayjs';
import { Paths } from '@lib/constant/paths';
import { cn } from '@lib/utils/cn';
import { Toolbox } from '@lib/utils/toolbox';
import { GalleriesHooks } from '@modules/galleries/lib/hooks';
import { OrderPaymentRequestsHooks } from '@modules/order-payment-requests/lib/hooks';
import { IOrder } from '@modules/orders/lib/interfaces';
import { OrderPaymentStatusColorFn, OrderStatusColorFn } from '@modules/orders/lib/utils';
import { ENUM_PAYMENT_METHOD_REFERENCE_TYPES } from '@modules/payment-methods/lib/enums';
import { Button, Card, Input, message, Space, Tag } from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { FaHome } from 'react-icons/fa';

interface IProps {
  className?: string;
  order: IOrder;
}

const OrderPaymentSection: React.FC<IProps> = ({ className, order }) => {
  const router = useRouter();
  const { order_id } = Toolbox.parseQueryParams<{ order_id?: TId }>(router.asPath);
  const [messageApi, messageHolder] = message.useMessage();
  const [reference, setReference] = useState<string>(null);

  const handleImageUploadFn = (file: File) => {
    if (!file) {
      setReference(null);
      return;
    }

    const formData: any = Toolbox.withFormData({ files: file, type: 'FILE', make_public: 'true' });

    galleriesCreateFn.mutate(formData);
  };

  const galleriesCreateFn = GalleriesHooks.useQuickCreate({
    config: {
      onSuccess: (res) => {
        if (!res.success) {
          messageApi.error(res.message);
          return;
        }

        setReference(res.data?.[0]?.file_url);
        messageApi.success(res.message);
      },
    },
  });

  const orderPaymentRequestQuickCreateFn = OrderPaymentRequestsHooks.useQuickCreate({
    config: {
      onSuccess: (res) => {
        if (!res.success) {
          messageApi.error(res.message);
          return;
        }

        messageApi.success(res.message).then(() => {
          router.push({
            pathname: Paths.order.success,
            query: { order_id },
          });
        });
      },
    },
  });

  return (
    <section className={cn('order_payment_section', className)}>
      {messageHolder}
      <div className="container space-y-4">
        <Card title="Order Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <p>
              <span className="font-medium">Code: </span> {order.code}
            </p>
            <p>
              <span className="font-medium">Placed: </span>
              {dayjs(order.created_at).format(Dayjs.dateTimeSecondsWithAmPm)}
            </p>
            <p>
              <span className="font-medium">Status: </span>
              <Tag color={OrderStatusColorFn(order.status)}>{Toolbox.toPrettyText(order.status)}</Tag>
            </p>
            <p>
              <span className="font-medium">Payment: </span>
              <Tag color={OrderPaymentStatusColorFn(order.payment_status)}>
                {Toolbox.toPrettyText(order.payment_status)}
              </Tag>
            </p>
          </div>
        </Card>
        <Card title={`Payment Information (${order.payment_method.name})`}>
          <div className="prose" dangerouslySetInnerHTML={{ __html: order.payment_method.description }} />
          {order?.payment_method?.reference_type === ENUM_PAYMENT_METHOD_REFERENCE_TYPES.TRX ? (
            <Input
              style={{ marginTop: 16, width: '100%', maxWidth: 480 }}
              size="large"
              placeholder="Transaction Id"
              value={reference}
              onChange={(e) => setReference(e?.target?.value)}
            />
          ) : (
            <div style={{ marginTop: 16, width: '100%', maxWidth: 480 }}>
              <CustomUploader
                type="DRAGGER"
                listType="picture-card"
                initialValues={[reference]}
                onFinish={([_, file]) => handleImageUploadFn(file)}
              />
            </div>
          )}
        </Card>
        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button size="large" type="primary" href={Paths.root} icon={<FaHome />} ghost>
            Go to Home
          </Button>
          <Button
            size="large"
            type="primary"
            disabled={!reference}
            onClick={() =>
              orderPaymentRequestQuickCreateFn.mutate({
                order_id,
                payment_reference: reference,
              })
            }
          >
            Submit
          </Button>
        </Space>
      </div>
    </section>
  );
};

export default OrderPaymentSection;
