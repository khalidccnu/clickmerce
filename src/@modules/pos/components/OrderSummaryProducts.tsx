import { Env } from '.environments';
import { Dayjs } from '@lib/constant/dayjs';
import { usePosInv } from '@lib/context/PosInvContext';
import { useAppDispatch, useAppSelector } from '@lib/redux/hooks';
import {
  orderCouponSnap,
  orderDiscountSnap,
  orderGrandTotalSnap,
  orderRoundOffSnap,
  orderSubtotalSnap,
  orderTaxSnap,
  orderVatSnap,
} from '@lib/redux/order/orderSelector';
import { clearCartFn, setCartProducts } from '@lib/redux/order/orderSlice';
import { cn } from '@lib/utils/cn';
import { Toolbox } from '@lib/utils/toolbox';
import { AuthServices } from '@modules/auth/lib/services';
import { ProductsHooks } from '@modules/products/lib/hooks';
import { ENUM_SETTINGS_TAX_TYPES, ENUM_SETTINGS_VAT_TYPES } from '@modules/settings/lib/enums';
import { UsersServices } from '@modules/users/lib/services';
import { pdf } from '@react-pdf/renderer';
import { Button, Empty, message, Popconfirm, Spin, Tag } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { normalizeReceiptImageUrlFn } from '../lib/utils';
import OrderSummaryProduct from './OrderSummaryProduct';
import Receipt from './Receipt';

interface IProps {
  className?: string;
}

const OrderSummaryProducts: React.FC<IProps> = ({ className }) => {
  const { invId } = usePosInv();
  const [messageApi, messageHolder] = message.useMessage();
  const [isReceiptPreviewLoading, setIsReceiptPreviewLoading] = useState(false);
  const { customerId, cart, vat, tax, deliveryCharge, isRoundOff } = useAppSelector((store) => store.orderSlice);
  const orderCoupon = useAppSelector(orderCouponSnap);
  const orderDiscount = useAppSelector(orderDiscountSnap);
  const orderVat = useAppSelector(orderVatSnap);
  const orderTax = useAppSelector(orderTaxSnap);
  const orderSubtotal = useAppSelector(orderSubtotalSnap);
  const orderRoundOff = useAppSelector(orderRoundOffSnap);
  const orderGrandTotal = useAppSelector(orderGrandTotalSnap);
  const dispatch = useAppDispatch();

  const handlePdfFn = async () => {
    setIsReceiptPreviewLoading(true);

    try {
      const webLogo = await normalizeReceiptImageUrlFn(Env.webBrandLogo);
      const { data: customer } = await UsersServices.findById(customerId);
      const { data: profile } = await AuthServices.profile();
      const products = [...cart]
        ?.sort((a, b) => b.priority - a.priority)
        .map((cartItem) => {
          const product = productsBulkQuery.data?.data?.find((product) => product?.id === cartItem?.productId);
          const variation = product?.variations?.find((variation) => variation?.id === cartItem?.productVariationId);

          if (!product || !variation) return null;

          return {
            name: product?.name,
            specification: product?.specification,
            salePrice: variation?.sale_price,
            quantity: cartItem?.selectedQuantity,
            color: variation?.color,
            size: variation?.size,
          };
        })
        .filter(Boolean);

      const props = {
        webLogo,
        webTitle: Env.webTitle,
        moneyReceiptDate: dayjs().format(Dayjs.dateTimeSecondsWithAmPm),
        trxId: invId,
        customerName: customer?.name,
        phone: customer?.phone,
        products,
        coupon: orderCoupon,
        discount: orderDiscount,
        vat: orderVat,
        vatPercent: vat?.type === ENUM_SETTINGS_VAT_TYPES.PERCENTAGE ? vat?.amount : 0,
        tax: orderTax,
        taxPercent: tax?.type === ENUM_SETTINGS_TAX_TYPES.PERCENTAGE ? tax?.amount : 0,
        deliveryCharge,
        subTotal: orderSubtotal.subTotalSale,
        roundOff: isRoundOff ? orderRoundOff : 0,
        grandTotal: orderGrandTotal.totalSaleWithRoundOff,
        isRedeemExceedingProfit: orderGrandTotal.isRedeemExceedingProfit,
        receivedBy: profile?.name,
      };

      const blob = await pdf(<Receipt {...props} />).toBlob();
      Toolbox.printWindow('pdf', URL.createObjectURL(blob));
    } catch (error) {
      messageApi.error('Failed to generate receipt preview. Please try again.');
    }

    setIsReceiptPreviewLoading(false);
  };

  const productsBulkQuery = ProductsHooks.useFindBulk({
    config: {
      onSuccess: (res) => {
        if (!res.success) {
          messageApi.error(res.message);
          return;
        }

        const cartProducts =
          cart
            ?.map((cartItem) => {
              const product = res.data?.find((product) => product.id === cartItem.productId);
              const variation = product?.variations?.find((variation) => variation.id === cartItem.productVariationId);

              if (!product || !variation) return null;

              return {
                productId: cartItem.productId,
                productVariationId: cartItem.productVariationId,
                selectedQuantity: cartItem.selectedQuantity,
                costPrice: variation.cost_price,
                salePrice: variation.sale_price,
                discount: variation.discount,
              };
            })
            .filter(Boolean) || [];

        dispatch(setCartProducts(cartProducts));
      },
    },
  });

  useEffect(() => {
    if (cart) productsBulkQuery.mutate(cart.map((elem) => elem.productId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart?.length]);

  return (
    <div className={cn('order_summary_products flex flex-col gap-4', className)}>
      {messageHolder}
      <div className="flex flex-wrap justify-between items-center gap-2">
        <Tag color="var(--color-primary)" className="!me-0">
          Total: {cart?.length}
        </Tag>
        <Button
          size="small"
          type="dashed"
          loading={isReceiptPreviewLoading}
          disabled={!cart?.length}
          onClick={handlePdfFn}
        >
          Preview
        </Button>
        <Tag color="var(--color-primary)" className="!ml-auto !me-0">
          Total Price: {Toolbox.withCurrency(orderGrandTotal.totalSaleWithRoundOff)}
        </Tag>
        <Popconfirm
          title="Clear Cart"
          description="Are you sure you want to clear the cart?"
          onConfirm={() => dispatch(clearCartFn())}
          okText="Yes, Clear"
          cancelText="Cancel"
          okType="danger"
        >
          <Button danger size="small" disabled={!cart?.length}>
            Clear
          </Button>
        </Popconfirm>
      </div>
      <div className="space-y-4 max-h-[520px] overflow-y-auto hidden_scrollbar overscroll-contain">
        {productsBulkQuery.isPending ? (
          <div className="text-center">
            <Spin />
          </div>
        ) : productsBulkQuery.data?.data?.length ? (
          [...cart]
            ?.sort((a, b) => b.priority - a.priority)
            .map((cartItem, idx) => {
              const product = productsBulkQuery.data?.data?.find((product) => product?.id === cartItem?.productId);
              const variation = product?.variations?.find(
                (variation) => variation?.id === cartItem?.productVariationId,
              );

              if (!product || !variation) return null;

              const purifiedElem = {
                ...product,
                selectedQuantity: cartItem.selectedQuantity,
                discount: cartItem.discount,
                selectedVariation: variation,
              };

              return (
                <OrderSummaryProduct
                  key={`${cartItem.productId}-${cartItem.productVariationId}`}
                  idx={idx}
                  product={purifiedElem}
                />
              );
            })
            .filter(Boolean)
        ) : (
          <Empty description="No products added!" />
        )}
      </div>
    </div>
  );
};

export default OrderSummaryProducts;
