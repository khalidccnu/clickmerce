import { ShoppingCartOutlined } from '@ant-design/icons';
import { Paths } from '@lib/constant/paths';
import { States } from '@lib/constant/states';
import useLocalState from '@lib/hooks/useLocalState';
import { cn } from '@lib/utils/cn';
import { ProductsWebHooks } from '@modules/products/lib/webHooks';
import { Button, Empty, message, Spin } from 'antd';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import ProductsSection from './ProductsSection';

interface IProps {
  className?: string;
}

const WishlistSection: React.FC<IProps> = ({ className }) => {
  const router = useRouter();
  const [messageApi, messageHolder] = message.useMessage();
  const [order] = useLocalState(States.order);

  const productsBulkQuery = ProductsWebHooks.useFindBulk({
    config: {
      onSuccess: (res) => {
        if (!res.success) {
          messageApi.error(res.message);
          return;
        }
      },
    },
  });

  useEffect(() => {
    if (order?.wishlist) productsBulkQuery.mutate(order.wishlist.map((w) => w.productId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?.wishlist?.length]);

  return (
    <section className={cn('wishlist_section', className)}>
      {messageHolder}
      <div className="container">
        {productsBulkQuery.isPending || !productsBulkQuery.isSuccess ? (
          <div className="flex justify-center py-8">
            <Spin />
          </div>
        ) : order?.wishlist?.length ? (
          <ProductsSection showForProductsPage products={productsBulkQuery.data?.data || []} />
        ) : (
          <Empty
            image={<ShoppingCartOutlined style={{ fontSize: 86, color: 'var(--color-primary)' }} />}
            description={
              <div className="flex flex-col items-center gap-1">
                <span className="text-gray-800 text-lg font-semibold">Your wishlist is empty</span>
                <span className="text-gray-500 text-base">Save products you love and find them easily later</span>
              </div>
            }
          >
            <Button type="primary" onClick={() => router.push(Paths.products.root)}>
              Browse Products
            </Button>
          </Empty>
        )}
      </div>
    </section>
  );
};

export default WishlistSection;
