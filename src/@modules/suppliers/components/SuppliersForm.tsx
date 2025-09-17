import FloatInput from '@base/antd/components/FloatInput';
import FloatTextarea from '@base/antd/components/FloatTextarea';
import InputPhone from '@base/components/InputPhone';
import { Button, Col, Form, FormInstance, Radio, Row } from 'antd';
import React, { useEffect } from 'react';
import { ISupplierCreate } from '../lib/interfaces';

interface IProps {
  isLoading: boolean;
  form: FormInstance;
  formType?: 'create' | 'update';
  initialValues?: Partial<ISupplierCreate>;
  onFinish: (values: ISupplierCreate) => void;
}

const SuppliersForm: React.FC<IProps> = ({ isLoading, form, formType = 'create', initialValues, onFinish }) => {
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
            name="name"
            rules={[
              {
                required: true,
                message: 'Name is required!',
              },
            ]}
            className="!mb-0"
          >
            <FloatInput placeholder="Name" />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item name="phone" className="!mb-0">
            <InputPhone size="large" />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item
            name="email"
            rules={[
              {
                type: 'email',
                message: 'Email is not valid!',
              },
            ]}
            className="!mb-0"
          >
            <FloatInput placeholder="Email" />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item name="address" className="!mb-0">
            <FloatTextarea placeholder="Address" autoSize={{ maxRows: 3 }} />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item name="is_active" className="!mb-0">
            <Radio.Group buttonStyle="solid" className="w-full text-center">
              <Radio.Button className="w-1/2" value="true">
                Active
              </Radio.Button>
              <Radio.Button className="w-1/2" value="false">
                Inactive
              </Radio.Button>
            </Radio.Group>
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

export default SuppliersForm;
