import FloatInputNumber from '@base/antd/components/FloatInputNumber';
import FloatSelect from '@base/antd/components/FloatSelect';
import { Toolbox } from '@lib/utils/toolbox';
import { productDiscountTypes, TProductDiscountType } from '@modules/products/lib/enums';
import { Button, Col, Form, FormInstance, Row } from 'antd';
import React, { useEffect } from 'react';

interface IOrderSummaryDiscountProps {
  type: TProductDiscountType;
  amount: number;
}

interface IProps {
  isLoading: boolean;
  form: FormInstance;
  formType?: 'create' | 'update';
  initialValues?: Partial<IOrderSummaryDiscountProps>;
  onFinish: (values: IOrderSummaryDiscountProps) => void;
}

const OrderSummaryDiscountForm: React.FC<IProps> = ({
  isLoading,
  form,
  formType = 'create',
  initialValues,
  onFinish,
}) => {
  useEffect(() => {
    form.resetFields();
  }, [form, initialValues]);

  return (
    <Form
      autoComplete="off"
      size="large"
      layout="vertical"
      form={form}
      initialValues={initialValues}
      onFinish={onFinish}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Form.Item
            name="type"
            rules={[
              {
                required: true,
                message: 'Type is required!',
              },
            ]}
            className="!mb-0"
          >
            <FloatSelect
              allowClear
              showSearch
              virtual={false}
              placeholder="Type"
              filterOption={(input, option) => Toolbox.toLowerText(option?.title)?.includes(Toolbox.toLowerText(input))}
              options={productDiscountTypes.map((type) => ({
                title: Toolbox.toPrettyText(type),
                label: Toolbox.toPrettyText(type),
                value: type,
              }))}
            />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item
            name="amount"
            rules={[
              {
                required: true,
                message: 'Amount is required!',
              },
            ]}
            className="!mb-0"
          >
            <FloatInputNumber placeholder="Amount" className="w-full" />
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

export default OrderSummaryDiscountForm;
