import BaseModalWithoutClicker from '@base/components/BaseModalWithoutClicker';
import BaseStateSearch from '@base/components/BaseStateSearch';
import InfiniteScroll from '@base/components/InfiniteScroll';
import { Dayjs } from '@lib/constant/dayjs';
import { States } from '@lib/constant/states';
import useResize from '@lib/hooks/useResize';
import useSessionState from '@lib/hooks/useSessionState';
import { useAppDispatch, useAppSelector } from '@lib/redux/hooks';
import { addToCartFn } from '@lib/redux/order/orderSlice';
import { cn } from '@lib/utils/cn';
import { Toolbox } from '@lib/utils/toolbox';
import { AuthHooks } from '@modules/auth/lib/hooks';
import { useAuthSession } from '@modules/auth/lib/utils/client';
import { hasProductInCartFn, hasProductVariationInCartFn } from '@modules/orders/lib/utils';
import ProductsFilterDrawer from '@modules/products/components/ProductsFilterDrawer';
import { ProductsHooks } from '@modules/products/lib/hooks';
import { IProduct } from '@modules/products/lib/interfaces';
import { ProductsServices } from '@modules/products/lib/services';
import { Button, message } from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import BarcodeReader from 'react-barcode-reader';
import { FaSearch } from 'react-icons/fa';
import { IoFilterSharp } from 'react-icons/io5';
import ProductCatalogCard from './ProductCatalogCard';
import ProductCatalogVariations from './ProductCatalogVariations';

interface IProps {
  className?: string;
}

