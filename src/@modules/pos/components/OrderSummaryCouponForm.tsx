import InfiniteScrollSelect from '@base/components/InfiniteScrollSelect';
import { CouponsHooks } from '@modules/coupons/lib/hooks';
import { ICoupon } from '@modules/coupons/lib/interfaces';
import { Button, Col, Form, FormInstance, Row } from 'antd';
import React, { useEffect, useState } from 'react';

interface IProps {
  isLoading: boolean;
  form: FormInstance;
  formType?: 'create' | 'update';
  initialValues?: Partial<ICoupon>;
  onFinish: (values: { coupon: ICoupon }) => void;
}

const OrderSummaryCouponForm: React.FC<IProps> = ({
  isLoading,
  form,
  formType = 'create',
  initialValues,
  onFinish,
}) => {
  const [couponsSearchTerm, setCouponsSearchTerm] = useState(null);

  const couponQuery = CouponsHooks.useFindById({
    id: initialValues?.id,
    config: {
      queryKey: [],
      enabled: !!initialValues?.id,
    },
  });

  const couponsQuery = CouponsHooks.useFindInfinite({
    options: {
      limit: '20',
      search_term: couponsSearchTerm,
      search_field: 'code',
      is_valid: 'true',
      is_active: 'true',
    },
  });

  useEffect(() => {
    form.resetFields();
  }, [form, initialValues]);

  return (
    <Form
      autoComplete="off"
      size="large"
      layout="vertical"
      form={form}
      initialValues={{ coupon: initialValues }}
      onFinish={onFinish}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Form.Item
            name="coupon"
            rules={[
              {
                required: true,
                message: 'Code is required!',
              },
            ]}
            className="!mb-0"
          >
            <InfiniteScrollSelect<ICoupon>
              isFloat
              allowClear
              showSearch
              virtual={false}
              placeholder="Code"
              initialOptions={couponQuery.data?.data?.id ? [couponQuery.data?.data] : []}
              option={({ item: coupon }) => ({
                key: coupon?.id,
                label: coupon?.code,
                value: coupon?.id,
                data: coupon,
              })}
              onChange={(_, options: { data: ICoupon }) => {
                form.setFieldValue('coupon', options?.data);
              }}
              onChangeSearchTerm={setCouponsSearchTerm}
              query={couponsQuery}
            />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item className="text-right !mb-0">
            <Button loading={isLoading} type="primary" htmlType="submit">
              {formType === 'create' ? 'Submit' : 'Update'}
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default OrderSummaryCouponForm;
