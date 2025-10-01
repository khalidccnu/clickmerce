import FloatInputNumber from '@base/antd/components/FloatInputNumber';
import { Toolbox } from '@lib/utils/toolbox';
import { settingsVatTypes } from '@modules/settings/lib/enums';
import { Col, Form, Radio, Row } from 'antd';

const InitiateSettingsVatForm = () => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={12}>
        <Form.Item name={['vat', 'type']} className="!mb-0">
          <Radio.Group buttonStyle="solid" className="w-full text-center">
            {settingsVatTypes.map((vatType) => (
              <Radio.Button key={vatType} className="w-full" value={vatType} disabled>
                {Toolbox.toPrettyText(vatType)}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>
      </Col>
      <Col xs={24} md={12}>
        <Form.Item
          name={['vat', 'amount']}
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
    </Row>
  );
};

export default InitiateSettingsVatForm;
