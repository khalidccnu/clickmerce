import FloatInput from '@base/antd/components/FloatInput';
import FloatInputPassword from '@base/antd/components/FloatInputPassword';
import FloatSelect from '@base/antd/components/FloatSelect';
import { Toolbox } from '@lib/utils/toolbox';
import { ENUM_SETTINGS_SMS_PROVIDER_TYPES, settingsSmsProviderTypes } from '@modules/settings/lib/enums';
import { Col, Form, FormInstance, Row } from 'antd';
import React, { useMemo } from 'react';

interface IProps {
  form: FormInstance;
}

const InitiateSettingsSmsForm: React.FC<IProps> = ({ form }) => {
  const provider = Form.useWatch(['sms', 'provider'], form);

  const visibleFieldsFn = useMemo(() => {
    switch (provider) {
      case ENUM_SETTINGS_SMS_PROVIDER_TYPES.TWILIO:
        return ['account_sid', 'auth_token'];
      case ENUM_SETTINGS_SMS_PROVIDER_TYPES.AWS_SNS:
        return ['api_key', 'api_secret', 'region'];
      case ENUM_SETTINGS_SMS_PROVIDER_TYPES.VONAGE:
        return ['api_key', 'api_secret'];
      case ENUM_SETTINGS_SMS_PROVIDER_TYPES.ALPHA_SMS:
        return ['endpoint', 'api_key'];
      case ENUM_SETTINGS_SMS_PROVIDER_TYPES.CUSTOM:
      default:
        return [];
    }
  }, [provider]);

  const showFieldFn = (field: string) => visibleFieldsFn.includes(field);

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={12}>
        <Form.Item
          name={['sms', 'provider']}
          rules={[{ required: true, message: 'Provider is required!' }]}
          className="!mb-0"
        >
          <FloatSelect
            showSearch
            virtual={false}
            placeholder="Provider"
            filterOption={(input, option: any) => option.label.toLowerCase().includes(input.toLowerCase())}
            options={settingsSmsProviderTypes.map((providerType) => ({
              key: providerType,
              label: Toolbox.toPrettyText(providerType),
              value: providerType,
            }))}
          />
        </Form.Item>
      </Col>
      {showFieldFn('account_sid') && (
        <Col xs={24} md={12}>
          <Form.Item
            name={['sms', 'account_sid']}
            rules={[{ required: true, message: 'Account SID is required!' }]}
            className="!mb-0"
          >
            <FloatInput placeholder="Account SID" />
          </Form.Item>
        </Col>
      )}
      {showFieldFn('auth_token') && (
        <Col xs={24} md={12}>
          <Form.Item
            name={['sms', 'auth_token']}
            rules={[{ required: true, message: 'Auth token is required!' }]}
            className="!mb-0"
          >
            <FloatInputPassword placeholder="Auth Token" />
          </Form.Item>
        </Col>
      )}
      {showFieldFn('api_key') && (
        <Col xs={24} md={12}>
          <Form.Item
            name={['sms', 'api_key']}
            rules={[{ required: true, message: 'API key is required!' }]}
            className="!mb-0"
          >
            <FloatInputPassword placeholder="API Key" />
          </Form.Item>
        </Col>
      )}
      {showFieldFn('api_secret') && (
        <Col xs={24} md={12}>
          <Form.Item
            name={['sms', 'api_secret']}
            rules={[{ required: true, message: 'API secret is required!' }]}
            className="!mb-0"
          >
            <FloatInputPassword placeholder="API Secret" />
          </Form.Item>
        </Col>
      )}
      {showFieldFn('region') && (
        <Col xs={24} md={12}>
          <Form.Item
            name={['sms', 'region']}
            rules={[{ required: true, message: 'Region is required!' }]}
            className="!mb-0"
          >
            <FloatInput placeholder="Region" />
          </Form.Item>
        </Col>
      )}
      {showFieldFn('endpoint') && (
        <Col xs={24} md={12}>
          <Form.Item
            name={['sms', 'endpoint']}
            rules={[{ required: true, message: 'Endpoint is required!' }]}
            className="!mb-0"
          >
            <FloatInput placeholder="Endpoint" />
          </Form.Item>
        </Col>
      )}
    </Row>
  );
};

export default InitiateSettingsSmsForm;
