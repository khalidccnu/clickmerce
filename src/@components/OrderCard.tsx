import CustomLink from '@base/components/CustomLink';
import { Paths } from '@lib/constant/paths';
import { cn } from '@lib/utils/cn';
import { Toolbox } from '@lib/utils/toolbox';
import { IOrder } from '@modules/orders/lib/interfaces';
import { OrderPaymentStatusColorFn, OrderStatusColorFn } from '@modules/orders/lib/utils';
import { Card } from 'antd';
import React from 'react';
import { AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineWallet } from 'react-icons/ai';

interface IProps {
  className?: string;
  order: IOrder;
}

const OrderCard: React.FC<IProps> = ({ className, order }) => {
  return (
    <Card className={cn('order_card relative space-y-2', className)}>
      <CustomLink type="hoverable" title={order?.code as string} href={Paths.user.orders.toId(order?.id)} />
      <div className="flex justify-between items-center gap-2">
        <span className="text-gray-600 dark:text-gray-300 text-sm">Code</span>
        <span className="font-medium text-[var(--color-primary)]">{order.code}</span>
      </div>
      {!order?.due_amount || (
        <div className="flex justify-between items-center gap-2">
          <span className="text-gray-600 dark:text-gray-300 text-sm">Due Amount</span>
          <span className="font-medium text-red-500 flex items-center gap-1">
            <AiOutlineCloseCircle /> {Toolbox.withCurrency(order.due_amount)}
          </span>
        </div>
      )}
      <div className="flex justify-between items-center gap-2">
        <span className="text-gray-600 dark:text-gray-300 text-sm">Grand Total</span>
        <span className="font-medium text-green-600 flex items-center gap-1">
          <AiOutlineWallet /> {Toolbox.withCurrency(order.grand_total_amount)}
        </span>
      </div>
      <div className="flex justify-between items-center gap-2">
        <span className="text-gray-600 dark:text-gray-300 text-sm">Payment Status</span>
        <span
          className="font-medium text-purple-600 flex items-center gap-1"
          style={{ color: OrderPaymentStatusColorFn(order.payment_status) }}
        >
          <AiOutlineCheckCircle /> {Toolbox.toPrettyText(order.payment_status)}
        </span>
      </div>
      <div className="flex justify-between items-center gap-2">
        <span className="text-gray-600 dark:text-gray-300 text-sm">Status</span>
        <span className="font-medium flex items-center gap-1" style={{ color: OrderStatusColorFn(order.status) }}>
          <AiOutlineCheckCircle /> {Toolbox.toPrettyText(order.status)}
        </span>
      </div>
    </Card>
  );
};

export default OrderCard;
