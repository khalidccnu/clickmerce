import { Toolbox } from '@lib/utils/toolbox';
import { Button, Radio, Select } from 'antd';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import { IProductsFilter } from '../lib/interfaces';
import ProductsFilterDrawer from './ProductsFilterDrawer';

interface IProps {
  initialValues: IProductsFilter;
  onChange: (values: IProductsFilter) => void;
}

const ProductsFilter: React.FC<IProps> = ({ initialValues, onChange }) => {
  const router = useRouter();
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex flex-wrap gap-3 justify-end mb-4">
      <Select
        allowClear
        showSearch
        virtual={false}
        placeholder="Sort By"
        value={initialValues?.sort_by}
        options={[
          { label: 'Name', value: 'name' },
          { label: 'Quantity', value: 'quantity' },
        ]}
        filterOption={(input, option: any) => Toolbox.toLowerText(option?.label)?.includes(Toolbox.toLowerText(input))}
        onChange={(value) =>
          router.push({
            query: Toolbox.toCleanObject({ ...router.query, sort_by: value }),
          })
        }
        style={{ width: '8rem' }}
      />
      <Radio.Group
        optionType="button"
        buttonStyle="solid"
        value={initialValues?.sort_order ?? ''}
        options={[
          { label: 'ASC', value: '' },
          { label: 'DESC', value: 'DESC' },
        ]}
        onChange={(e) =>
          router.push({
            query: Toolbox.toCleanObject({ ...router.query, sort_order: e?.target?.value }),
          })
        }
      />
      <Button type="primary" icon={<FaFilter />} onClick={() => setDrawerOpen(true)} ghost>
        Filter
      </Button>
      <ProductsFilterDrawer
        isOpen={isDrawerOpen}
        onChangeOpen={setDrawerOpen}
        initialValues={initialValues}
        onChange={onChange}
      />
    </div>
  );
};

export default ProductsFilter;
