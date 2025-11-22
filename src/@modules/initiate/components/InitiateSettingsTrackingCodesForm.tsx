import FloatInput from '@base/antd/components/FloatInput';
import { Col, Form, Row } from 'antd';

const InitiateSettingsTrackingCodesForm = () => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={12}>
        <Form.Item name={['tracking_codes', 'gtag_id']} className="!mb-0">
          <FloatInput placeholder="GTAG Id" />
        </Form.Item>
      </Col>
      <Col xs={24} md={12}>
        <Form.Item name={['tracking_codes', 'gtm_id']} className="!mb-0">
          <FloatInput placeholder="GTM Id" />
        </Form.Item>
      </Col>
      <Col xs={24} md={12}>
        <Form.Item name={['tracking_codes', 'fb_pixel_id']} className="!mb-0">
          <FloatInput placeholder="FB Pixel Id" />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default InitiateSettingsTrackingCodesForm;
