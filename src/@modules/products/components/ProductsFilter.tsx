import FloatRangePicker from '@base/antd/components/FloatRangePicker';
import InfiniteScrollSelect from '@base/components/InfiniteScrollSelect';
import { Toolbox } from '@lib/utils/toolbox';
import { DosageFormsHooks } from '@modules/dosage-forms/lib/hooks';
import { IDosageForm } from '@modules/dosage-forms/lib/interfaces';
import { GenericsHooks } from '@modules/generics/lib/hooks';
import { IGeneric } from '@modules/generics/lib/interfaces';
import { SuppliersHooks } from '@modules/suppliers/lib/hooks';
import { ISupplier } from '@modules/suppliers/lib/interfaces';
import { Button, Drawer, Form, Radio, Space } from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import { MdClear } from 'react-icons/md';
import { productsTypes } from '../lib/enums';
import { IProductsFilter } from '../lib/interfaces';

interface IProps {
  initialValues: IProductsFilter;
  onChange: (values: IProductsFilter) => void;
}

const ProductsFilter: React.FC<IProps> = ({ initialValues, onChange }) => {
  const router = useRouter();
  const [formInstance] = Form.useForm();
  const formValues = Form.useWatch([], formInstance);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [dosageFormSearchTerm, setDosageFormSearchTerm] = useState(null);
  const [genericSearchTerm, setGenericSearchTerm] = useState(null);
  const [supplierSearchTerm, setSupplierSearchTerm] = useState(null);

  const dosageFormQuery = DosageFormsHooks.useFindById({
    id: formValues?.dosage_form_id,
    config: {
      queryKey: [],
      enabled: isDrawerOpen && !!formValues?.dosage_form_id,
    },
  });

  const dosageFormsQuery = DosageFormsHooks.useFindInfinite({
    config: {
      queryKey: [],
      enabled: isDrawerOpen,
    },
    options: {
      limit: '20',
      search_term: dosageFormSearchTerm,
    },
  });

  const genericQuery = GenericsHooks.useFindById({
    id: formValues?.generic_id,
    config: {
      queryKey: [],
      enabled: isDrawerOpen && !!formValues?.generic_id,
    },
  });

  const genericsQuery = GenericsHooks.useFindInfinite({
    config: {
      queryKey: [],
      enabled: isDrawerOpen,
    },
    options: {
      limit: '20',
      search_term: genericSearchTerm,
    },
  });

  const supplierQuery = SuppliersHooks.useFindById({
    id: formValues?.supplier_id,
    config: {
      queryKey: [],
      enabled: isDrawerOpen && !!formValues?.supplier_id,
    },
  });

  const suppliersQuery = SuppliersHooks.useFindInfinite({
    config: {
      queryKey: [],
      enabled: isDrawerOpen,
    },
    options: {
      limit: '20',
      search_term: supplierSearchTerm,
    },
  });

  useEffect(() => {
    formInstance.resetFields();

    const values = {
      type: '',
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
          <Form.Item name="type" className="!mb-0">
            <Radio.Group buttonStyle="solid" className="w-full text-center">
              <Radio.Button key={0} className="w-1/3" value="">
                All
              </Radio.Button>
              {...productsTypes.map((elem, idx) => (
                <Radio.Button key={idx} className="w-1/3" value={elem}>
                  {Toolbox.toPrettyText(elem)}
                </Radio.Button>
              ))}
            </Radio.Group>
          </Form.Item>
          <Form.Item name="dosage_form_id" className="!mb-0">
            <InfiniteScrollSelect<IDosageForm>
              isFloat
              allowClear
              showSearch
              virtual={false}
              placeholder="Dosage Form"
              initialOptions={dosageFormQuery.data?.data?.id ? [dosageFormQuery.data?.data] : []}
              option={({ item: dosageForm }) => ({
                key: dosageForm?.id,
                label: dosageForm?.name,
                value: dosageForm?.id,
              })}
              onChangeSearchTerm={setDosageFormSearchTerm}
              query={dosageFormsQuery}
            />
          </Form.Item>
          <Form.Item name="generic_id" className="!mb-0">
            <InfiniteScrollSelect<IGeneric>
              isFloat
              allowClear
              showSearch
              virtual={false}
              placeholder="Generic"
              initialOptions={genericQuery.data?.data?.id ? [genericQuery.data?.data] : []}
              option={({ item: generic }) => ({
                key: generic?.id,
                label: generic?.name,
                value: generic?.id,
              })}
              onChangeSearchTerm={setGenericSearchTerm}
              query={genericsQuery}
            />
          </Form.Item>
          <Form.Item name="supplier_id" className="!mb-0">
            <InfiniteScrollSelect<ISupplier>
              isFloat
              allowClear
              showSearch
              virtual={false}
              placeholder="Supplier"
              initialOptions={supplierQuery.data?.data?.id ? [supplierQuery.data?.data] : []}
              option={({ item: supplier }) => ({
                key: supplier?.id,
                label: supplier?.name,
                value: supplier?.id,
              })}
              onChangeSearchTerm={setSupplierSearchTerm}
              query={suppliersQuery}
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

export default ProductsFilter;
