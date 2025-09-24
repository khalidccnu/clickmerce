import { ImagePaths } from '@lib/constant/imagePaths';
import { cn } from '@lib/utils/cn';
import { Toolbox } from '@lib/utils/toolbox';
import { IProduct } from '@modules/products/lib/interfaces';
import { Badge, Image } from 'antd';
import React from 'react';
import { BiCartAdd } from 'react-icons/bi';

interface IProps {
  className?: string;
  isFocused?: boolean;
  product: IProduct;
}

const ProductCatalogCard: React.FC<IProps> = ({ className, isFocused, product }) => {
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
      className={cn(
        'product_catalog_card p-4 flex flex-col gap-4 border border-gray-100 rounded-xl bg-white dark:bg-[var(--color-rich-black)] dark:border-gray-700',
        { 'border-[var(--color-primary)]': isFocused },
        className,
      )}
    >
      <div className="image_wrapper rounded-xl bg-gray-100 dark:bg-[var(--color-dark-gray)]">
        <Badge.Ribbon text={product?.quantity} color="var(--color-primary)">
          <Image
            src={ImagePaths.notFound}
            alt={product.name}
            className="rounded-xl"
            wrapperClassName="[&_.ant-image-mask]:rounded-xl"
          />
        </Badge.Ribbon>
      </div>
      <div className="content_wrapper">
        <p className="font-semibold dark:text-white">{product.name}</p>
        <p className="text-gray-700 dark:text-gray-300 text-sm">{product?.supplier?.name}</p>
        <p className="space-x-1 text-gray-500 dark:text-gray-200 text-sm">
          {!!product?.strength &&
            `${product?.dosage_form?.name ? product.dosage_form.name + ' - ' : ''}${product.strength}`}
        </p>
        <div className="border-t border-dotted border-gray-300 mt-4 pt-4 flex items-center justify-between gap-4">
          <p className="font-semibold text-sm dark:text-white">{handlePriceShowFn()}</p>
          <div className="flex items-center justify-center p-2 bg-gray-200 dark:bg-[var(--color-dark-gray)] rounded-full cursor-pointer hover:bg-[var(--color-primary)] dark:hover:bg-[var(--color-primary)] hover:text-white transition-colors duration-500">
            <BiCartAdd />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCatalogCard;
