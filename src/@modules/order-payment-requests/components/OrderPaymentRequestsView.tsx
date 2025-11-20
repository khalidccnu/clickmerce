import { Dayjs } from '@lib/constant/dayjs';
import { Card, Descriptions, Image } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { IOrderPaymentRequest } from '../lib/interfaces';

interface IProps {
  orderPaymentRequest: IOrderPaymentRequest;
}

const OrderPaymentRequestsView: React.FC<IProps> = ({ orderPaymentRequest }) => {
  return (
    <div className="space-y-4">
      <Card title="Order Payment Request Information" size="small">
        <Descriptions
          bordered
          size="small"
          layout="vertical"
          column={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }}
          labelStyle={{ fontWeight: 600 }}
        >
          <Descriptions.Item label="Code">
            <span className="text-[var(--color-primary)]">{orderPaymentRequest?.code}</span>
          </Descriptions.Item>
          <Descriptions.Item label="Date">
            {dayjs(orderPaymentRequest?.created_at).format(Dayjs.dateTimeSecondsWithAmPm)}
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="Order Information" size="small">
        <Descriptions
          bordered
          size="small"
          layout="vertical"
          column={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 4, xxl: 4 }}
          labelStyle={{ fontWeight: 600 }}
        >
          <Descriptions.Item label="Code" span={2}>
            {orderPaymentRequest?.order?.code}
          </Descriptions.Item>
          <Descriptions.Item label="Reference" span={2}>
            {orderPaymentRequest?.payment_reference?.includes('://') ? (
              <Image
                width={80}
                src={orderPaymentRequest?.payment_reference}
                alt={orderPaymentRequest?.code as string}
              />
            ) : (
              orderPaymentRequest?.payment_reference
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="Customer Information" size="small">
        <Descriptions
          bordered
          size="small"
          layout="vertical"
          column={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 4, xxl: 4 }}
          labelStyle={{ fontWeight: 600 }}
        >
          <Descriptions.Item label="Name" span={2}>
            {orderPaymentRequest?.order?.customer?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Phone" span={2}>
            {orderPaymentRequest?.order?.customer?.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Email" span={4}>
            {orderPaymentRequest?.order?.customer?.email || 'N/A'}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default OrderPaymentRequestsView;
