import BaseModalWithoutClicker from '@base/components/BaseModalWithoutClicker';
import SectionIntro from '@base/components/SectionIntro';
import { States } from '@lib/constant/states';
import { useAnalyticEvent } from '@lib/hooks/useAnalyticEvent';
import useLocalState from '@lib/hooks/useLocalState';
import { IOrderCartItem } from '@lib/redux/order/orderSlice';
import { cn } from '@lib/utils/cn';
import {
  cartItemIdxFn,
  hasProductInCartFn,
  hasProductVariationInCartFn,
  wishlistItemIdxFn,
} from '@modules/orders/lib/utils';
import { IProduct } from '@modules/products/lib/interfaces';
import { message } from 'antd';
import React, { useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import ProductViewVariations from './ProductViewVariations';
import RecommendedProductCard from './RecommendedProductCard';

interface IProps {
  className?: string;
  products: IProduct[];
}

const RecommendedProductsSection: React.FC<IProps> = ({ className, products }) => {
  const [messageApi, messageHolder] = message.useMessage();
  const { sendEventFn } = useAnalyticEvent();
  const [order, setOrder] = useLocalState(States.order);
  const [product, setProduct] = useState<IProduct>(null);

  const addToWishlistFn = (product: IProduct) => {
    const wishlist = order?.wishlist || [];
    const item = { productId: product.id, productVariationId: null };

    const idx = wishlistItemIdxFn(item.productId, wishlist);
    const lastPriority = wishlist.length ? Math.max(...wishlist.map((c) => c.priority || 0)) : 0;
    const priority = lastPriority + 1;

    if (idx === -1) {
      const newWishlist = [...wishlist, { ...item, priority }];

      setOrder({
        ...order,
        wishlist: newWishlist,
      });

      sendEventFn({
        name: 'wishlist_item',
        data: { product_id: product.id, product_name: product.name },
      });
      message.info('Successfully added to the wishlist!');
      return;
    }

    const purifiedWishlist = [...wishlist];
    const sanitizedWishlist = purifiedWishlist.filter((item) => item.productId !== product.id);

    message.info('Successfully removed from the wishlist!');
    setOrder({
      ...order,
      wishlist: sanitizedWishlist,
    });
  };

  const addToCartFn = ({ item }: { item: IOrderCartItem }) => {
    const cart = order?.cart || [];

    const idx = cartItemIdxFn(item.productId, item.productVariationId, cart);
    const lastPriority = cart.length ? Math.max(...cart.map((c) => c.priority || 0)) : 0;
    const priority = lastPriority + 1;

    if (idx === -1) {
      const newCart = [...cart, { ...item, priority }];

      setOrder({
        ...order,
        cart: newCart,
      });

      sendEventFn({
        name: 'add_to_cart',
        data: { product_id: item?.productId, product_variation_id: item?.productVariationId, name: product?.name },
      });
      message.info('Successfully added to the cart!');
      return;
    }

    const purifiedCart = [...cart];

    const prevItem = { ...purifiedCart[idx], ...item };

    purifiedCart[idx] = prevItem;

    setOrder({
      ...order,
      cart: purifiedCart,
    });
  };

  const handleAddToCartFn = (product: IProduct) => {
    const purifiedCart = order?.cart || [];
    const hasInCart = hasProductInCartFn(product.id, purifiedCart);

    if (hasInCart && product?.variations?.length === 1) {
      messageApi.warning(` ${product?.name} is already in the cart!`);
      return;
    }

    if (!product?.quantity) {
      messageApi.warning(`${product?.name} is out of stock!`);
      return;
    }

    if (product?.variations?.length === 1) {
      const variation = product.variations[0];

      addToCartFn({
        item: {
          productId: product.id,
          productVariationId: variation.id,
          selectedQuantity: 1,
        },
      });
    } else {
      setProduct(product);
    }
  };

  const handleAddToCartWithVariationFn = (product: IProduct, productVariation: IProduct['variations'][number]) => {
    const hasInCart = hasProductVariationInCartFn(productVariation.id, order?.cart);

    if (hasInCart) {
      messageApi.warning(` ${product?.name} is already in the cart!`);
      return;
    }

    if (!productVariation?.quantity) {
      messageApi.warning(`${product?.name} is out of stock!`);
      return;
    }

    addToCartFn({
      item: {
        productId: product.id,
        productVariationId: productVariation.id,
        selectedQuantity: 1,
      },
    });

    setProduct(null);
  };

  return (
    <section className={cn('recommended_products_section', className)}>
      {messageHolder}
      <div className="container">
        <SectionIntro
          title={
            <>
              <span>Recommended</span> Products
            </>
          }
          description="Explore our recommended products curated just for you"
          className="mb-8 lg:mb-16 text-center"
        />
        <div className="slider_wrapper">
          <div className="slider_content">
            <Swiper
              loop
              spaceBetween={25}
              slidesPerView={1}
              modules={[Navigation, Pagination]}
              navigation={{
                enabled: true,
                prevEl: '.rp_slider_prev_btn',
                nextEl: '.rp_slider_next_btn',
                disabledClass: 'rp_slider_disabled_btn',
              }}
              pagination={{ el: '.rp_slider_pagination', clickable: true }}
              breakpoints={{
                640: {
                  slidesPerView: products.length > 1 ? 1.2 : 1,
                },
              }}
            >
              {products.map((product) => (
                <SwiperSlide key={product.id} className="group" style={{ height: 'auto' }}>
                  <RecommendedProductCard
                    product={product}
                    className="group-[.swiper-slide-active]:bg-gray-300/50 h-full rounded-lg overflow-hidden"
                    wrapperClassName="bg-gray-50 max-w-lg h-full px-10 py-12 group-[.swiper-slide-active]:mx-auto group-[.swiper-slide-active]:bg-white dark:group-[.swiper-slide-active]:bg-[var(--color-dark-gray)] dark:group-[.swiper-slide-active]:text-white"
                    onCartUpdate={handleAddToCartFn}
                    onWishlistUpdate={addToWishlistFn}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="slider_controller">
            <div className="rp_slider_prev_btn">
              <IoIosArrowBack size={18} />
            </div>
            <div className="rp_slider_pagination" />
            <div className="rp_slider_next_btn">
              <IoIosArrowForward size={18} />
            </div>
          </div>
        </div>
      </div>
      <BaseModalWithoutClicker
        destroyOnHidden
        width={540}
        title={`Variations (${product?.name})`}
        footer={null}
        open={!!product}
        onCancel={() => setProduct(null)}
      >
        <ProductViewVariations product={product} onAddToCart={handleAddToCartWithVariationFn} />
      </BaseModalWithoutClicker>
    </section>
  );
};

export default RecommendedProductsSection;
