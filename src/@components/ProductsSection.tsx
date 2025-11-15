import SectionIntro from '@base/components/SectionIntro';
import { IMetaResponse } from '@base/interfaces';
import { cn } from '@lib/utils/cn';
import { Toolbox } from '@lib/utils/toolbox';
import { IProduct } from '@modules/products/lib/interfaces';
import { Col, Pagination, Row } from 'antd';
import { useRouter } from 'next/router';
import React from 'react';
import ProductCard from './ProductCard';

interface IProps {
  className?: string;
  showForProductsPage?: boolean;
  products: IProduct[];
  meta?: IMetaResponse;
}

const ProductsSection: React.FC<IProps> = ({ className, showForProductsPage = false, products, meta }) => {
  const router = useRouter();

  return (
    <section className={cn('products_section', className)}>
      <div className="container">
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
          {products.map((product) => (
            <Col key={product.id} xs={24} md={12} lg={8} xl={6}>
              <ProductCard product={product} />
            </Col>
          ))}
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
      <style jsx global>{`
        .products_section_pagination {
          width: fit-content;
          margin-inline: auto;
          margin-top: 3rem;
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
