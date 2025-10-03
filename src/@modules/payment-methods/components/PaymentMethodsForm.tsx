import FloatInput from '@base/antd/components/FloatInput';
import FloatSelect from '@base/antd/components/FloatSelect';
import CustomUploader from '@base/components/CustomUploader';
import RichTextEditor from '@base/components/RichTextEditor';
import useTheme from '@lib/hooks/useTheme';
import { Toolbox } from '@lib/utils/toolbox';
import { Button, Col, Form, FormInstance, Radio, Row } from 'antd';
import React, { useEffect } from 'react';
import { ENUM_PAYMENT_METHOD_REFERENCE_TYPES, paymentMethodReferenceTypes, paymentMethodTypes } from '../lib/enums';
import { IPaymentMethodCreate } from '../lib/interfaces';

interface IProps {
  isLoading: boolean;
  form: FormInstance;
  formType?: 'create' | 'update';
  initialValues?: Partial<IPaymentMethodCreate>;
  onFinish: (values: IPaymentMethodCreate) => void;
}

const PaymentMethodsForm: React.FC<IProps> = ({ isLoading, form, formType = 'create', initialValues, onFinish }) => {
  const { isDark } = useTheme();
  const formValues = Form.useWatch([], form);

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
        <Col xs={24}>
          <Form.Item name="type" className="!mb-0">
            <Radio.Group buttonStyle="solid" className="w-full text-center">
              {paymentMethodTypes.map((paymentMethodType) => (
                <Radio.Button key={paymentMethodType} className="w-1/2" value={paymentMethodType}>
                  {Toolbox.toPrettyText(paymentMethodType)}
                </Radio.Button>
              ))}
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item
            name="image"
            rules={[
              {
                required: true,
                message: 'Image is required!',
              },
            ]}
            className="!mb-0"
          >
            <CustomUploader
              isCrop
              makePublic
              listType="picture-card"
              initialValues={[formValues?.image]}
              onChange={(urls) => form.setFieldValue('image', urls[0])}
            />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: 'Name is required!',
              },
            ]}
            className="!mb-0"
          >
            <FloatInput placeholder="Name" />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item
            name="reference_type"
            rules={[
              {
                required: true,
                message: 'Reference type is required!',
              },
            ]}
            className="!mb-0"
          >
            <FloatSelect
              allowClear
              showSearch
              virtual={false}
              placeholder="Reference Type"
              filterOption={(input, option: any) => option.label.toLowerCase().includes(input.toLowerCase())}
              options={paymentMethodReferenceTypes.map((referenceType) => ({
                key: referenceType,
                label: Toolbox.toPrettyText(referenceType),
                value: referenceType,
              }))}
            />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item
            name="description"
            rules={[
              {
                required: formValues?.reference_type !== ENUM_PAYMENT_METHOD_REFERENCE_TYPES.AUTO,
                message: 'Description is required!',
              },
            ]}
            className="!mb-0"
          >
            <RichTextEditor placeholder="Description" isDark={isDark} makePublicFile />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item name="is_default" className="!mb-0">
            <Radio.Group buttonStyle="solid" className="w-full text-center">
              <Radio.Button className="w-1/2" value="true">
                Default
              </Radio.Button>
              <Radio.Button className="w-1/2" value="false">
                Not Default
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item name="is_active" className="!mb-0">
            <Radio.Group buttonStyle="solid" className="w-full text-center">
              <Radio.Button className="w-1/2" value="true">
                Active
              </Radio.Button>
              <Radio.Button className="w-1/2" value="false">
                Inactive
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item className="text-right !mb-0">
            <Button loading={isLoading} type="primary" htmlType="submit">
              {formType === 'create' ? 'Submit' : 'Update'}
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default PaymentMethodsForm;
