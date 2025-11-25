import { IMetaResponse } from '@base/interfaces';
import { cn } from '@lib/utils/cn';
import { Toolbox } from '@lib/utils/toolbox';
import { ICategory } from '@modules/categories/lib/interfaces';
import { Col, Empty, Pagination, Row } from 'antd';
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
            categories.map((category) => (
              <Col key={category.id} xs={24} md={12} lg={8} xl={6}>
                <CategoryCard category={category} />
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
