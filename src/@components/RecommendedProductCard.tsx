import { Paths } from '@lib/constant/paths';
import { States } from '@lib/constant/states';
import useLocalState from '@lib/hooks/useLocalState';
import { cn } from '@lib/utils/cn';
import { Toolbox } from '@lib/utils/toolbox';
import { hasProductInCartFn, hasProductInWishlistFn } from '@modules/orders/lib/utils';
import { IProduct } from '@modules/products/lib/interfaces';
import { Button } from 'antd';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { BsBasket2, BsFillBasket2Fill, BsHeart, BsHeartFill } from 'react-icons/bs';

interface IProps {
  className?: string;
  wrapperClassName?: string;
  product: IProduct;
  onCartUpdate: (product: IProduct) => void;
  onWishlistUpdate: (product: IProduct) => void;
}

const RecommendedProductCard: React.FC<IProps> = ({
  className,
  wrapperClassName,
  product,
  onCartUpdate,
  onWishlistUpdate,
}) => {
  const router = useRouter();
  const [order] = useLocalState(States.order);

  const priceInfo = useMemo(() => {
    if (!product?.variations?.length) {
      return { regular: 'Price not available', special: null };
    }

    const regularPrices = product.variations.map((v) => v?.sale_price);
    const specialPrices = product.variations.map((v) => v?.sale_discount_price || v?.sale_price);

    const minRegularPrice = Math.min(...regularPrices);
    const maxRegularPrice = Math.max(...regularPrices);
    const minSpecialPrice = Math.min(...specialPrices);
    const maxSpecialPrice = Math.max(...specialPrices);

    if (product.variations.length === 1) {
      return {
        regular: Toolbox.withCurrency(minRegularPrice),
        special: Toolbox.withCurrency(minSpecialPrice),
      };
    }

    return {
      regular: `${Toolbox.withCurrency(minRegularPrice)} - ${Toolbox.withCurrency(maxRegularPrice)}`,
      special: `${Toolbox.withCurrency(minSpecialPrice)} - ${Toolbox.withCurrency(maxSpecialPrice)}`,
    };
  }, [product?.variations]);

  const isFavorite = hasProductInWishlistFn(product.id, order?.wishlist || []);
  const isCart = product?.variations?.length <= 1 ? hasProductInCartFn(product.id, order?.cart || []) : false;

  return (
    <div className={cn('recommended_product_card', className)}>
      <div className={cn('wrapper', wrapperClassName)}>
        {product?.['has_sale_discount_price'] && <span className="special_badge">Sale</span>}
        <div className="content_wrapper">
          <p className="title">{product?.name}</p>
          <p className="price">
            <span
              className={cn('regular', {
                'line-through mr-1 text-sm text-gray-400 dark:text-gray-300': product?.['has_sale_discount_price'],
              })}
            >
              {priceInfo.regular}
            </span>
            {product?.['has_sale_discount_price'] && <span className="special">{priceInfo.special}</span>}
          </p>
        </div>
        <div className="flex items-center gap-2 justify-between">
          <div className="btn_container">
            <Button
              type="primary"
              icon={isFavorite ? <BsHeartFill size={20} className="mt-1" /> : <BsHeart size={20} className="mt-1" />}
              onClick={() => onWishlistUpdate(product)}
            />
            <Button
              type="primary"
              icon={
                isCart ? <BsFillBasket2Fill size={20} className="mt-1" /> : <BsBasket2 size={20} className="mt-1" />
              }
              onClick={() => onCartUpdate(product)}
              ghost
            />
          </div>
          <Button className="view" onClick={() => router.push(Paths.products.toSlug(product.slug))}>
            View
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecommendedProductCard;
