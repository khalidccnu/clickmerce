import { IMetaResponse } from '@base/interfaces';
import { cn } from '@lib/utils/cn';
import { Toolbox } from '@lib/utils/toolbox';
import { ICategory } from '@modules/categories/lib/interfaces';
import { Col, Empty, Pagination, Row } from 'antd';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import React from 'react';
import CategoryCard from './CategoryCard';

interface IProps {
  className?: string;
  categories: ICategory[];
  meta?: IMetaResponse;
}

const CategoriesSection: React.FC<IProps> = ({ className, categories, meta }) => {
  const router = useRouter();

  return (
    <section className={cn('categories_section', className)}>
      <div className="container">
        <Row gutter={[16, 16]} justify="center">
          {Toolbox.isEmpty(categories) ? (
            <Col xs={24}>
              <Empty description="No categories found" />
            </Col>
          ) : (
            categories.map((category, idx) => (
              <Col key={category.id} xs={24} md={8} lg={6} xl={4}>
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
                  <CategoryCard category={category} />
                </motion.div>
              </Col>
            ))
          )}
        </Row>
        {meta && meta?.total > meta?.limit && (
          <Pagination
            className="categories_section_pagination"
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
        .categories_section_pagination {
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

export default CategoriesSection;
