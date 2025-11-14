import SectionIntro from '@base/components/SectionIntro';
import { cn } from '@lib/utils/cn';
import { IFeature } from '@modules/features/lib/interfaces';
import { Col, Row } from 'antd';
import React from 'react';
import WhyShopWithUsCard from './WhyShopWithUsCard';

interface IProps {
  className?: string;
  features: IFeature[];
}

const WhyShopWithUsSection: React.FC<IProps> = ({ className, features }) => {
  return (
    <section className={cn('why_shop_with_us_section', className)}>
      <div className="container">
        <SectionIntro
          titlePrefix="Why"
          title="Shop"
          titleSuffix="With Us"
          // subtitle="Experience quality, value, and service like never before"
          className="mb-8 lg:mb-16 text-center"
        />
        <Row gutter={[16, 16]} justify="center">
          {features.map((feature) => (
            <Col key={feature.id} xs={24} md={12} lg={8} xl={6}>
              <WhyShopWithUsCard feature={feature} className="h-full" />
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default WhyShopWithUsSection;
