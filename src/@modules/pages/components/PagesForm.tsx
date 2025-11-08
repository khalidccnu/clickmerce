import FloatSelect from '@base/antd/components/FloatSelect';
import RichTextEditor from '@base/components/RichTextEditor';
import useTheme from '@lib/hooks/useTheme';
import { Toolbox } from '@lib/utils/toolbox';
import { Button, Col, Form, FormInstance, Radio, Row } from 'antd';
import React, { useEffect } from 'react';
import { pageTypes } from '../lib/enums';
import { IPageCreate } from '../lib/interfaces';

interface IProps {
  isLoading: boolean;
  form: FormInstance;
  formType?: 'create' | 'update';
  initialValues?: Partial<IPageCreate>;
  onFinish: (values: IPageCreate) => void;
}

const PagesForm: React.FC<IProps> = ({ isLoading, form, formType = 'create', initialValues, onFinish }) => {
  const { isDark } = useTheme();

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
          <Form.Item
            name="type"
            rules={[
              {
                required: true,
                message: 'Type is required!',
              },
            ]}
            className="!mb-0"
          >
            <FloatSelect
              allowClear
              showSearch
              virtual={false}
              placeholder="Type"
              filterOption={(input, option: any) => option.label.toLowerCase().includes(input.toLowerCase())}
              options={pageTypes.map((pageType) => ({
                key: pageType,
                label: Toolbox.toPrettyText(pageType),
                value: pageType,
              }))}
            />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item name="content" className="!mb-0">
            <RichTextEditor placeholder="Content" isDark={isDark} makePublicFile />
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

export default PagesForm;
