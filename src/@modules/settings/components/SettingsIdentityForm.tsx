import { Env } from '.environments';
import FloatInput from '@base/antd/components/FloatInput';
import CountryCurrencySelect from '@base/components/CountryCurrencySelect';
import PhoneCodeSelect from '@base/components/PhoneCodeSelect';
import { Button, Col, Form, FormInstance, Row } from 'antd';
import React, { useEffect } from 'react';
import { ISettingsIdentity } from '../lib/interfaces';

interface IProps {
  isLoading: boolean;
  form: FormInstance;
  formType?: 'create' | 'update';
  initialValues?: Partial<ISettingsIdentity>;
  onFinish: (values: ISettingsIdentity) => void;
}

const SettingsIdentityForm: React.FC<IProps> = ({ isLoading, form, formType = 'create', initialValues, onFinish }) => {
  const formValues = Form.useWatch([], form);

  useEffect(() => {
    form.resetFields();

    if (formType === 'create') {
      form.setFieldValue(['identity', 'phone_code'], Env.webPhoneCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formType, form, initialValues]);

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
        <Col xs={24} md={12} xl={8}>
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
        <Col xs={24} md={12} xl={8}>
          <Form.Item
            name="initial_name"
            rules={[
              {
                required: true,
                message: 'Initial name is required!',
              },
              {
                pattern: /^[a-z0-9]+$/,
                message: 'Only lowercase characters and numbers are allowed!',
              },
            ]}
            className="!mb-0"
          >
            <FloatInput placeholder="Initial Name" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12} xl={8}>
          <Form.Item
            name="logo_url"
            rules={[
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();

                  const urlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|svg))$/i;
                  if (!urlPattern.test(value)) {
                    return Promise.reject(new Error('Please type a valid logo URL (e.g., png, jpg, jpeg, svg).'));
                  }

                  return Promise.resolve();
                },
              },
            ]}
            className="!mb-0"
          >
            <FloatInput placeholder="Logo URL" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12} xl={8}>
          <Form.Item
            name="phone_code"
            rules={[
              {
                required: true,
                message: 'Phone code is required!',
              },
            ]}
            className="!mb-0"
          >
            <PhoneCodeSelect
              isFloat
              showSearch
              code={formValues?.phone_code}
              onSelectCode={(code) => form.setFieldValue('phone_code', code)}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12} xl={8}>
          <Form.Item
            name="currency"
            rules={[
              {
                required: true,
                message: 'Currency is required!',
              },
            ]}
            className="!mb-0"
          >
            <CountryCurrencySelect
              isFloat
              showSearch
              currency={formValues?.currency}
              onSelectCurrency={(currency) => form.setFieldValue('currency', currency)}
            />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item className="text-right !mb-0">
            <Button loading={isLoading} type="primary" htmlType="submit">
              {formType === 'create' ? 'Create' : 'Update'}
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default SettingsIdentityForm;
