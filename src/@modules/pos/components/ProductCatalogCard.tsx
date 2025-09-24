import { ImagePaths } from '@lib/constant/imagePaths';
import { useAppDispatch } from '@lib/redux/hooks';
import { addToCartFn } from '@lib/redux/order/orderSlice';
import { cn } from '@lib/utils/cn';
import { Toolbox } from '@lib/utils/toolbox';
import { IProduct } from '@modules/products/lib/interfaces';
import { Badge, Button, Image } from 'antd';
import React from 'react';
import { BiCartAdd } from 'react-icons/bi';
import { FaCheck } from 'react-icons/fa';

interface IProps {
  className?: string;
  isFocused: boolean;
  isInCart: boolean;
  isOutOfStock: boolean;
  product: IProduct;
}

const ProductCatalogCard: React.FC<IProps> = ({ className, isFocused, isInCart, isOutOfStock, product }) => {
  // const { invId } = usePosInv();
  const dispatch = useAppDispatch();

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
      <div className="relative image_wrapper rounded-xl bg-gray-100 dark:bg-[var(--color-dark-gray)]">
        {isInCart && (
          <div className="z-10 absolute top-4 left-4 flex items-center justify-center p-1 bg-green-900 rounded-full text-green-300">
            <FaCheck size={12} />
          </div>
        )}
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
          <Button
            type="primary"
            shape="circle"
            disabled={isInCart || isOutOfStock}
            onClick={() =>
              dispatch(
                addToCartFn({
                  item: { id: product.id, selectedQuantity: 1 },
                }),
              )
            }
            ghost
          >
            <BiCartAdd />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCatalogCard;
