import { Paths } from '@lib/constant/paths';
import { cn } from '@lib/utils/cn';
import { Toolbox } from '@lib/utils/toolbox';
import { IProduct } from '@modules/products/lib/interfaces';
import { Button } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { BsBasket2, BsFillBasket2Fill, BsHeart, BsHeartFill } from 'react-icons/bs';

interface IProps {
  className?: string;
  product: IProduct;
}

const ProductCard: React.FC<IProps> = ({ className, product }) => {
  const router = useRouter();

  const featuredImage = useMemo(() => {
    if (Toolbox.isNotEmpty(product?.images)) {
      return product.images.find((image) => image.is_featured) || product.images[0];
    }

    return {
      is_featured: false,
      url: Toolbox.generateCharacterSvg({ type: 'url', character: product.name }),
    };
  }, [product]);

  const priceInfo = useMemo(() => {
    if (!product?.variations?.length) {
      return { regular: 'Price not available', special: null };
    }

    const regularPrices = product.variations.map((v) => v?.sale_price);
    const specialPrices = product.variations.map((v) => v?.['sale_discount_price']);

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
    <div className={cn('product_card', className)}>
      <div className="image_wrapper">
        {product?.['has_sale_discount_price'] && <span className="special_badge">Sale</span>}
        <div className="btn_container">
          <Button
            type="primary"
            icon={isFavorite ? <BsHeartFill size={20} className="mt-1" /> : <BsHeart size={20} className="mt-1" />}
          />
          <Button
            type="primary"
            icon={isCart ? <BsFillBasket2Fill size={20} className="mt-1" /> : <BsBasket2 size={20} className="mt-1" />}
            ghost
          />
        </div>
        <Button className="view" onClick={() => router.push(Paths.products.toSlug(product.slug))}>
          View
        </Button>
        <Image src={featuredImage?.url} alt={product?.name} width={300} height={300} quality={100} />
      </div>
      <div className="content_wrapper">
        <p className="title">{product?.name}</p>
        <p className="price">
          <span
            className={cn('regular', {
              'line-through mr-1': product?.['has_sale_discount_price'],
            })}
          >
            {priceInfo.regular}
          </span>
          {product?.['has_sale_discount_price'] && <span className="special">{priceInfo.special}</span>}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
