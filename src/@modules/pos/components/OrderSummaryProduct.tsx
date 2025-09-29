import { useAppDispatch } from '@lib/redux/hooks';
import { removeFromCartFn, updateCartFn } from '@lib/redux/order/orderSlice';
import { cn } from '@lib/utils/cn';
import { Toolbox } from '@lib/utils/toolbox';
import { IProduct } from '@modules/products/lib/interfaces';
import { InputNumber } from 'antd';
import React from 'react';
import { FaTrash } from 'react-icons/fa';

interface IProps {
  className?: string;
  idx: number;
  product: IProduct & {
    selectedQuantity: number;
    selectedVariation: IProduct['variations'][number];
  };
}

const OrderSummaryProduct: React.FC<IProps> = ({ className, idx, product }) => {
  const dispatch = useAppDispatch();

  return (
    <div
      className={cn(
        'grid grid-cols-4 md:grid-cols-8 items-center gap-4 md:gap-y-1 px-4 py-1.5 border border-gray-300 dark:border-gray-700 rounded-md',
        className,
      )}
    >
      <div className="space-y-1 col-span-full">
        <div className="font-medium dark:text-white flex justify-between items-center gap-2">
          <p className="line-clamp-1">{product?.name}</p>
          <div className="inline-flex justify-center items-center w-8 h-8 rounded-full p-1 bg-red-700/20 cursor-pointer text-red-500 hover:text-red-700 shrink-0">
            <FaTrash
              size={12}
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
            />
          </div>
        </div>
        {!!product?.specification && (
          <p className="text-gray-500 dark:text-gray-300 text-sm">
            {product?.dosage_form?.name
              ? `${product?.dosage_form?.name} (${product?.specification})`
              : product?.specification}
          </p>
        )}
        <p className="text-gray-500 dark:text-gray-300 text-sm">{product?.supplier?.name}</p>
        {product?.rack && (
          <p className="text-gray-500 dark:text-gray-300 text-sm">
            <span className="font-medium">Rack: </span>
            <span>{product?.rack}</span>
          </p>
        )}
      </div>
      <p className="col-span-2 md:col-span-5 dark:text-white">
        {Toolbox.withCurrency(product?.selectedVariation?.sale_price)}
      </p>
      <InputNumber
        className="col-span-2 w-full md:col-span-3"
        autoFocus={idx === 0}
        size="small"
        min={1}
        max={product?.selectedVariation?.quantity}
        defaultValue={product?.selectedQuantity}
        onChange={(value) => {
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
      />
    </div>
  );
};

export default OrderSummaryProduct;
