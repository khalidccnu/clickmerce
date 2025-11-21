import FloatRangePicker from '@base/antd/components/FloatRangePicker';
import InfiniteScrollSelect from '@base/components/InfiniteScrollSelect';
import { Toolbox } from '@lib/utils/toolbox';
import { ProductsHooks } from '@modules/products/lib/hooks';
import { IProduct } from '@modules/products/lib/interfaces';
import { UsersHooks } from '@modules/users/lib/hooks';
import { IUser } from '@modules/users/lib/interfaces';
import { Button, Drawer, Form, Radio, Space } from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import { MdClear } from 'react-icons/md';
import { IReviewsFilter } from '../lib/interfaces';

interface IProps {
  initialValues: IReviewsFilter;
  onChange: (values: IReviewsFilter) => void;
}

const ReviewsFilter: React.FC<IProps> = ({ initialValues, onChange }) => {
  const router = useRouter();
  const [formInstance] = Form.useForm();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState(null);
  const [productSearchTerm, setProductSearchTerm] = useState(null);

  const userQuery = UsersHooks.useFindById({
    id: initialValues?.user_id,
    config: {
      queryKey: [],
      enabled: !!initialValues?.user_id,
    },
  });

  const usersQuery = UsersHooks.useFindInfinite({
    options: {
      limit: '20',
      search_term: userSearchTerm,
      search_fields: ['name', 'phone', 'email'],
    },
  });

  const productQuery = ProductsHooks.useFindById({
    id: initialValues?.product_id,
    config: {
      queryKey: [],
      enabled: !!initialValues?.product_id,
    },
  });

  const productsQuery = ProductsHooks.useFindInfinite({
    options: {
      limit: '20',
      search_term: productSearchTerm,
      search_field: 'name',
    },
  });

  useEffect(() => {
    formInstance.resetFields();

    const values = {
      is_active: '',
      sort_order: '',
      date_range: [],
      ...initialValues,
    };

    if (values?.start_date && values?.end_date) {
      values.date_range.push(dayjs(values.start_date));
      values.date_range.push(dayjs(values.end_date));

      delete values.start_date;
      delete values.end_date;
    }

    formInstance.setFieldsValue(values);
  }, [formInstance, initialValues]);

  return (
    <div className="flex flex-wrap gap-3 justify-end mb-4">
      <Button type="primary" icon={<FaFilter />} onClick={() => setDrawerOpen(true)} ghost>
        Filter
      </Button>
      <Drawer width={380} title="Filter" open={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
        <Form
          form={formInstance}
          onFinish={Toolbox.debounce((values) => {
            values.start_date = values?.date_range?.length
              ? dayjs(values?.date_range?.[0]).startOf('day').toISOString()
              : null;
            values.end_date = values?.date_range?.length
              ? dayjs(values?.date_range?.[1]).endOf('day').toISOString()
              : null;

            delete values.date_range;
            onChange(values);
            setDrawerOpen(false);
          }, 1000)}
          className="flex flex-col gap-3"
        >
          <Form.Item name="user_id" className="!mb-0">
            <InfiniteScrollSelect<IUser>
              isFloat
              allowClear
              showSearch
              virtual={false}
              placeholder="User"
              initialOptions={userQuery.data?.data?.id ? [userQuery.data?.data] : []}
              option={({ item: user }) => ({
                key: user?.id,
                label: user?.name,
                value: user?.id,
              })}
              onChangeSearchTerm={setUserSearchTerm}
              query={usersQuery}
            />
          </Form.Item>
          <Form.Item name="product_id" className="!mb-0">
            <InfiniteScrollSelect<IProduct>
              isFloat
              allowClear
              showSearch
              virtual={false}
              placeholder="Product"
              initialOptions={productQuery.data?.data?.id ? [productQuery.data?.data] : []}
              option={({ item: product }) => ({
                key: product?.id,
                label: product?.name,
                value: product?.id,
              })}
              onChangeSearchTerm={setProductSearchTerm}
              query={productsQuery}
            />
          </Form.Item>
          <Form.Item name="date_range" className="!mb-0">
            <FloatRangePicker placeholder={['Start Date', 'End Date']} className="w-full" />
          </Form.Item>
          <Form.Item name="is_active" className="!mb-0">
            <Radio.Group buttonStyle="solid" className="w-full text-center">
              <Radio.Button className="w-1/3" value="">
                All
              </Radio.Button>
              <Radio.Button className="w-1/3" value="true">
                Active
              </Radio.Button>
              <Radio.Button className="w-1/3" value="false">
                Inactive
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="sort_order" className="!mb-0">
            <Radio.Group buttonStyle="solid" className="w-full text-center">
              <Radio.Button className="w-1/2" value="">
                ASC
              </Radio.Button>
              <Radio.Button className="w-1/2" value="DESC">
                DESC
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item className="!mb-0">
            <Space.Compact>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
              <Button
                type="primary"
                icon={<MdClear />}
                onClick={() => {
                  setDrawerOpen(false);
                  formInstance.resetFields();

                  router.push({
                    query: Toolbox.toCleanObject({
                      ...router.query,
                      ...formInstance.getFieldsValue(),
                      start_date: null,
                      end_date: null,
                    }),
                  });
                }}
                danger
                ghost
              >
                Clear
              </Button>
            </Space.Compact>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default ReviewsFilter;
