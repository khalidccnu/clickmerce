import { Dayjs } from '@lib/constant/dayjs';
import { useAppSelector } from '@lib/redux/hooks';
import { cn } from '@lib/utils/cn';
import { Toolbox } from '@lib/utils/toolbox';
import { hasProductVariationInCartFn } from '@modules/orders/lib/utils';
import { IProduct } from '@modules/products/lib/interfaces';
import { Alert, Button } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { BiCartAdd } from 'react-icons/bi';

interface IProps {
  product: IProduct;
  onAddToCart: (product: IProduct, productVariation: IProduct['variations'][number]) => void;
}

const ProductCatalogVariations: React.FC<IProps> = ({ product, onAddToCart }) => {
  const { cart } = useAppSelector((store) => store.orderSlice);

  return (
    <div className="space-y-4">
      <Alert message="Please select a variation to add to cart!" type="info" showIcon />
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 border border-gray-300 dark:border-gray-700 space-y-2">
        <p className="font-semibold text-lg text-gray-900 dark:text-white">{product?.name}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-300">
          <div className="col-span-full">
            <span>Supplier:</span>
            <span className="ml-2 font-medium">{product?.supplier?.name}</span>
          </div>
          {product?.specification && (
            <p className={cn('col-span-2 font-medium', { 'col-span-full': !product?.rack })}>
              {product?.dosage_form?.name
                ? `${product?.dosage_form?.name} (${product?.specification})`
                : product?.specification}
            </p>
          )}
          {product?.rack && (
            <div className={cn({ 'col-span-full': !product?.specification })}>
              <span>Rack:</span>
              <span className="ml-2 font-medium">{product.rack}</span>
            </div>
          )}
        </div>
      </div>
      <div className="space-y-2">
        {(product?.variations || []).map((variation) => {
          const isOutOfStock = !variation.quantity;
          const hasInCart = hasProductVariationInCartFn(variation.id, cart);
          const expirationDate = variation.exp ? dayjs(variation.exp) : null;
          const isExpiringSoon = expirationDate && expirationDate.diff(dayjs(), 'months') < 3;
          const isExpired = expirationDate && expirationDate.isBefore(dayjs(), 'day');

          return (
            <div
              key={variation.id}
              className={cn(
                'rounded-lg p-2 border space-y-2 border-gray-300 dark:border-gray-500/20 bg-gray-50 dark:bg-gray-500/20',
                {
                  'border-green-300 dark:border-green-700/20 bg-green-50 dark:bg-green-700/20': hasInCart,
                  'border-red-300 dark:border-red-700/20 bg-red-50 dark:bg-red-700/20': isOutOfStock || isExpired,
                },
              )}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col md:flex-row md:items-center gap-0.5 md:gap-4 text-sm">
                  <div className="font-bold text-lg text-blue-700 dark:text-blue-500">
                    {Toolbox.withCurrency(variation.sale_price)}
                  </div>
                  <div className="hidden md:block w-px h-6 bg-gray-300 dark:bg-gray-500" />
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500 dark:text-gray-300 text-xs">Stock:</span>
                    <span
                      className={cn('font-semibold', {
                        'text-green-700 dark:text-green-500': variation.quantity > 10,
                        'text-orange-700 dark:text-orange-500': !!variation.quantity && variation.quantity <= 10,
                        'text-red-700 dark:text-red-500': !variation.quantity,
                      })}
                    >
                      {variation.quantity || 0}
                    </span>
                  </div>
                  {(variation.mfg || variation.exp) && (
                    <React.Fragment>
                      <div className="hidden md:block w-px h-6 bg-gray-300 dark:bg-gray-500"></div>
                      <div className="flex items-center gap-2 text-xs">
                        {variation.mfg && (
                          <div>
                            <span className="text-gray-500 dark:text-gray-300">MFG:</span>
                            <span className="ml-1 text-gray-700 dark:text-gray-300">
                              {dayjs(variation.mfg).format(Dayjs.date)}
                            </span>
                          </div>
                        )}
                        {variation.exp && (
                          <div>
                            <span className="text-gray-500 dark:text-gray-300">EXP:</span>
                            <span
                              className={cn('ml-1', {
                                'text-red-700 dark:text-red-500 font-medium': isExpired,
                                'text-orange-700 dark:text-orange-500 font-medium': isExpiringSoon,
                                'text-gray-700 dark:text-gray-500': !isExpired && !isExpiringSoon,
                              })}
                            >
                              {dayjs(variation.exp).format(Dayjs.date)}
                            </span>
                          </div>
                        )}
                      </div>
                    </React.Fragment>
                  )}
                </div>
                <div className="shrink-0">
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<BiCartAdd size={16} />}
                    disabled={isOutOfStock || hasInCart || isExpired}
                    onClick={() => onAddToCart(product, variation)}
                    ghost
                  />
                </div>
              </div>
              {(variation.color || variation.size || variation.weight) && (
                <div className="flex items-center gap-2 text-xs">
                  {variation.color && (
                    <p className="px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                      Color: {variation.color}{' '}
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
              {(hasInCart || isOutOfStock || isExpired || isExpiringSoon) && (
                <React.Fragment>
                  {hasInCart && (
                    <p className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-lg">
                      ✓
                    </p>
                  )}
                  {!hasInCart && isOutOfStock && (
                    <p className="inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-lg">
                      Stock Out
                    </p>
                  )}
                  {!hasInCart && !isOutOfStock && isExpired && (
                    <p className="inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-lg">
                      Expired
                    </p>
                  )}
                  {!hasInCart && !isOutOfStock && !isExpired && isExpiringSoon && (
                    <p className="inline-block px-2 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded-lg">
                      Expiring Soon
                    </p>
                  )}
                </React.Fragment>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductCatalogVariations;
