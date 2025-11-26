import { States } from '@lib/constant/states';
import useLocalState from '@lib/hooks/useLocalState';
import { cn } from '@lib/utils/cn';
import { Toolbox } from '@lib/utils/toolbox';
import { hasProductVariationInCartFn } from '@modules/orders/lib/utils';
import { IProduct } from '@modules/products/lib/interfaces';
import { Button } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { BiCartAdd } from 'react-icons/bi';

interface IProps {
  product: IProduct;
  onAddToCart: (product: IProduct, productVariation: IProduct['variations'][number]) => void;
}

const ProductViewVariations: React.FC<IProps> = ({ product, onAddToCart }) => {
  const [order] = useLocalState(States.order);

  return (
    <div className="space-y-2">
      {(product?.variations || []).map((variation) => {
        const hasInCart = hasProductVariationInCartFn(variation.id, order?.cart);
        const isOutOfStock = !variation.quantity;
        const expirationDate = variation.exp ? dayjs(variation.exp) : null;
        const isExpired = expirationDate && expirationDate.isBefore(dayjs(), 'day');

        return (
          <div
            key={variation.id}
            className={cn(
              'rounded-lg p-2 border space-y-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/30',
              {
                'border-green-300 bg-green-50 dark:bg-green-900/20': hasInCart,
                'border-red-300 bg-red-50 dark:bg-red-900/20': isOutOfStock || isExpired,
              },
            )}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 text-sm">
                <div className="font-bold text-lg text-blue-700 dark:text-blue-400">
                  {Toolbox.withCurrency(variation.sale_price)}
                </div>
                <div className="hidden md:block w-px h-6 bg-gray-300 dark:bg-gray-500" />
                <div className="flex items-center gap-1">
                  {isOutOfStock ? (
                    <span className="text-red-600 font-semibold">Out of Stock</span>
                  ) : variation.quantity <= 10 ? (
                    <span className="text-orange-600 font-semibold">Low Stock</span>
                  ) : (
                    <span className="text-green-600 font-semibold">In Stock</span>
                  )}
                </div>
              </div>
              <Button
                type="primary"
                shape="circle"
                icon={<BiCartAdd size={16} />}
                disabled={isOutOfStock || hasInCart || isExpired}
                onClick={() => onAddToCart(product, variation)}
                ghost
              />
            </div>
            {(variation.color || variation.size || variation.weight) && (
              <div className="flex items-center gap-2 text-xs">
                {variation.color && (
                  <p className="px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center gap-1">
                    Color: {variation.color}
                    <span
                      style={{
                        display: 'inline-block',
                        width: 8,
                        height: 8,
                        borderRadius: '100%',
                        backgroundColor: variation.color,
                      }}
                    />
                  </p>
                )}
                {variation.size && (
                  <p className="px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                    Size: {variation.size}
                  </p>
                )}
                {variation.weight && (
                  <p className="px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                    Weight: {variation.weight}
                  </p>
                )}
              </div>
            )}
            {(hasInCart || isOutOfStock || isExpired) && (
              <div className="flex gap-2">
                {hasInCart && (
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-lg">
                    ✓ In Cart
                  </span>
                )}
                {!hasInCart && isOutOfStock && (
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-lg">
                    Out of Stock
                  </span>
                )}
                {!hasInCart && isExpired && (
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-lg">
                    Expired
                  </span>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProductViewVariations;
