import FloatInput from '@base/antd/components/FloatInput';
import FloatSelect from '@base/antd/components/FloatSelect';
import FloatTextarea from '@base/antd/components/FloatTextarea';
import CountryCurrencySelect from '@base/components/CountryCurrencySelect';
import InputPhone from '@base/components/InputPhone';
import PhoneCodeSelect from '@base/components/PhoneCodeSelect';
import { Col, Form, FormInstance, Row, Select } from 'antd';
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
          <FloatInput placeholder="Name" required />
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
          <FloatInput placeholder="Initial Name" required />
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
            required
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
            required
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
      <Col xs={24} md={12}>
        <Form.Item name={['identity', 'phone']} className="!mb-0">
          <InputPhone size="large" />
        </Form.Item>
      </Col>
      <Col xs={24} md={12}>
        <Form.Item
          name={['identity', 'email']}
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
        <Form.Item name={['identity', 'address']} className="!mb-0">
          <FloatInput placeholder="Address" />
        </Form.Item>
      </Col>
      <Col xs={24} md={12}>
        <Form.Item
          name={['identity', 'fb_url']}
          rules={[
            {
              type: 'url',
              message: 'Facebook url must be a valid!',
            },
          ]}
          className="!mb-0"
        >
          <FloatInput placeholder="Facebook URL" />
        </Form.Item>
      </Col>
      <Col xs={24} md={12}>
        <Form.Item
          name={['identity', 'ig_url']}
          rules={[
            {
              type: 'url',
              message: 'Instagram url must be a valid!',
            },
          ]}
          className="!mb-0"
        >
          <FloatInput placeholder="Instagram URL" />
        </Form.Item>
      </Col>
      <Col xs={24}>
        <Form.Item
          name={['identity', 'yt_url']}
          rules={[
            {
              type: 'url',
              message: 'YouTube url must be a valid!',
            },
          ]}
          className="!mb-0"
        >
          <FloatInput placeholder="YouTube URL" />
        </Form.Item>
      </Col>
      <Col xs={24} md={12}>
        <Form.Item
          name={['identity', 'is_user_registration_acceptance']}
          rules={[
            {
              required: true,
              message: 'User acceptance is required!',
            },
          ]}
          className="!mb-0"
        >
          <FloatSelect
            allowClear
            showSearch
            virtual={false}
            placeholder="User Acceptance"
            filterOption={(input, option: any) => option.label.toLowerCase().includes(input.toLowerCase())}
          >
            <Select.Option value={true}>Accepted</Select.Option>
            <Select.Option value={false}>Not Accepted</Select.Option>
          </FloatSelect>
        </Form.Item>
      </Col>
      <Col xs={24} md={12}>
        <Form.Item
          name={['identity', 'need_user_registration_verification']}
          rules={[
            {
              required: true,
              message: 'User verification is required!',
            },
          ]}
          className="!mb-0"
        >
          <FloatSelect
            allowClear
            showSearch
            virtual={false}
            placeholder="User Verification"
            filterOption={(input, option: any) => option.label.toLowerCase().includes(input.toLowerCase())}
          >
            <Select.Option value={true}>Need</Select.Option>
            <Select.Option value={false}>No Need</Select.Option>
          </FloatSelect>
        </Form.Item>
      </Col>
    </Row>
  );
};

export default InitiateSettingsIdentityForm;
