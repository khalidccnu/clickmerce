import FloatInput from '@base/antd/components/FloatInput';
import { Col, Form, Row } from 'antd';

const InitiateSettingsS3Form = () => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={12}>
        <Form.Item name={['s3', 'access_key_id']} className="!mb-0">
          <FloatInput placeholder="Access Key ID" />
        </Form.Item>
      </Col>
      <Col xs={24} md={12}>
        <Form.Item name={['s3', 'secret_access_key']} className="!mb-0">
          <FloatInput placeholder="Secret Access Key" />
        </Form.Item>
      </Col>
      <Col xs={24} md={12}>
        <Form.Item
          name={['s3', 'endpoint']}
          rules={[{ type: 'url', message: 'Endpoint must be a valid URL!' }]}
          className="!mb-0"
        >
          <FloatInput placeholder="Endpoint" />
        </Form.Item>
      </Col>
      <Col xs={24} md={12}>
        <Form.Item
          name={['s3', 'r2_worker_endpoint']}
          rules={[{ type: 'url', message: 'R2 worker endpoint must be a valid URL!' }]}
          className="!mb-0"
        >
          <FloatInput placeholder="R2 Worker Endpoint" />
        </Form.Item>
      </Col>
      <Col xs={24} md={12}>
        <Form.Item name={['s3', 'region']} className="!mb-0">
          <FloatInput placeholder="Region" />
        </Form.Item>
      </Col>
      <Col xs={24} md={12}>
        <Form.Item name={['s3', 'bucket']} className="!mb-0">
          <FloatInput placeholder="Bucket" />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default InitiateSettingsS3Form;
