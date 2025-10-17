import FloatSelect from '@base/antd/components/FloatSelect';
import { Toolbox } from '@lib/utils/toolbox';
import { Button, Col, Form, FormInstance, Row } from 'antd';
import React, { useEffect } from 'react';
import { orderStatusTypes } from '../lib/enums';
import { IOrderCreate } from '../lib/interfaces';

interface IProps {
  isLoading: boolean;
  form: FormInstance;
  initialValues: Partial<IOrderCreate>;
  onFinish: (values: IOrderCreate) => void;
}

const OrdersStatusForm: React.FC<IProps> = ({ isLoading, form, initialValues, onFinish }) => {
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
            name="status"
            rules={[
              {
                required: true,
                message: 'Status is required!',
              },
            ]}
            className="!mb-0"
          >
            <FloatSelect
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
        </Col>
        <Col xs={24}>
          <Form.Item className="text-right !mb-0">
            <Button loading={isLoading} type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default OrdersStatusForm;
