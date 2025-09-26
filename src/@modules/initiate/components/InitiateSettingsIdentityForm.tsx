import FloatInput from '@base/antd/components/FloatInput';
import CountryCurrencySelect from '@base/components/CountryCurrencySelect';
import PhoneCodeSelect from '@base/components/PhoneCodeSelect';
import { Col, Form, FormInstance, Row } from 'antd';
import React from 'react';

interface IProps {
  form: FormInstance;
}

const InitiateSettingsIdentityForm: React.FC<IProps> = ({ form }) => {
  const formValues = Form.useWatch([], form);

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={12}>
        <Form.Item
          name={['identity', 'name']}
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
      <Col xs={24} md={12}>
        <Form.Item
          name={['identity', 'initial_name']}
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
      <Col xs={24} md={12}>
        <Form.Item
          name={['identity', 'logo_url']}
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
      <Col xs={24} md={12}>
        <Form.Item
          name={['identity', 'phone_code']}
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
            code={formValues?.identity?.phone_code}
            onSelectCode={(code) => form.setFieldValue(['identity', 'phone_code'], code)}
          />
        </Form.Item>
      </Col>
      <Col xs={24} md={12}>
        <Form.Item
          name={['identity', 'currency']}
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
            currency={formValues?.identity?.currency}
            onSelectCurrency={(currency) => form.setFieldValue(['identity', 'currency'], currency)}
          />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default InitiateSettingsIdentityForm;
