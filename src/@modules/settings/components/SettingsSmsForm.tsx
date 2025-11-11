import FloatInput from '@base/antd/components/FloatInput';
import FloatInputPassword from '@base/antd/components/FloatInputPassword';
import FloatSelect from '@base/antd/components/FloatSelect';
import { Toolbox } from '@lib/utils/toolbox';
import { Button, Col, Form, FormInstance, Row } from 'antd';
import React, { useEffect, useMemo } from 'react';
import { settingsSmsProviderTypes } from '../lib/enums';
import { ISettingsSms } from '../lib/interfaces';
import { requiredSettingsSmsFieldsFn } from '../lib/utils';

interface IProps {
  isLoading: boolean;
  form: FormInstance;
  formType?: 'create' | 'update';
  initialValues?: Partial<ISettingsSms>;
  onFinish: (values: ISettingsSms) => void;
}

const SettingsSmsForm: React.FC<IProps> = ({ isLoading, form, formType = 'create', initialValues, onFinish }) => {
  const provider = Form.useWatch('provider', form);

  const visibleFieldsFn = useMemo(() => requiredSettingsSmsFieldsFn(provider), [provider]);

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
              <FloatInputPassword placeholder="API Key" />
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
        {showFieldFn('endpoint') && (
          <Col xs={24} md={12} xl={8}>
            <Form.Item name="endpoint" rules={[{ required: true, message: 'Endpoint is required!' }]} className="!mb-0">
              <FloatInput placeholder="Endpoint" />
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
