import BaseModalWithoutClicker from '@base/components/BaseModalWithoutClicker';
import SectionIntro from '@base/components/SectionIntro';
import { IMetaResponse } from '@base/interfaces';
import { States } from '@lib/constant/states';
import { useAnalyticEvent } from '@lib/hooks/useAnalyticEvent';
import useLocalState from '@lib/hooks/useLocalState';
import { IOrderCartItem } from '@lib/redux/order/orderSlice';
import { cn } from '@lib/utils/cn';
import { Toolbox } from '@lib/utils/toolbox';
import {
  cartItemIdxFn,
  hasProductInCartFn,
  hasProductVariationInCartFn,
  wishlistItemIdxFn,
} from '@modules/orders/lib/utils';
import { IProduct } from '@modules/products/lib/interfaces';
import { Col, Empty, message, Pagination, Row } from 'antd';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import ProductCard from './ProductCard';
import ProductViewVariations from './ProductViewVariations';

interface IProps {
  className?: string;
  isContainerClass?: boolean;
  showForProductsPage?: boolean;
  products: IProduct[];
  meta?: IMetaResponse;
}

const ProductsSection: React.FC<IProps> = ({
  className,
  isContainerClass = true,
  showForProductsPage = false,
  products,
  meta,
}) => {
  const router = useRouter();
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
    <section className={cn('products_section', className)}>
      {messageHolder}
      <div className={cn(isContainerClass && 'container')}>
        {showForProductsPage || (
          <SectionIntro
            title={
              <>
                Most <span>Popular</span> Products
              </>
            }
            description="Discover our most popular products loved by customers"
            className="mb-8 lg:mb-16 text-center"
          />
        )}
        <Row gutter={[16, 16]} justify={showForProductsPage ? 'start' : 'center'}>
          {Toolbox.isEmpty(products) ? (
            <Col xs={24}>
              <Empty description="No products found" />
            </Col>
          ) : (
            products.map((product, idx) => (
              <Col key={product.id} xs={24} md={12} lg={8} xl={isContainerClass ? 6 : 8}>
                <motion.div
                  style={{ height: '100%' }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: idx <= 3 ? idx / 30 : ((idx - 3) % 10) / 30,
                  }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} onCartUpdate={handleAddToCartFn} onWishlistUpdate={addToWishlistFn} />
                </motion.div>
              </Col>
            ))
          )}
        </Row>
        {showForProductsPage && meta && meta?.total > meta?.limit && (
          <Pagination
            className="products_section_pagination"
            defaultCurrent={meta?.page}
            total={meta?.total}
            pageSize={meta?.limit}
            onChange={(page, limit) =>
              router.push({
                query: Toolbox.toCleanObject({ ...router.query, page, limit }),
              })
            }
          />
        )}
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
      <style jsx global>{`
        .products_section_pagination {
          width: fit-content;
          margin: 3rem auto 0 !important;
          a {
            color: var(--color-gray-700);
          }
          .ant-pagination-disabled {
            a {
              color: var(--color-gray-300);
            }
          }
          .ant-pagination-item {
            &.ant-pagination-item-active {
              color: var(--color-primary);
              border-color: var(--color-primary);
              a {
                color: inherit;
              }
            }
          }
        }
      `}</style>
    </section>
  );
};

export default ProductsSection;
