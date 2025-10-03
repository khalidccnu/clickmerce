import FloatInputNumber from '@base/antd/components/FloatInputNumber';
import FloatSelect from '@base/antd/components/FloatSelect';
import { useAppDispatch, useAppSelector } from '@lib/redux/hooks';
import { removeFromCartFn, updateCartFn } from '@lib/redux/order/orderSlice';
import { cartItemFn } from '@lib/redux/order/utils';
import { cn } from '@lib/utils/cn';
import { Toolbox } from '@lib/utils/toolbox';
import { productDiscountTypes } from '@modules/products/lib/enums';
import { IProduct, IProductVariation } from '@modules/products/lib/interfaces';
import { InputNumber } from 'antd';
import React from 'react';
import { FaTrash } from 'react-icons/fa';

interface IProps {
  className?: string;
  idx: number;
  product: IProduct & {
    selectedQuantity: number;
    discount: IProductVariation['discount'];
    selectedVariation: IProduct['variations'][number];
  };
}

const OrderSummaryProduct: React.FC<IProps> = ({ className, idx, product }) => {
  const { cart } = useAppSelector((store) => store.orderSlice);
  const dispatch = useAppDispatch();

  const discount = cartItemFn(product?.id, product?.selectedVariation?.id, cart)?.discount;

  return (
    <div
      className={cn(
        'bg-white dark:bg-[var(--color-dark-gray)] border border-gray-300 dark:border-gray-700 rounded-lg',
        className,
      )}
    >
      <div className="p-2 border-b border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-start gap-1">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base line-clamp-2">
              {product?.name}
            </h3>
            {product?.rack && (
              <span className="flex items-center gap-1 text-xs md:text-sm text-gray-500 dark:text-gray-300">
                <span className="font-medium">Rack:</span>
                {product?.rack}
              </span>
            )}
          </div>
          <button
            onClick={() =>
              dispatch(
                removeFromCartFn({
                  item: {
                    productId: product?.id,
                    productVariationId: product?.selectedVariation?.id,
                  },
                }),
              )
            }
            className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-500 dark:text-red-300 transition-colors duration-300 shrink-0"
          >
            <FaTrash size={12} />
          </button>
        </div>
      </div>
      <div className="p-2 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Unit Price:</span>
          <span className="text-lg font-bold text-blue-500 dark:text-blue-300">
            {Toolbox.withCurrency(product?.selectedVariation?.sale_price)}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-1">
          <FloatSelect
            showSearch
            virtual={false}
            placeholder="Discount type"
            className="w-full"
            filterOption={(input, option: any) => option.label.toLowerCase().includes(input.toLowerCase())}
            options={productDiscountTypes.map((discountType) => ({
              key: discountType,
              label: Toolbox.toPrettyText(discountType),
              value: discountType,
            }))}
            value={product?.discount?.type}
            onChange={(value) => {
              dispatch(
                updateCartFn({
                  item: {
                    productId: product?.id,
                    productVariationId: product?.selectedVariation?.id,
                    discount: {
                      ...discount,
                      type: value,
                    },
                  },
                }),
              );
            }}
          />
          <FloatInputNumber
            placeholder="Discount Amount"
            className="w-full"
            min={0}
            value={product?.discount?.amount}
            onChange={(value: number) => {
              dispatch(
                updateCartFn({
                  item: {
                    productId: product?.id,
                    productVariationId: product?.selectedVariation?.id,
                    discount: {
                      ...discount,
                      amount: value,
                    },
                  },
                }),
              );
            }}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          <div />
          <InputNumber
            placeholder="Quantity"
            className="w-full"
            autoFocus={idx === 0}
            min={1}
            max={product?.selectedVariation?.quantity}
            value={product?.selectedQuantity}
            onChange={(value: number) => {
              dispatch(
                updateCartFn({
                  item: {
                    productId: product?.id,
                    productVariationId: product?.selectedVariation?.id,
                    selectedQuantity: value,
                  },
                }),
              );
            }}
            addonAfter={
              <span className="text-xs text-gray-500 dark:text-gray-300 whitespace-nowrap">
                / {product?.selectedVariation?.quantity}
              </span>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryProduct;
