import FloatInputNumber from '@base/antd/components/FloatInputNumber';
import { Toolbox } from '@lib/utils/toolbox';
import { Button, Col, Form, FormInstance, Radio, Row } from 'antd';
import React, { useEffect } from 'react';
import { settingsVatTypes } from '../lib/enums';
import { ISettingsVat } from '../lib/interfaces';

interface IProps {
  isLoading: boolean;
  form: FormInstance;
  formType?: 'create' | 'update';
  initialValues?: Partial<ISettingsVat>;
  onFinish: (values: ISettingsVat) => void;
}

const SettingsVatForm: React.FC<IProps> = ({ isLoading, form, formType = 'create', initialValues, onFinish }) => {
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
          <Form.Item name="type" className="!mb-0">
            <Radio.Group buttonStyle="solid" className="w-full text-center">
              {settingsVatTypes.map((vatType) => (
                <Radio.Button key={vatType} className="w-full" value={vatType} disabled>
                  {Toolbox.toPrettyText(vatType)}
                </Radio.Button>
              ))}
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col xs={24} md={12} xl={8}>
          <Form.Item
            name="amount"
            rules={[
              {
                required: true,
                message: 'Amount is required!',
              },
            ]}
            className="!mb-0"
          >
            <FloatInputNumber placeholder="Amount" min={0} className="w-full" />
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

export default SettingsVatForm;
