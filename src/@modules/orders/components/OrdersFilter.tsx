import FloatRangePicker from '@base/antd/components/FloatRangePicker';
import FloatSelect from '@base/antd/components/FloatSelect';
import InfiniteScrollSelect from '@base/components/InfiniteScrollSelect';
import { Toolbox } from '@lib/utils/toolbox';
import { DeliveryZonesHooks } from '@modules/delivery-zones/lib/hooks';
import { IDeliveryZone } from '@modules/delivery-zones/lib/interfaces';
import { PaymentMethodsHooks } from '@modules/payment-methods/lib/hooks';
import { IPaymentMethod } from '@modules/payment-methods/lib/interfaces';
import { UsersHooks } from '@modules/users/lib/hooks';
import { IUser } from '@modules/users/lib/interfaces';
import { Button, Drawer, Form, Radio, Space } from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import { MdClear } from 'react-icons/md';
import { orderPaymentStatusTypes, orderStatusTypes } from '../lib/enums';
import { IOrdersFilter } from '../lib/interfaces';

interface IProps {
  initialValues: IOrdersFilter;
  onChange: (values: IOrdersFilter) => void;
}

const OrdersFilter: React.FC<IProps> = ({ initialValues, onChange }) => {
  const router = useRouter();
  const [formInstance] = Form.useForm();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [customerSearchTerm, setCustomerSearchTerm] = useState(null);
  const [paymentMethodSearchTerm, setPaymentMethodSearchTerm] = useState(null);
  const [deliveryZoneSearchTerm, setDeliveryZoneSearchTerm] = useState(null);

  const customerQuery = UsersHooks.useFindById({
    id: initialValues?.customer_id,
    config: {
      queryKey: [],
      enabled: !!initialValues?.customer_id,
    },
  });

  const customersQuery = UsersHooks.useFindInfinite({
    options: {
      limit: '20',
      search_term: customerSearchTerm,
      search_fields: ['name', 'phone', 'email'],
    },
  });

  const paymentMethodQuery = PaymentMethodsHooks.useFindById({
    id: initialValues?.payment_method_id,
    config: {
      queryKey: [],
      enabled: !!initialValues?.payment_method_id,
    },
  });

  const paymentMethodsQuery = PaymentMethodsHooks.useFindInfinite({
    options: {
      limit: '20',
      search_term: paymentMethodSearchTerm,
      search_field: 'name',
    },
  });

  const deliveryZoneQuery = DeliveryZonesHooks.useFindById({
    id: initialValues?.delivery_zone_id,
    config: {
      queryKey: [],
      enabled: !!initialValues?.delivery_zone_id,
    },
  });

  const deliveryZonesQuery = DeliveryZonesHooks.useFindInfinite({
    options: {
      limit: '20',
      search_term: deliveryZoneSearchTerm,
      search_field: 'name',
    },
  });

  useEffect(() => {
    formInstance.resetFields();

    const values = {
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
          <Form.Item name="customer_id" className="!mb-0">
            <InfiniteScrollSelect<IUser>
              isFloat
              allowClear
              showSearch
              virtual={false}
              placeholder="Customer"
              initialOptions={customerQuery.data?.data?.id ? [customerQuery.data?.data] : []}
              option={({ item: customer }) => ({
                key: customer?.id,
                label: customer?.name,
                value: customer?.id,
              })}
              onChangeSearchTerm={setCustomerSearchTerm}
              query={customersQuery}
            />
          </Form.Item>
          <Form.Item name="payment_method_id" className="!mb-0">
            <InfiniteScrollSelect<IPaymentMethod>
              isFloat
              allowClear
              showSearch
              virtual={false}
              placeholder="Payment Method"
              initialOptions={paymentMethodQuery.data?.data?.id ? [paymentMethodQuery.data?.data] : []}
              option={({ item: paymentMethod }) => ({
                key: paymentMethod?.id,
                label: paymentMethod?.name,
                value: paymentMethod?.id,
              })}
              onChangeSearchTerm={setPaymentMethodSearchTerm}
              query={paymentMethodsQuery}
            />
          </Form.Item>
          <Form.Item name="delivery_zone_id" className="!mb-0">
            <InfiniteScrollSelect<IDeliveryZone>
              isFloat
              allowClear
              showSearch
              virtual={false}
              placeholder="Delivery Zone"
              initialOptions={deliveryZoneQuery.data?.data?.id ? [deliveryZoneQuery.data?.data] : []}
              option={({ item: deliveryZone }) => ({
                key: deliveryZone?.id,
                label: deliveryZone?.name,
                value: deliveryZone?.id,
              })}
              onChangeSearchTerm={setDeliveryZoneSearchTerm}
              query={deliveryZonesQuery}
            />
          </Form.Item>
          <Form.Item name="payment_status" className="!mb-0">
            <FloatSelect
              allowClear
              showSearch
              virtual={false}
              placeholder="Payment Status"
              filterOption={(input, option: any) => option.label.toLowerCase().includes(input.toLowerCase())}
              options={orderPaymentStatusTypes.map((orderPaymentStatusType) => ({
                key: orderPaymentStatusType,
                label: Toolbox.toPrettyText(orderPaymentStatusType),
                value: orderPaymentStatusType,
              }))}
            />
          </Form.Item>
          <Form.Item name="status" className="!mb-0">
            <FloatSelect
              allowClear
              showSearch
              virtual={false}
              placeholder="Status"
              filterOption={(input, option: any) => option.label.toLowerCase().includes(input.toLowerCase())}
              options={orderStatusTypes.map((orderStatusType) => ({
                key: orderStatusType,
                label: Toolbox.toPrettyText(orderStatusType),
                value: orderStatusType,
              }))}
            />
          </Form.Item>
          <Form.Item name="date_range" className="!mb-0">
            <FloatRangePicker placeholder={['Start Date', 'End Date']} className="w-full" />
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

export default OrdersFilter;
