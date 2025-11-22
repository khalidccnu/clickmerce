import InfiniteScroll from '@base/components/InfiniteScroll';
import { TId } from '@base/interfaces';
import { Paths } from '@lib/constant/paths';
import { cn } from '@lib/utils/cn';
import { Toolbox } from '@lib/utils/toolbox';
import { CategoriesHooks } from '@modules/categories/lib/hooks';
import { ICategory } from '@modules/categories/lib/interfaces';
import { Grid, Radio, Tag } from 'antd';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

interface IProps {
  className?: string;
  style?: React.CSSProperties;
}

const ProductsFilter: React.FC<IProps> = ({ className, style }) => {
  const router = useRouter();
  const screens = Grid.useBreakpoint();
  const [isExtended, setExtended] = useState<boolean>(false);
  const [categoryId, setCategoryId] = useState<TId>(null);

  const categoriesQuery = CategoriesHooks.useFindInfinite({
    options: {
      limit: '10',
      is_active: 'true',
    },
  });

  return (
    <div className={cn('rounded-xl bg-white', className)} style={style}>
      <aside>
        <div
          className={cn('flex items-center justify-between gap-2 p-4 bg-gray-300/70 rounded-t-xl', {
            'rounded-b-xl': !isExtended && !screens.lg,
          })}
        >
          <p className="text-[var(--color-primary)] font-bold text-lg">Filters</p>
          {screens.lg || (
            <button
              onClick={() => setExtended((prev) => !prev)}
              className="text-sm text-[var(--color-primary)] underline"
            >
              {isExtended ? 'Show Less' : 'Show More'}
            </button>
          )}
        </div>
        <div
          className={cn(
            'transition-[max-height] duration-300',
            isExtended || screens.lg ? 'max-h-[1000px]' : 'max-h-0 overflow-hidden',
          )}
        >
          <div className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-base">Categories</p>
                <Tag color="blue" style={{ marginRight: 0 }}>
                  {categoriesQuery.data?.pages?.[0]?.meta?.total || 0}
                </Tag>
              </div>
              <Radio.Group style={{ width: '100%' }} value={categoryId}>
                <InfiniteScroll<ICategory>
                  query={categoriesQuery}
                  emptyItemsPlaceholder="No categories available"
                  style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 180 }}
                >
                  {({ item: category }) => {
                    return (
                      <Radio
                        value={category?.id}
                        onClick={() => {
                          const checked = categoryId && categoryId === category?.id;

                          if (checked) {
                            setCategoryId(null);
                          } else {
                            setCategoryId(category?.id);
                          }

                          router.push({
                            pathname: Paths.products.root,
                            query: Toolbox.toCleanObject({
                              ...router.query,
                              category_id: checked ? undefined : category?.id,
                            }),
                          });
                        }}
                      >
                        {category?.name}
                      </Radio>
                    );
                  }}
                </InfiniteScroll>
              </Radio.Group>
            </div>
            {/* <Divider style={{ marginBlock: 16 }} />
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-base">Price Range</p>
              </div>
              <Slider range defaultValue={[0, 100]} />
            </div> */}
            {/* <Divider style={{ marginBlock: 16 }} />
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold text-base">Sort</p>
            </div>
            <Radio.Group style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}>
              <Radio value="">Default</Radio>
              <Radio value={ENUM_SORT_ORDER_TYPES.ASC}>Price (Low {'>'} High)</Radio>
              <Radio value={ENUM_SORT_ORDER_TYPES.DESC}>Price (High {'>'} Low)</Radio>
            </Radio.Group>
          </div> */}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default ProductsFilter;