const ProductCatalog: React.FC<IProps> = ({ className }) => {
  const router = useRouter();
  const [messageApi, messageHolder] = message.useMessage();
  const { isAuthenticate } = useAuthSession();
  const [headerHeight] = useSessionState(States.adminHeaderHeight);
  const { elemRef: productCatalogHeaderRef, height: productCatalogHeaderHeight } = useResize<HTMLDivElement>();
  const productsSearchRef = useRef(null);
  const [productsSearchTerm, setProductsSearchTerm] = useState<string>(null);
  const [focusedProductIdx, setFocusedProductIdx] = useState<number>(null);
  const focusedProductRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [product, setProduct] = useState<IProduct>(null);
  const { cart } = useAppSelector((store) => store.orderSlice);
  const dispatch = useAppDispatch();
  const [isFilterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const handleProductNavigationFn = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!products.length || !productsSearchRef.current) return;

    const isTyping = event.key.length === 1;
    if (isTyping) return;

    switch (event.key) {
      case 'ArrowDown':
        setFocusedProductIdx((prev: number) => {
          if (prev === null) return 0;
          return prev < products.length - 1 ? prev + 1 : prev;
        });
        event.preventDefault();
        break;
      case 'ArrowUp':
        setFocusedProductIdx((prev: number) => {
          if (prev === null) return products.length - 1;
          return prev > 0 ? prev - 1 : prev;
        });
        event.preventDefault();
        break;
      case 'Enter':
        if (focusedProductIdx !== null) {
          const product = products[focusedProductIdx];
          handleAddToCartFn(product, true);
        }
        break;
      default:
        break;
    }
  };

  const handleAddToCartFn = (product: IProduct, clearSearch: boolean = false) => {
    const hasInCart = hasProductInCartFn(product.id, cart);

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

      dispatch(
        addToCartFn({
          item: {
            productId: product.id,
            productVariationId: variation.id,
            selectedQuantity: 1,
            discount: variation?.discount,
          },
        }),
      );

      if (clearSearch) productsSearchRef.current.clearSearch();
    } else {
      setProduct(product);
    }
  };

  const handleAddToCartWithVariationFn = (product: IProduct, productVariation: IProduct['variations'][number]) => {
    const hasInCart = hasProductVariationInCartFn(productVariation.id, cart);

    if (hasInCart) {
      messageApi.warning(` ${product?.name} is already in the cart!`);
      return;
    }

    if (!productVariation?.quantity) {
      messageApi.warning(`${product?.name} is out of stock!`);
      return;
    }

    dispatch(
      addToCartFn({
        item: {
          productId: product.id,
          productVariationId: productVariation.id,
          selectedQuantity: 1,
          discount: productVariation?.discount,
        },
      }),
    );

    setProduct(null);
  };

  const profileQuery = AuthHooks.useProfile({
    config: {
      queryKey: [],
      enabled: isAuthenticate,
    },
  });

  const productsQuery = ProductsHooks.useFindInfinite({
    options: {
      ...router.query,
      limit: '20',
      search_term: productsSearchTerm,
      is_active: 'true',
      search_field: 'name',
    },
  });

  useEffect(() => {
    if (focusedProductRef.current) {
      focusedProductRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [focusedProductIdx]);

  return (
    <React.Fragment>
      {messageHolder}
      <BarcodeReader
        preventDefault
        stopPropagation
        minLength={32}
        onScan={async (v: string) => {
          const productQuery = await ProductsServices.findById(v);

          if (productQuery.success) {
            handleAddToCartFn(productQuery.data);
          } else {
            messageApi.error(productQuery.message);
          }
        }}
      />
      <div className={cn('product_catalog space-y-8', className)}>
        <div
          className="product_catalog_header flex flex-col md:flex-row md:items-center justify-between gap-4"
          ref={productCatalogHeaderRef}
        >
          <div className="space-y-1">
            <p className="text-lg font-semibold dark:text-white">Welcome, {profileQuery.data?.data?.name}</p>
            <p className="text-gray-500 dark:text-gray-200">{dayjs().format(Dayjs.monthDateYear)}</p>
          </div>
          <div className="flex items-center gap-2">
            <BaseStateSearch
              allowClear
              ref={productsSearchRef}
              onSearch={setProductsSearchTerm}
              addonBefore={<FaSearch size={16} />}
              onKeyDown={handleProductNavigationFn}
              formProps={{ autoComplete: 'off', size: 'large', style: { width: '100%', maxWidth: 340 } }}
            />
            <Button
              type="dashed"
              size="large"
              icon={<IoFilterSharp />}
              onClick={() => setFilterDrawerOpen(true)}
              style={{ flexShrink: 0 }}
            />
          </div>
        </div>
        <div
          className="product_catalog_wrapper"
          style={{ height: `calc(100vh - ${productCatalogHeaderHeight + headerHeight + 64}px)` }}
        >
          <InfiniteScroll<IProduct>
            query={productsQuery}
            onChangeItems={(products) => setProducts(products)}
            className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 pr-4', {
              block: !products.length,
            })}
            emptyItemsPlaceholder="No products available"
          >
            {({ idx, item: product }) => {
              const isFocused = focusedProductIdx === idx;
              const hasInCart = hasProductInCartFn(product.id, cart);
              const isOutOfStock = !product.quantity;

              return (
                <ProductCatalogCard
                  ref={focusedProductIdx === idx ? focusedProductRef : null}
                  isFocused={isFocused}
                  hasInCart={hasInCart}
                  isOutOfStock={isOutOfStock}
                  product={product}
                  className="h-full"
                  onAddToCart={handleAddToCartFn}
                />
              );
            }}
          </InfiniteScroll>
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
        <ProductCatalogVariations product={product} onAddToCart={handleAddToCartWithVariationFn} />
      </BaseModalWithoutClicker>
      <ProductsFilterDrawer
        isOpen={isFilterDrawerOpen}
        onChangeOpen={setFilterDrawerOpen}
        isShowActiveFilter={false}
        initialValues={Toolbox.toCleanObject(router.query)}
        onChange={(values) => {
          router.push({
            query: Toolbox.toCleanObject({ ...router.query, ...values }),
          });
        }}
      />
    </React.Fragment>
  );
};

export default ProductCatalog;
