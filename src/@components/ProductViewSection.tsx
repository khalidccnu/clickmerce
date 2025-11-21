import BaseModalWithoutClicker from '@base/components/BaseModalWithoutClicker';
import Breadcrumb from '@base/components/Breadcrumb';
import { IMetaResponse } from '@base/interfaces';
import { Paths } from '@lib/constant/paths';
import { States } from '@lib/constant/states';
import useLocalState from '@lib/hooks/useLocalState';
import { IOrderCartItem } from '@lib/redux/order/orderSlice';
import { cn } from '@lib/utils/cn';
import { Toolbox } from '@lib/utils/toolbox';
import {
  cartItemIdxFn,
  hasProductInCartFn,
  hasProductInWishlistFn,
  hasProductVariationInCartFn,
  wishlistItemIdxFn,
} from '@modules/orders/lib/utils';
import { IProduct } from '@modules/products/lib/interfaces';
import { IReview } from '@modules/reviews/lib/interfaces';
import { Alert, Button, Col, Grid, message, Row, Space, Tabs, Tag, Typography } from 'antd';
import Image from 'next/image';
import React, { useMemo, useState } from 'react';
import { BsBasket2, BsFillBasket2Fill, BsHeart, BsHeartFill } from 'react-icons/bs';
import { FaCheckCircle } from 'react-icons/fa';
import { FcCancel } from 'react-icons/fc';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { Navigation, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import ProductViewReviews from './ProductViewReviews';
import ProductViewVariations from './ProductViewVariations';

interface IProps {
  className?: string;
  product: IProduct;
  reviews: IReview[];
  reviewsMeta: IMetaResponse;
}

const ProductViewSection: React.FC<IProps> = ({ className, product, reviews, reviewsMeta }) => {
  const [messageApi, messageHolder] = message.useMessage();
  const screens = Grid.useBreakpoint();
  const [order, setOrder] = useLocalState(States.order);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [variationModalOpen, setVariationModalOpen] = useState(false);

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
      setVariationModalOpen(true);
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

    setVariationModalOpen(false);
  };

  const isFavorite = hasProductInWishlistFn(product.id, order?.wishlist || []);
  const isCart = product?.variations?.length <= 1 ? hasProductInCartFn(product.id, order?.cart || []) : false;

  return (
    <section className={cn('product_view_section', className)}>
      {messageHolder}
      <div className="container">
        <Breadcrumb items={[{ name: product?.name, slug: Paths.products.toSlug(product?.slug) }]} />
        <Row gutter={[16, 16]} className="mt-4">
          <Col xs={24} lg={12}>
            <div className="space-y-4">
              <div className="slider_wrapper border rounded-2xl">
                <div className="slider_controller">
                  <div className="slider_prev_btn">
                    <IoIosArrowBack size={screens.md ? 32 : 24} />
                  </div>
                  <div className="slider_next_btn">
                    <IoIosArrowForward size={screens.md ? 32 : 24} />
                  </div>
                </div>
                <Swiper
                  spaceBetween={10}
                  thumbs={{ swiper: thumbsSwiper }}
                  modules={[Navigation, Thumbs]}
                  navigation={{
                    enabled: true,
                    prevEl: '.slider_prev_btn',
                    nextEl: '.slider_next_btn',
                    disabledClass: 'slider_disabled_btn',
                  }}
                >
                  {product?.images?.map((image, idx) => (
                    <SwiperSlide key={idx}>
                      <Image
                        width={500}
                        height={500}
                        src={image.url}
                        alt={product.name}
                        className="w-full h-auto object-cover"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={4}
                watchSlidesProgress={true}
                modules={[Navigation, Thumbs]}
                className="[&_.swiper-slide]:opacity-70 [&_.swiper-slide.swiper-slide-thumb-active]:opacity-100 [&_.swiper-wrapper]:items-center"
              >
                {product?.images?.map((image, idx) => (
                  <SwiperSlide key={idx}>
                    <Image
                      width={500}
                      height={500}
                      src={image.url}
                      alt={product.name}
                      className="w-full h-auto object-cover border rounded-2xl cursor-pointer"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </Col>
          <Col xs={24} lg={12}>
            <Typography.Title level={screens.md ? 3 : 4} style={{ margin: 0 }}>
              {product.name}
            </Typography.Title>
            <Space wrap className="mt-4">
              <Tag color="var(--color-primary)" style={{ marginRight: 0 }}>
                {product.supplier?.name}
              </Tag>
              {product.dosage_form?.name && (
                <Tag color="var(--color-secondary)" style={{ marginRight: 0 }}>
                  {product.dosage_form.name}
                </Tag>
              )}
              {product.generic?.name && (
                <Tag color="blue" style={{ marginRight: 0 }}>
                  {product.generic.name}
                </Tag>
              )}
            </Space>
            <div className="mt-4">
              <Typography.Text strong>Price:</Typography.Text>
              <div className="mt-1 flex items-baseline gap-2">
                {product?.['has_sale_discount_price'] ? (
                  <React.Fragment>
                    <Typography.Text strong>{priceInfo.special}</Typography.Text>
                    <Typography.Text delete className="text-md text-gray-500">
                      {priceInfo.regular}
                    </Typography.Text>
                  </React.Fragment>
                ) : (
                  <Typography.Text strong>{priceInfo.regular}</Typography.Text>
                )}
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              {product.quantity ? (
                <React.Fragment>
                  <span className="text-green-500 flex items-center gap-1">
                    <FaCheckCircle />
                    <Typography.Text strong>In Stock</Typography.Text>
                  </span>
                </React.Fragment>
              ) : (
                <span className="text-red-500 flex items-center gap-1">
                  <FcCancel size={20} />
                  <Typography.Text strong>Out of Stock</Typography.Text>
                </span>
              )}
            </div>
            <Row gutter={[8, 8]} className="mt-4">
              <Col xs={12}>
                <Typography.Text strong>Type: </Typography.Text>
                <Typography.Text>{Toolbox.toPrettyText(product.medicine_type) || 'N/A'}</Typography.Text>
              </Col>
              <Col xs={24}>
                <Typography.Text strong>Categories: </Typography.Text>
                <Space wrap>
                  {product?.categories?.map((c) => (
                    <Tag key={c.id} color="geekblue">
                      {c.category?.name}
                    </Tag>
                  ))}
                </Space>
              </Col>
            </Row>
            <div className="mt-8 flex gap-2 flex-wrap">
              <Button
                type="primary"
                size={screens.md ? 'large' : 'middle'}
                icon={
                  isCart ? <BsFillBasket2Fill size={20} className="mt-1" /> : <BsBasket2 size={20} className="mt-1" />
                }
                disabled={!product.quantity}
                onClick={() => handleAddToCartFn(product)}
              >
                Add to Cart
              </Button>
              <Button
                type="primary"
                size={screens.md ? 'large' : 'middle'}
                ghost
                icon={isFavorite ? <BsHeartFill size={20} className="mt-1" /> : <BsHeart size={20} className="mt-1" />}
                onClick={() => addToWishlistFn(product)}
              >
                Add to Wishlist
              </Button>
            </div>
          </Col>
          <Col xs={24}>
            <Tabs
              defaultActiveKey="description"
              items={[
                {
                  key: 'description',
                  label: 'Description',
                  children: product?.description ? (
                    <div className="prose" dangerouslySetInnerHTML={{ __html: product.description }} />
                  ) : (
                    <Alert type="info" message="No description available" showIcon />
                  ),
                },
                {
                  key: 'reviews',
                  label: 'Reviews',
                  children: <ProductViewReviews productId={product?.id} reviews={reviews} reviewsMeta={reviewsMeta} />,
                },
              ]}
            />
          </Col>
        </Row>
      </div>
      <BaseModalWithoutClicker
        destroyOnHidden
        width={540}
        title={`Variations (${product?.name})`}
        footer={null}
        open={variationModalOpen}
        onCancel={() => setVariationModalOpen(null)}
      >
        <ProductViewVariations product={product} onAddToCart={handleAddToCartWithVariationFn} />
      </BaseModalWithoutClicker>
    </section>
  );
};

export default ProductViewSection;
