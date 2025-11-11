import FloatInput from '@base/antd/components/FloatInput';
import FloatInputNumber from '@base/antd/components/FloatInputNumber';
import FloatInputPassword from '@base/antd/components/FloatInputPassword';
import FloatSelect from '@base/antd/components/FloatSelect';
import { Toolbox } from '@lib/utils/toolbox';
import { Button, Col, Form, FormInstance, Radio, Row } from 'antd';
import React, { useEffect, useMemo } from 'react';
import { settingsEmailProviderTypes } from '../lib/enums';
import { ISettingsEmail } from '../lib/interfaces';
import { requiredSettingsEmailFieldsFn } from '../lib/utils';

interface IProps {
  isLoading: boolean;
  form: FormInstance;
  formType?: 'create' | 'update';
  initialValues?: Partial<ISettingsEmail>;
  onFinish: (values: ISettingsEmail) => void;
}

const SettingsEmailForm: React.FC<IProps> = ({ isLoading, form, formType = 'create', initialValues, onFinish }) => {
  const provider = Form.useWatch('provider', form);

  const visibleFieldsFn = useMemo(() => requiredSettingsEmailFieldsFn(provider), [provider]);

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
              options={settingsEmailProviderTypes.map((providerType) => ({
                key: providerType,
                label: Toolbox.toPrettyText(providerType),
                value: providerType,
              }))}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12} xl={8}>
          <Form.Item name="from_name" rules={[{ required: true, message: 'From name is required!' }]} className="!mb-0">
            <FloatInput placeholder="From Name" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12} xl={8}>
          <Form.Item
            name="from_email"
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
          <Col xs={24} md={12} xl={8}>
            <Form.Item name="host" rules={[{ required: true, message: 'Host is required!' }]} className="!mb-0">
              <FloatInput placeholder="Host" />
            </Form.Item>
          </Col>
        )}
        {showFieldFn('port') && (
          <Col xs={24} md={12} xl={8}>
            <Form.Item name="port" rules={[{ required: true, message: 'Port is required!' }]} className="!mb-0">
              <FloatInputNumber placeholder="Port" className="w-full" />
            </Form.Item>
          </Col>
        )}
        {showFieldFn('username') && (
          <Col xs={24} md={12} xl={8}>
            <Form.Item name="username" rules={[{ required: true, message: 'Username is required!' }]} className="!mb-0">
              <FloatInput placeholder="Username" />
            </Form.Item>
          </Col>
        )}
        {showFieldFn('password') && (
          <Col xs={24} md={12} xl={8}>
            <Form.Item name="password" rules={[{ required: true, message: 'Password is required!' }]} className="!mb-0">
              <FloatInputPassword placeholder="Password" />
            </Form.Item>
          </Col>
        )}
        {showFieldFn('is_secure') && (
          <Col xs={24} md={12} xl={8}>
            <Form.Item name="is_secure" className="!mb-0">
              <Radio.Group buttonStyle="solid" className="w-full text-center">
                <Radio.Button className="w-1/2" value={true}>
                  Secure
                </Radio.Button>
                <Radio.Button className="w-1/2" value={false}>
                  Insecure
                </Radio.Button>
              </Radio.Group>
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

export default SettingsEmailForm;
