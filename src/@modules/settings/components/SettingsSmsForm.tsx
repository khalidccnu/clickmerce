import FloatInput from '@base/antd/components/FloatInput';
import FloatInputPassword from '@base/antd/components/FloatInputPassword';
import FloatSelect from '@base/antd/components/FloatSelect';
import { Toolbox } from '@lib/utils/toolbox';
import { Button, Col, Form, FormInstance, Row } from 'antd';
import React, { useEffect, useMemo } from 'react';
import { ENUM_SETTINGS_SMS_PROVIDER_TYPES, settingsSmsProviderTypes } from '../lib/enums';
import { ISettingsSms } from '../lib/interfaces';

interface IProps {
  isLoading: boolean;
  form: FormInstance;
  formType?: 'create' | 'update';
  initialValues?: Partial<ISettingsSms>;
  onFinish: (values: ISettingsSms) => void;
}

const SettingsSmsForm: React.FC<IProps> = ({ isLoading, form, formType = 'create', initialValues, onFinish }) => {
  const provider = Form.useWatch('provider', form);

  const visibleFieldsFn = useMemo(() => {
    switch (provider) {
      case ENUM_SETTINGS_SMS_PROVIDER_TYPES.TWILIO:
        return ['account_sid', 'auth_token'];
      case ENUM_SETTINGS_SMS_PROVIDER_TYPES.AWS_SNS:
        return ['api_key', 'api_secret', 'region'];
      case ENUM_SETTINGS_SMS_PROVIDER_TYPES.VONAGE:
        return ['api_key', 'api_secret'];
      case ENUM_SETTINGS_SMS_PROVIDER_TYPES.CUSTOM:
      default:
        return [];
    }
  }, [provider]);

  const showFieldFn = (field: string) => visibleFieldsFn.includes(field);

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
        <Col xs={24} md={12} xl={8}>
          <Form.Item name="provider" rules={[{ required: true, message: 'Provider is required!' }]} className="!mb-0">
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
          <Col xs={24} md={12} xl={8}>
            <Form.Item
              name="account_sid"
              rules={[{ required: true, message: 'Account SID is required!' }]}
              className="!mb-0"
            >
              <FloatInput placeholder="Account SID" />
            </Form.Item>
          </Col>
        )}
        {showFieldFn('auth_token') && (
          <Col xs={24} md={12} xl={8}>
            <Form.Item
              name="auth_token"
              rules={[{ required: true, message: 'Auth token is required!' }]}
              className="!mb-0"
            >
              <FloatInputPassword placeholder="Auth Token" />
            </Form.Item>
          </Col>
        )}
        {showFieldFn('api_key') && (
          <Col xs={24} md={12} xl={8}>
            <Form.Item name="api_key" rules={[{ required: true, message: 'API key is required!' }]} className="!mb-0">
              <FloatInput placeholder="API Key" />
            </Form.Item>
          </Col>
        )}
        {showFieldFn('api_secret') && (
          <Col xs={24} md={12} xl={8}>
            <Form.Item
              name="api_secret"
              rules={[{ required: true, message: 'API secret is required!' }]}
              className="!mb-0"
            >
              <FloatInputPassword placeholder="API Secret" />
            </Form.Item>
          </Col>
        )}
        {showFieldFn('region') && (
          <Col xs={24} md={12} xl={8}>
            <Form.Item name="region" rules={[{ required: true, message: 'Region is required!' }]} className="!mb-0">
              <FloatInput placeholder="Region" />
            </Form.Item>
          </Col>
        )}
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

export default SettingsSmsForm;
