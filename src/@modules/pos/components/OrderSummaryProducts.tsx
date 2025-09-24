import { useAppDispatch, useAppSelector } from '@lib/redux/hooks';
import { clearCartFn } from '@lib/redux/order/orderSlice';
import { cn } from '@lib/utils/cn';
import { Toolbox } from '@lib/utils/toolbox';
import { ProductsHooks } from '@modules/products/lib/hooks';
import { Button, Empty, message, Spin, Tag } from 'antd';
import React, { useEffect } from 'react';
import OrderSummaryProduct from './OrderSummaryProduct';

interface IProps {
  className?: string;
}

const OrderSummaryProducts: React.FC<IProps> = ({ className }) => {
  const [messageApi, messageHolder] = message.useMessage();
  const { cart } = useAppSelector((store) => store.orderSlice);
  const dispatch = useAppDispatch();

  const productsBulkQuery = ProductsHooks.useFindBulk({
    config: {
      onSuccess: (res) => {
        if (!res.success) {
          messageApi.error(res.message);
          return;
        }
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
        <Button size="small" type="dashed" disabled={!cart?.length}>
          Preview
        </Button>
        <Tag color="var(--color-primary)" className="!ml-auto !me-0">
          Total Price: {Toolbox.withCurrency(0)}
        </Tag>
        <Button danger size="small" onClick={() => dispatch(clearCartFn())} disabled={!cart?.length}>
          Clear
        </Button>
      </div>
      <div className="space-y-4 max-h-96 overflow-y-auto hidden_scrollbar">
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
