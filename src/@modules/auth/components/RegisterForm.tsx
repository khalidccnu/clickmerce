import FloatInput from '@base/antd/components/FloatInput';
import FloatInputPassword from '@base/antd/components/FloatInputPassword';
import InputPhone from '@base/components/InputPhone';
import { IUserCreate } from '@modules/users/lib/interfaces';
import { Button, Col, Form, FormInstance, Row } from 'antd';
import React, { useEffect } from 'react';
interface IProps {
  isLoading: boolean;
  form: FormInstance;
  initialValues?: Partial<IUserCreate>;
  onFinish: (values: IUserCreate) => void;
}

const RegisterForm: React.FC<IProps> = ({ isLoading, form, initialValues, onFinish }) => {
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
        <Col xs={24} md={12}>
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
            <FloatInput placeholder="Name" required />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Password is required!',
              },
              {
                min: 8,
                message: 'Password must be at least 8 characters long!',
              },
            ]}
            className="!mb-0"
          >
            <FloatInputPassword placeholder="Password" required />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item
            name="phone"
            rules={[
              {
                required: true,
                message: 'Phone number is required!',
              },
            ]}
            className="!mb-0"
          >
            <InputPhone size="large" />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item name="email" rules={[{ type: 'email', message: 'Email is not valid!' }]} className="!mb-0">
            <FloatInput placeholder="Email" />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item className="text-right !mb-0">
            <Button loading={isLoading} type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default RegisterForm;
