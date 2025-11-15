import { Paths } from '@lib/constant/paths';
import { cn } from '@lib/utils/cn';
import { Toolbox } from '@lib/utils/toolbox';
import { IProduct } from '@modules/products/lib/interfaces';
import { Button } from 'antd';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { BsBasket2, BsFillBasket2Fill, BsHeart, BsHeartFill } from 'react-icons/bs';

interface IProps {
  className?: string;
  wrapperClassName?: string;
  product: IProduct;
}

const RecommendedProductCard: React.FC<IProps> = ({ className, wrapperClassName, product }) => {
  const router = useRouter();

  const priceInfo = useMemo(() => {
    if (!product?.variations?.length) {
      return { regular: 'Price not available', special: null };
    }

    const regularPrices = product.variations.map((v) => v?.sale_price);
    const specialPrices = product.variations.map((v) => v?.['special_price']);

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

  const isFavorite = false;
  const isCart = false;

  return (
    <div className={cn('recommended_product_card', className)}>
      <div className={cn('wrapper', wrapperClassName)}>
        {product?.['has_special_price'] && <span className="special_badge">Sale</span>}
        <div className="content_wrapper">
          <p className="title">{product?.name}</p>
          <p className="price">
            <span
              className={cn('regular', {
                'line-through mr-1': product?.['has_special_price'],
              })}
            >
              {priceInfo.regular}
            </span>
            {product?.['has_special_price'] && <span className="special">{priceInfo.special}</span>}
          </p>
        </div>
        <div className="flex items-center gap-2 justify-between">
          <div className="btn_container">
            <Button
              type="primary"
              icon={isFavorite ? <BsHeartFill size={20} className="mt-1" /> : <BsHeart size={20} className="mt-1" />}
            />
            <Button
              type="primary"
              icon={
                isCart ? <BsFillBasket2Fill size={20} className="mt-1" /> : <BsBasket2 size={20} className="mt-1" />
              }
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
