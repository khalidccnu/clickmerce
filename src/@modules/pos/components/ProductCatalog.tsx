import BaseStateSearch from '@base/components/BaseStateSearch';
import InfiniteScroll from '@base/components/InfiniteScroll';
import { Dayjs } from '@lib/constant/dayjs';
import { States } from '@lib/constant/states';
import useResize from '@lib/hooks/useResize';
import useSessionState from '@lib/hooks/useSessionState';
import { cn } from '@lib/utils/cn';
import { AuthHooks } from '@modules/auth/lib/hooks';
import { useAuthSession } from '@modules/auth/lib/utils/client';
import { ProductsHooks } from '@modules/products/lib/hooks';
import { IProduct } from '@modules/products/lib/interfaces';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import ProductCatalogCard from './ProductCatalogCard';

interface IProps {
  className?: string;
}

const ProductCatalog: React.FC<IProps> = ({ className }) => {
  const { isAuthenticate } = useAuthSession();
  const [headerHeight] = useSessionState(States.headerHeight);
  const { elemRef: productCatalogHeaderRef, height: productCatalogHeaderHeight } = useResize<HTMLDivElement>();
  const productsSearchRef = useRef(null);
  const [productsSearchTerm, setProductsSearchTerm] = useState(null);
  const [focusedProductIdx, setFocusedProductIdx] = useState(null);
  const [products, setProducts] = useState([]);

  const handleProductNavigation = (event: React.KeyboardEvent<HTMLInputElement>) => {
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
          const quantity = product?.quantity;

          if (quantity) {
            productsSearchRef.current.clearSearch();
          }
        }
        break;
      default:
        break;
    }
  };

  const profileQuery = AuthHooks.useProfile({
    config: {
      queryKey: [],
      enabled: isAuthenticate,
    },
  });

  const productsQuery = ProductsHooks.useFindInfinite({
    options: {
      limit: '20',
      search_term: productsSearchTerm,
      is_active: 'true',
      search_field: 'name',
    },
  });

  return (
    <div className={cn('product_catalog space-y-8', className)}>
      <div
        className="product_catalog_header flex flex-col md:flex-row md:items-center justify-between gap-4"
        ref={productCatalogHeaderRef}
      >
        <div className="space-y-1">
          <p className="text-lg font-semibold dark:text-white">Welcome, {profileQuery.data?.data?.name}</p>
          <p className="text-gray-500 dark:text-gray-200">{dayjs().format(Dayjs.monthDateYear)}</p>
        </div>
        <BaseStateSearch
          allowClear
          autoComplete="off"
          ref={productsSearchRef}
          onSearch={setProductsSearchTerm}
          addonBefore={<FaSearch size={16} />}
          onKeyDown={handleProductNavigation}
        />
      </div>
      <div
        className="product_catalog_wrapper"
        style={{ height: `calc(100vh - ${productCatalogHeaderHeight + headerHeight + 64}px)` }}
      >
        <InfiniteScroll<IProduct>
          query={productsQuery}
          onChangeItems={(products) => setProducts(products)}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 pr-4"
          emptyItemsPlaceholder="No products available"
        >
          {({ idx, item: product }) => {
            const isFocused = focusedProductIdx === idx;

            return <ProductCatalogCard isFocused={isFocused} product={product} className="h-full" />;
          }}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default ProductCatalog;
