import BaseStateSearch from '@base/components/BaseStateSearch';
import { Paths } from '@lib/constant/paths';
import { useAnalyticEvent } from '@lib/hooks/useAnalyticEvent';
import useTheme from '@lib/hooks/useTheme';
import { Toolbox } from '@lib/utils/toolbox';
import { ProductsHooks } from '@modules/products/lib/hooks';
import { Avatar, Dropdown, List, Spin } from 'antd';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

interface IProps {
  className?: string;
}

const ProductsSearchForm: React.FC<IProps> = ({ className }) => {
  const router = useRouter();
  const { isDark } = useTheme();
  const { sendEventFn } = useAnalyticEvent();
  const [searchTerm, setSearchTerm] = useState<string>(null);

  const handleSearchFn = (value: string) => {
    setSearchTerm(value);
    sendEventFn({
      name: 'search',
      data: {
        search_term: value,
      },
    });
  };

  const productsQuery = ProductsHooks.useFindByFuzzy({
    name: searchTerm,
    config: {
      queryKey: [],
      enabled: !!searchTerm,
    },
  });

  return (
    <div className={className}>
      <Dropdown
        open={!!searchTerm}
        trigger={['click']}
        placement="bottomLeft"
        popupRender={() => (
          <div
            style={{
              background: isDark ? '#141414' : '#fff',
              minWidth: 300,
              maxHeight: 380,
              borderRadius: 8,
              overflowY: 'auto',
              overscrollBehavior: 'contain',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            {productsQuery.isLoading ? (
              <div className="p-4 text-center">
                <Spin />
              </div>
            ) : productsQuery.data?.data?.length ? (
              <List
                itemLayout="horizontal"
                dataSource={productsQuery.data?.data}
                renderItem={(item) => (
                  <List.Item
                    key={item?.product?.id}
                    onClick={() => {
                      router.push(Paths.products.toSlug(item?.product?.slug));
                      setSearchTerm(null);
                    }}
                  >
                    <List.Item.Meta
                      style={{ paddingInline: 16, cursor: 'pointer' }}
                      avatar={
                        <Avatar
                          size={48}
                          shape="square"
                          src={
                            item?.product?.images?.[0]?.url ||
                            Toolbox.generateCharacterSvg({ character: item?.product?.name, type: 'url' })
                          }
                          alt={item?.product?.name}
                          className="mr-2"
                        />
                      }
                      title={<span className="font-medium line-clamp-1">{item?.product?.name}</span>}
                      description={
                        <div className="text-xs text-gray-500">
                          <span>{Toolbox.toPrettyText(item?.product?.type)}</span>
                          {item?.product?.specification && (
                            <span className="ml-1">| {item?.product?.specification}</span>
                          )}
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <div className="p-4 text-center text-sm text-gray-500">No matching products</div>
            )}
          </div>
        )}
      >
        <BaseStateSearch prefix={<FaSearch />} placeholder="Search products" allowClear onSearch={handleSearchFn} />
      </Dropdown>
    </div>
  );
};

export default ProductsSearchForm;
