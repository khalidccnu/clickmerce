import FloatInput from '@base/antd/components/FloatInput';
import FloatTextarea from '@base/antd/components/FloatTextarea';
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
          name={['identity', 'icon_url']}
          rules={[
            {
              type: 'url',
              message: 'Icon url must be a valid!',
            },
          ]}
          className="!mb-0"
        >
          <FloatInput placeholder="Icon URL" />
        </Form.Item>
      </Col>
      <Col xs={24} md={12}>
        <Form.Item
          name={['identity', 'logo_url']}
          rules={[
            {
              type: 'url',
              message: 'Logo url must be a valid!',
            },
          ]}
          className="!mb-0"
        >
          <FloatInput placeholder="Logo URL" />
        </Form.Item>
      </Col>
      <Col xs={24}>
        <Form.Item
          name={['identity', 'social_image_url']}
          rules={[
            {
              type: 'url',
              message: 'Social image url must be a valid!',
            },
          ]}
          className="!mb-0"
        >
          <FloatInput placeholder="Social Image URL" />
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
      <Col xs={24}>
        <Form.Item name={['identity', 'description']} className="!mb-0">
          <FloatTextarea placeholder="Description" autoSize={{ minRows: 1, maxRows: 3 }} />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default InitiateSettingsIdentityForm;
