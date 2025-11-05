import FloatInput from '@base/antd/components/FloatInput';
import FloatSelect from '@base/antd/components/FloatSelect';
import { Toolbox } from '@lib/utils/toolbox';
import { settingsS3ProviderTypes } from '@modules/settings/lib/enums';
import { Col, Form, Row } from 'antd';

const InitiateSettingsS3Form = () => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={12}>
        <Form.Item name={['s3', 'provider']} className="!mb-0">
          <FloatSelect
            allowClear
            showSearch
            virtual={false}
            placeholder="Provider"
            filterOption={(input, option: any) => option.label.toLowerCase().includes(input.toLowerCase())}
            options={settingsS3ProviderTypes.map((providerType) => ({
              key: providerType,
              label: Toolbox.toPrettyText(providerType),
              value: providerType,
            }))}
          />
        </Form.Item>
      </Col>
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
        <Form.Item name={['s3', 'region']} className="!mb-0">
          <FloatInput placeholder="Region" />
        </Form.Item>
      </Col>
      <Col xs={24} md={12}>
        <Form.Item name={['s3', 'bucket']} className="!mb-0">
          <FloatInput placeholder="Bucket" />
        </Form.Item>
      </Col>
      <Col xs={24}>
        <Form.Item
          name={['s3', 'custom_url']}
          rules={[{ type: 'url', message: 'Custom URL must be a valid URL!' }]}
          className="!mb-0"
        >
          <FloatInput placeholder="Custom URL" />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default InitiateSettingsS3Form;
