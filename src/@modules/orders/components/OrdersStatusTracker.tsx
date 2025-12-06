import { CheckOutlined, ClockCircleOutlined, CloseOutlined } from '@ant-design/icons';
import { Dayjs } from '@lib/constant/dayjs';
import { Toolbox } from '@lib/utils/toolbox';
import { Steps, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { ENUM_ORDER_STATUS_TYPES } from '../lib/enums';
import { IOrder } from '../lib/interfaces';
import { OrderPaymentStatusColorFn } from '../lib/utils';
const { Title, Text } = Typography;

const statusFlow = [
  {
    key: ENUM_ORDER_STATUS_TYPES.PENDING,
    title: 'Order Placed',
    description: 'Your order has been placed and is pending confirmation',
    icon: <ClockCircleOutlined />,
  },
  {
    key: ENUM_ORDER_STATUS_TYPES.CONFIRMED,
    title: 'Order Confirmed',
    description: 'Your order has been confirmed and accepted',
    icon: <CheckOutlined />,
  },
  {
    key: ENUM_ORDER_STATUS_TYPES.PROCESSING,
    title: 'Processing',
    description: 'Your order is being prepared for shipment',
    icon: <ClockCircleOutlined />,
  },
  {
    key: ENUM_ORDER_STATUS_TYPES.SHIPPED,
    title: 'Shipped',
    description: 'Your order has been shipped and is on the way',
    icon: <CheckOutlined />,
  },
  {
    key: ENUM_ORDER_STATUS_TYPES.OUT_FOR_DELIVERY,
    title: 'Out for Delivery',
    description: 'Your order is out for delivery and will arrive soon',
    icon: <ClockCircleOutlined />,
  },
  {
    key: ENUM_ORDER_STATUS_TYPES.DELIVERED,
    title: 'Delivered',
    description: 'Your order has been successfully delivered',
    icon: <CheckOutlined />,
  },
];

interface IProps {
  order: IOrder;
}

const OrdersStatusTracker: React.FC<IProps> = ({ order }) => {
  const currentStatusIdx = statusFlow.findIndex((step) => step.key === order?.status);
  const isCancelled = order?.status === ENUM_ORDER_STATUS_TYPES.CANCELLED;

  const stepStatusFn = (idx: number) => {
    if (isCancelled) {
      return idx === 0 ? 'finish' : 'wait';
    }

    if (idx < currentStatusIdx) return 'finish';
    if (idx === currentStatusIdx) return 'process';
    return 'wait';
  };

  return (
    <React.Fragment>
      <div className="mb-6 p-4 rounded-lg bg-gray-50 dark:bg-[var(--color-dark-gray)] border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between mb-2">
          <Text strong>Customer:</Text>
          <Text>{order?.customer?.name}</Text>
        </div>
        <div className="flex justify-between mb-2">
          <Text strong>Total Amount:</Text>
          <Text strong>{Toolbox.withCurrency(order?.grand_total_amount)}</Text>
        </div>
        <div className="flex justify-between mb-2">
          <Text strong>Payment Status:</Text>
          <Tag color={OrderPaymentStatusColorFn(order?.payment_status)} style={{ marginRight: 0 }}>
            {Toolbox.toPrettyText(order?.payment_status)}
          </Tag>
        </div>
        <div className="flex justify-between mb-2">
          <Text strong>Date:</Text>
          <Text>{dayjs(order?.created_at).format(Dayjs.dateTimeSecondsWithAmPm)}</Text>
        </div>
      </div>
      {isCancelled && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-700">
          <div className="flex items-center gap-2 mb-2">
            <CloseOutlined className="text-red-500" />
            <Text strong className="text-red-500">
              Order Cancelled
            </Text>
          </div>
          <Text type="secondary">
            This order has been cancelled. The order process has been stopped at the initial stage.
          </Text>
        </div>
      )}
      <div className="mb-6">
        <Title level={5} style={{ marginBottom: 16 }}>
          Order Progress
        </Title>
        <Steps
          direction="vertical"
          current={isCancelled ? 0 : currentStatusIdx}
          status={isCancelled ? 'error' : 'process'}
          items={statusFlow.map((step, idx) => ({
            title: step.title,
            description: step.description,
            status: stepStatusFn(idx),
            icon: step.icon,
          }))}
        />
      </div>
      <div className="p-4 bg-gray-50 dark:bg-[var(--color-dark-gray)] rounded-lg border border-gray-200 dark:border-gray-700">
        <Title level={5} style={{ marginBottom: 12 }}>
          Additional Information
        </Title>
        <div className="mb-2">
          <Text strong>Street Address: </Text>
          <Text>{order?.street_address || 'N/A'}</Text>
        </div>
        <div className="mb-2">
          <Text strong>Delivery Zone: </Text>
          <Text>{order?.delivery_zone?.name}</Text>
        </div>
        <div className="mb-2">
          <Text strong>Payment Method: </Text>
          <Text>{order?.payment_method?.name}</Text>
        </div>
        {!!order?.delivery_charge && (
          <div className="mb-2">
            <Text strong>Delivery Charge: </Text>
            <Text>{Toolbox.withCurrency(order?.delivery_charge)}</Text>
          </div>
        )}
        {!!order?.due_amount && (
          <div className="mb-2">
            <Text strong>Due Amount: </Text>
            <Text className="text-red-500">{Toolbox.withCurrency(order?.due_amount)}</Text>
          </div>
        )}
        <div>
          <Text strong>Last Updated: </Text>
          <Text>{dayjs(order?.updated_at).format(Dayjs.dateTimeSecondsWithAmPm)}</Text>
        </div>
      </div>
    </React.Fragment>
  );
};

export default OrdersStatusTracker;
