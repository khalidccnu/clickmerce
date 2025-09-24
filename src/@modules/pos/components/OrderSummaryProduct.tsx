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
        'grid grid-cols-4 md:grid-cols-8 items-center gap-4 md:gap-y-0 px-4 py-1.5 border border-gray-300 rounded-md',
        className,
      )}
    >
      <div className="col-span-full md:col-span-4">
        <div className="space-x-1 line-clamp-1">
          <p className="font-medium dark:text-white">
            <FaTrash
              size={12}
              className="inline-block mr-0.5 -mt-0.5 cursor-pointer text-red-500 hover:text-red-700"
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
            {product?.name}
          </p>
          {!!product?.strength && (
            <span className="text-gray-500">
              {product?.dosage_form?.name
                ? `(${product?.dosage_form?.name} - ${product?.strength})`
                : `(${product?.strength})`}
            </span>
          )}
        </div>
        <div className="space-y-0.5 text-sm text-gray-500">
          <p>{product?.supplier?.name}</p>
          {product?.rack && (
            <p>
              <span className="font-medium">Rack: </span>
              <span>{product?.rack}</span>
            </p>
          )}
        </div>
      </div>
      <p className="col-span-2 dark:text-white">{Toolbox.withCurrency(0)}</p>
      <InputNumber
        className="col-span-2 w-full"
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
