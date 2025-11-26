import SectionIntro from '@base/components/SectionIntro';
import { cn } from '@lib/utils/cn';
import { IFeature } from '@modules/features/lib/interfaces';
import { Col, Row } from 'antd';
import { motion } from 'framer-motion';
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
          title={
            <>
              Why <span>Shop</span> With Us
            </>
          }
          description="Experience quality, value, and service like never before"
          className="mb-8 lg:mb-16 text-center"
        />
        <Row gutter={[16, 16]} justify="center">
          {features.map((feature, idx) => (
            <Col key={feature.id} xs={24} md={12} lg={8} xl={6}>
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
                <WhyShopWithUsCard feature={feature} className="h-full" />
              </motion.div>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default WhyShopWithUsSection;
