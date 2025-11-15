import SectionIntro from '@base/components/SectionIntro';
import { cn } from '@lib/utils/cn';
import { IProduct } from '@modules/products/lib/interfaces';
import { Col, Row } from 'antd';
import React from 'react';
import ProductCard from './ProductCard';

interface IProps {
  className?: string;
  products: IProduct[];
}

const ProductsSection: React.FC<IProps> = ({ className, products }) => {
  return (
    <section className={cn('products_section', className)}>
      <div className="container">
        <SectionIntro
          title={
            <>
              Most <span>Popular</span> Products
            </>
          }
          description="Discover our most popular products loved by customers"
          className="mb-8 lg:mb-16 text-center"
        />
        <Row gutter={[16, 16]} justify="center">
          {products.map((product) => (
            <Col key={product.id} xs={24} md={12} lg={8} xl={6}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default ProductsSection;
