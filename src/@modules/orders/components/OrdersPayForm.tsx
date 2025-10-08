import FloatInputNumber from '@base/antd/components/FloatInputNumber';
import { Button, Col, Form, FormInstance, Row } from 'antd';
import React, { useEffect } from 'react';
import { IOrder, IOrderCreate } from '../lib/interfaces';

interface IProps {
  isLoading: boolean;
  form: FormInstance;
  initialValues: Partial<IOrder>;
  onFinish: (values: IOrderCreate) => void;
}

const OrdersPayForm: React.FC<IProps> = ({ isLoading, form, initialValues, onFinish }) => {
  const formValues = Form.useWatch([], form);
  const changeAmount =
    formValues?.pay_amount > initialValues?.due_amount ? formValues?.pay_amount - initialValues?.due_amount : 0;

  useEffect(() => {
    form.resetFields();
  }, [form, initialValues]);

  return (
    <Form autoComplete="off" size="large" layout="vertical" form={form} onFinish={onFinish}>
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Form.Item
            name="pay_amount"
            rules={[
              {
                required: true,
                message: 'Pay amount is required!',
              },
            ]}
            className="!mb-0"
          >
            <FloatInputNumber className="w-full" placeholder="Pay Amount" min={1} />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item className="!mb-0">
            <FloatInputNumber readOnly placeholder="Change Amount" className="w-full" value={changeAmount} />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item className="text-right !mb-0">
            <Button loading={isLoading} type="primary" htmlType="submit">
              Pay
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default OrdersPayForm;
