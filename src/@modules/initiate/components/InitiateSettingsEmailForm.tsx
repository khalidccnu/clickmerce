import FloatInput from '@base/antd/components/FloatInput';
import FloatInputNumber from '@base/antd/components/FloatInputNumber';
import FloatInputPassword from '@base/antd/components/FloatInputPassword';
import FloatSelect from '@base/antd/components/FloatSelect';
import { Toolbox } from '@lib/utils/toolbox';
import { ENUM_SETTINGS_EMAIL_PROVIDER_TYPES, settingsEmailProviderTypes } from '@modules/settings/lib/enums';
import { Col, Form, FormInstance, Radio, Row } from 'antd';
import React, { useMemo } from 'react';

interface IProps {
  form: FormInstance;
}

const InitiateSettingsEmailForm: React.FC<IProps> = ({ form }) => {
  const provider = Form.useWatch(['email', 'provider'], form);

  const visibleFieldsFn = useMemo(() => {
    switch (provider) {
      case ENUM_SETTINGS_EMAIL_PROVIDER_TYPES.GMAIL:
        return ['username', 'password'];
      case ENUM_SETTINGS_EMAIL_PROVIDER_TYPES.AWS_SES:
        return ['username', 'password', 'region'];
      case ENUM_SETTINGS_EMAIL_PROVIDER_TYPES.SENDGRID:
        return ['api_key'];
      case ENUM_SETTINGS_EMAIL_PROVIDER_TYPES.MAILGUN:
        return ['host', 'port', 'username', 'password'];
      case ENUM_SETTINGS_EMAIL_PROVIDER_TYPES.SMTP:
        return ['host', 'port', 'username', 'password', 'is_secure'];
      case ENUM_SETTINGS_EMAIL_PROVIDER_TYPES.CUSTOM:
      default:
        return [];
    }
  }, [provider]);

  const showFieldFn = (field: string) => visibleFieldsFn.includes(field);

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={12}>
        <Form.Item
          name={['email', 'provider']}
          rules={[{ required: true, message: 'Provider is required!' }]}
          className="!mb-0"
        >
          <FloatSelect
            showSearch
            virtual={false}
            placeholder="Provider"
            filterOption={(input, option: any) => option.label.toLowerCase().includes(input.toLowerCase())}
            options={settingsEmailProviderTypes.map((providerType) => ({
              key: providerType,
              label: Toolbox.toPrettyText(providerType),
              value: providerType,
            }))}
          />
        </Form.Item>
      </Col>
      <Col xs={24} md={12}>
        <Form.Item
          name={['email', 'from_name']}
          rules={[{ required: true, message: 'From name is required!' }]}
          className="!mb-0"
        >
          <FloatInput placeholder="From Name" />
        </Form.Item>
      </Col>
      <Col xs={24} md={12}>
        <Form.Item
          name={['email', 'from_email']}
          rules={[
            { required: true, message: 'From email is required!' },
            { type: 'email', message: 'From email is not valid!' },
          ]}
          className="!mb-0"
        >
          <FloatInput placeholder="From Email" />
        </Form.Item>
      </Col>
      {showFieldFn('host') && (
        <Col xs={24} md={12}>
          <Form.Item
            name={['email', 'host']}
            rules={[{ required: true, message: 'Host is required!' }]}
            className="!mb-0"
          >
            <FloatInput placeholder="Host" />
          </Form.Item>
        </Col>
      )}
      {showFieldFn('port') && (
        <Col xs={24} md={12}>
          <Form.Item
            name={['email', 'port']}
            rules={[{ required: true, message: 'Port is required!' }]}
            className="!mb-0"
          >
            <FloatInputNumber placeholder="Port" className="w-full" />
          </Form.Item>
        </Col>
      )}
      {showFieldFn('username') && (
        <Col xs={24} md={12}>
          <Form.Item
            name={['email', 'username']}
            rules={[{ required: true, message: 'Username is required!' }]}
            className="!mb-0"
          >
            <FloatInput placeholder="Username" />
          </Form.Item>
        </Col>
      )}
      {showFieldFn('password') && (
        <Col xs={24} md={12}>
          <Form.Item
            name={['email', 'password']}
            rules={[{ required: true, message: 'Password is required!' }]}
            className="!mb-0"
          >
            <FloatInputPassword placeholder="Password" />
          </Form.Item>
        </Col>
      )}
      {showFieldFn('is_secure') && (
        <Col xs={24} md={12}>
          <Form.Item name={['email', 'is_secure']} className="!mb-0">
            <Radio.Group buttonStyle="solid" className="w-full text-center">
              <Radio.Button className="w-1/2" value="true">
                Secure
              </Radio.Button>
              <Radio.Button className="w-1/2" value="false">
                Insecure
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
      )}
      {showFieldFn('api_key') && (
        <Col xs={24} md={12}>
          <Form.Item
            name={['email', 'api_key']}
            rules={[{ required: true, message: 'API key is required!' }]}
            className="!mb-0"
          >
            <FloatInputPassword placeholder="API Key" />
          </Form.Item>
        </Col>
      )}
      {showFieldFn('region') && (
        <Col xs={24} md={12}>
          <Form.Item
            name={['email', 'region']}
            rules={[{ required: true, message: 'Region is required!' }]}
            className="!mb-0"
          >
            <FloatInput placeholder="Region" />
          </Form.Item>
        </Col>
      )}
    </Row>
  );
};

export default InitiateSettingsEmailForm;
