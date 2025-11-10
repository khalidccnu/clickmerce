import FloatInputNumber from '@base/antd/components/FloatInputNumber';
import { Toolbox } from '@lib/utils/toolbox';
import { settingsTaxTypes } from '@modules/settings/lib/enums';
import { Col, Form, Radio, Row } from 'antd';

const InitiateSettingsTaxForm = () => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={12}>
        <Form.Item name={['tax', 'type']} className="!mb-0">
          <Radio.Group buttonStyle="solid" className="w-full text-center">
            {settingsTaxTypes.map((taxType) => (
              <Radio.Button key={taxType} className="w-1/2" value={taxType}>
                {Toolbox.toPrettyText(taxType)}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>
      </Col>
      <Col xs={24} md={12}>
        <Form.Item
          name={['tax', 'amount']}
          rules={[
            {
              required: true,
              message: 'Amount is required!',
            },
          ]}
          className="!mb-0"
        >
          <FloatInputNumber placeholder="Amount" min={0} className="w-full" required />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default InitiateSettingsTaxForm;
