import BaseModalWithoutClicker from '@base/components/BaseModalWithoutClicker';
import { useAppDispatch, useAppSelector } from '@lib/redux/hooks';
import {
  orderCouponSnap,
  orderDiscountSnap,
  orderGrandTotalSnap,
  orderRoundOffSnap,
  orderSubtotalSnap,
} from '@lib/redux/order/orderSelector';
import { setCoupon, setDiscount, setRoundOff } from '@lib/redux/order/orderSlice';
import { cn } from '@lib/utils/cn';
import { Toolbox } from '@lib/utils/toolbox';
import { Form, Switch, Tag } from 'antd';
import React, { useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import OrderSummaryCouponForm from './OrderSummaryCouponForm';
import OrderSummaryDiscountForm from './OrderSummaryDiscountForm';

interface IProps {
  className?: string;
}

const OrderSummaryPrice: React.FC<IProps> = ({ className }) => {
  const [couponFormInstance] = Form.useForm();
  const [discountFormInstance] = Form.useForm();
  const [isCouponModalOpen, setCouponModalOpen] = useState(false);
  const [isDiscountModalOpen, setDiscountModalOpen] = useState(false);
  const orderCoupon = useAppSelector(orderCouponSnap);
  const orderDiscount = useAppSelector(orderDiscountSnap);
  const orderSubtotal = useAppSelector(orderSubtotalSnap);
  const orderRoundOff = useAppSelector(orderRoundOffSnap);
  const orderGrandTotal = useAppSelector(orderGrandTotalSnap);
  const { coupon, discountType, discount, isRoundOff } = useAppSelector((store) => store.orderSlice);
  const dispatch = useAppDispatch();

  return (
    <React.Fragment>
      <div className={cn('order_summary_price text-gray-700 dark:text-gray-300 space-y-2 text-sm', className)}>
        <div className="flex items-center justify-between gap-2">
          <p className="space-x-1">
            <span>Coupon</span>
            <FaRegEdit
              className="inline-block -mt-1 cursor-pointer hover:text-[var(--color-primary)]"
              onClick={() => setCouponModalOpen(true)}
            />
            {!orderCoupon || (
              <Tag color="green" className="!mr-0">
                {coupon?.code}{' '}
                <IoClose
                  className="inline-block hover:text-red-500 -mt-0.5 cursor-pointer"
                  onClick={() => dispatch(setCoupon(null))}
                />
              </Tag>
            )}
          </p>
          <p className="font-semibold">{Toolbox.withCurrency(orderCoupon)}</p>
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
          <p className="font-semibold">{Toolbox.withCurrency(orderSubtotal.subTotalSale)}</p>
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
        title="Coupon"
        footer={null}
        open={isCouponModalOpen}
        onCancel={() => setCouponModalOpen(false)}
      >
        <OrderSummaryCouponForm
          form={couponFormInstance}
          isLoading={false}
          initialValues={coupon}
          onFinish={(values) => {
            const { coupon } = values;

            dispatch(setCoupon(coupon));
            setCouponModalOpen(false);
          }}
        />
      </BaseModalWithoutClicker>
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
