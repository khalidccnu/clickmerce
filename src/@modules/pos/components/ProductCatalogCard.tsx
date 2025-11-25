import { cn } from '@lib/utils/cn';
import { Toolbox } from '@lib/utils/toolbox';
import { IProduct } from '@modules/products/lib/interfaces';
import { Badge, Button, Image } from 'antd';
import React, { useMemo } from 'react';
import { BiCartAdd } from 'react-icons/bi';
import { FaCheck } from 'react-icons/fa';

interface IProps {
  className?: string;
  isFocused: boolean;
  hasInCart: boolean;
  isOutOfStock: boolean;
  product: IProduct;
  onAddToCart: (product: IProduct) => void;
}

const ProductCatalogCard = React.forwardRef<HTMLDivElement, IProps>(
  ({ className, isFocused, hasInCart, isOutOfStock, product, onAddToCart }, ref) => {
    const featuredImage = useMemo(() => {
      if (Toolbox.isNotEmpty(product?.images)) {
        return product.images.find((image) => image.is_featured) || product.images[0];
      }

      return {
        is_featured: false,
        url: Toolbox.generateCharacterSvg({ type: 'url', character: product.name }),
      };
    }, [product]);

    const handlePriceShowFn = () => {
      if (!product?.variations || !product?.variations?.length) {
        return 'Price not available';
      }

      const prices = product?.variations?.map((variation) => variation?.sale_price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      if (product.variations.length === 1) {
        return Toolbox.withCurrency(minPrice);
      } else {
        return Toolbox.withCurrency(minPrice) + ' - ' + Toolbox.withCurrency(maxPrice);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'product_catalog_card p-4 flex flex-col gap-4 border border-gray-100 rounded-xl bg-white dark:bg-[var(--color-rich-black)] dark:border-gray-700',
          { 'border-[var(--color-primary)]': isFocused },
          className,
        )}
      >
        <div className="relative image_wrapper rounded-xl bg-gray-100 dark:bg-[var(--color-dark-gray)]">
          {hasInCart && (
            <div className="z-10 absolute top-4 left-4 flex items-center justify-center p-1 bg-green-900 rounded-full text-green-300">
              <FaCheck size={12} />
            </div>
          )}
          <Badge.Ribbon text={product?.quantity ? product?.quantity : 'Out of Stock'} color="var(--color-primary)">
            <Image
              src={featuredImage?.url}
              alt={product.name}
              wrapperStyle={{ display: 'block' }}
              wrapperClassName="[&_.ant-image-mask]:rounded-xl"
              style={{ height: 288, width: '100%' }}
              className="rounded-xl object-cover"
            />
          </Badge.Ribbon>
        </div>
        <div className="content_wrapper flex flex-col justify-between h-full">
          <div className="mb-4">
            <p className="font-semibold dark:text-white">{product.name}</p>
            <p className="text-gray-700 dark:text-gray-300 text-sm">{product?.supplier?.name}</p>
            <p className="space-x-1 text-gray-500 dark:text-gray-200 text-sm">
              {!!product?.specification &&
                `${product?.dosage_form?.name ? product.dosage_form.name + ' - ' : ''}${product.specification}`}
            </p>
          </div>
          <div className="border-t border-dotted border-gray-300 pt-4 flex items-center justify-between gap-4">
            <p className="font-semibold text-sm dark:text-white">{handlePriceShowFn()}</p>
            <Button
              type="primary"
              shape="circle"
              icon={<BiCartAdd size={16} />}
              disabled={(hasInCart && product?.variations?.length === 1) || isOutOfStock}
              onClick={() => onAddToCart(product)}
              ghost
            />
          </div>
        </div>
      </div>
    );
  },
);

ProductCatalogCard.displayName = 'ProductCatalogCard';

export default ProductCatalogCard;
