import BaseModalWithoutClicker from '@base/components/BaseModalWithoutClicker';
import { useAppDispatch, useAppSelector } from '@lib/redux/hooks';
import {
  orderDiscountSnap,
  orderGrandTotalSnap,
  orderRoundOffSnap,
  orderSubtotalSnap,
} from '@lib/redux/order/orderSelector';
import { setDiscount, setRoundOff } from '@lib/redux/order/orderSlice';
import { cn } from '@lib/utils/cn';
import { Toolbox } from '@lib/utils/toolbox';
import { Form, Switch } from 'antd';
import React, { useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import OrderSummaryDiscountForm from './OrderSummaryDiscountForm';

interface IProps {
  className?: string;
}

const OrderSummaryPrice: React.FC<IProps> = ({ className }) => {
  const [discountFormInstance] = Form.useForm();
  const [isDiscountModalOpen, setDiscountModalOpen] = useState(false);
  const orderDiscount = useAppSelector(orderDiscountSnap);
  const orderSubtotal = useAppSelector(orderSubtotalSnap);
  const orderRoundOff = useAppSelector(orderRoundOffSnap);
  const orderGrandTotal = useAppSelector(orderGrandTotalSnap);
  const { discountType, discount, isRoundOff } = useAppSelector((store) => store.orderSlice);
  const dispatch = useAppDispatch();

  return (
    <React.Fragment>
      <div className={cn('order_summary_price text-gray-700 dark:text-gray-300 space-y-2 text-sm', className)}>
        <div className="flex items-center justify-between gap-2">
          <p className="space-x-1">
            <span>Coupon</span>
            <FaRegEdit className="inline-block -mt-1 cursor-pointer hover:text-[var(--color-primary)]" />
          </p>
          <p className="font-semibold">{Toolbox.withCurrency(0)}</p>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="space-x-1">
            <span>Discount</span>
            <FaRegEdit
              className="inline-block -mt-1 cursor-pointer hover:text-[var(--color-primary)]"
              onClick={() => setDiscountModalOpen(true)}
            />
          </p>
          <p className="font-semibold">{Toolbox.withCurrency(orderDiscount)}</p>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p>Subtotal</p>
          <p className="font-semibold">{Toolbox.withCurrency(orderSubtotal)}</p>
        </div>
        <div className="flex items-center justify-between gap-2">
          <Switch
            checked={isRoundOff}
            onChange={() => dispatch(setRoundOff({ isRoundOff: !isRoundOff }))}
            checkedChildren="Roundoff"
            unCheckedChildren="Roundoff"
            size="small"
            className="[&_.ant-switch-inner-checked]:!text-xs [&_.ant-switch-inner-unchecked]:!text-xs"
          />
          <p className="font-semibold">{Toolbox.withCurrency(orderRoundOff)}</p>
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-gray-300 border-dotted pt-4 text-black dark:text-white text-base">
          <p>Payable</p>
          <p className="font-semibold">{Toolbox.withCurrency(orderGrandTotal.totalWithRoundOff)}</p>
        </div>
      </div>
      <BaseModalWithoutClicker
        destroyOnHidden
        width={540}
        title="Discount"
        footer={null}
        open={isDiscountModalOpen}
        onCancel={() => setDiscountModalOpen(false)}
      >
        <OrderSummaryDiscountForm
          form={discountFormInstance}
          isLoading={false}
          initialValues={{ type: discountType, amount: discount }}
          onFinish={(values) => {
            const { type, amount } = values;

            dispatch(setDiscount({ type, amount }));
            setDiscountModalOpen(false);
          }}
        />
      </BaseModalWithoutClicker>
    </React.Fragment>
  );
};

export default OrderSummaryPrice;
