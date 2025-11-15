import SectionIntro from '@base/components/SectionIntro';
import { TId } from '@base/interfaces';
import { cn } from '@lib/utils/cn';
import { ProductsWebHooks } from '@modules/products/lib/webHooks';
import { Col, Row, Skeleton } from 'antd';
import React from 'react';
import ProductCard from './ProductCard';

interface IProps {
  className?: string;
  categoryId: TId;
}

const RelatedProductsSection: React.FC<IProps> = ({ className, categoryId }) => {
  const productsQuery = ProductsWebHooks.useFind({
    options: {
      page: '1',
      limit: '12',
      category_id: categoryId,
    },
  });

  return (
    <section className={cn('products_section', className)}>
      <div className="container">
        <SectionIntro
          title={
            <>
              <span>Related</span> Products
            </>
          }
          description="Discover our range of related products carefully selected to complement your needs"
          className="mb-8 lg:mb-16"
        />
        <Row gutter={[16, 16]}>
          {productsQuery.isLoading
            ? [...Array(4)].map((_, idx) => (
                <Col key={idx} xs={24} md={12} lg={8} xl={6}>
                  <Skeleton active paragraph={{ rows: 4 }} />
                </Col>
              ))
            : productsQuery.data?.data?.map((product) => (
                <Col key={product.id} xs={24} md={12} lg={8} xl={6}>
                  <ProductCard product={product} />
                </Col>
              ))}
        </Row>
      </div>
    </section>
  );
};

export default RelatedProductsSection;
