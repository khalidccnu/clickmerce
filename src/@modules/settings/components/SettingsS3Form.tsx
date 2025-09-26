import FloatInput from '@base/antd/components/FloatInput';
import { Button, Col, Form, FormInstance, Row } from 'antd';
import React, { useEffect } from 'react';
import { ISettings, ISettingsS3 } from '../lib/interfaces';

interface IProps {
  isLoading: boolean;
  form: FormInstance;
  formType?: 'create' | 'update';
  initialValues?: Partial<ISettings>;
  onFinish: (values: ISettingsS3) => void;
}

const SettingsS3Form: React.FC<IProps> = ({ isLoading, form, formType = 'create', initialValues, onFinish }) => {
  useEffect(() => {
    form.resetFields();
  }, [form, initialValues]);

  return (
    <Form
      autoComplete="off"
      size="large"
      layout="vertical"
      form={form}
      onFinish={onFinish}
      disabled={initialValues?.is_s3_configured}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} xl={8}>
          <Form.Item
            name="access_key_id"
            rules={[
              {
                required: true,
                message: 'Access key id is required!',
              },
            ]}
            className="!mb-0"
          >
            <FloatInput placeholder="Access Key ID" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12} xl={8}>
          <Form.Item
            name="secret_access_key"
            rules={[
              {
                required: true,
                message: 'Secret access key is required!',
              },
            ]}
            className="!mb-0"
          >
            <FloatInput placeholder="Secret Access Key" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12} xl={8}>
          <Form.Item
            name="endpoint"
            rules={[
              {
                required: true,
                message: 'Endpoint is required!',
              },
              {
                type: 'url',
                message: 'Endpoint must be a valid URL!',
              },
            ]}
            className="!mb-0"
          >
            <FloatInput placeholder="Endpoint" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12} xl={8}>
          <Form.Item
            name="r2_worker_endpoint"
            rules={[
              {
                type: 'url',
                message: 'R2 worker endpoint must be a valid URL!',
              },
            ]}
            className="!mb-0"
          >
            <FloatInput placeholder="R2 Worker Endpoint" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12} xl={8}>
          <Form.Item
            name="region"
            rules={[
              {
                required: true,
                message: 'Region is required!',
              },
            ]}
            className="!mb-0"
          >
            <FloatInput placeholder="Region" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12} xl={8}>
          <Form.Item
            name="bucket"
            rules={[
              {
                required: true,
                message: 'Bucket is required!',
              },
            ]}
            className="!mb-0"
          >
            <FloatInput placeholder="Bucket" />
          </Form.Item>
        </Col>
        <Col xs={12}>
          <Form.Item className="!mb-0">
            <Button
              type="primary"
              htmlType="button"
              onClick={() => onFinish(form.getFieldsValue())}
              disabled={formType === 'create' || !initialValues?.is_s3_configured}
            >
              Reset
            </Button>
          </Form.Item>
        </Col>
        <Col xs={12}>
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

export default SettingsS3Form;
