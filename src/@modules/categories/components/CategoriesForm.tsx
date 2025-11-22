import FloatInput from '@base/antd/components/FloatInput';
import CustomUploader from '@base/components/CustomUploader';
import { Toolbox } from '@lib/utils/toolbox';
import { GalleriesHooks } from '@modules/galleries/lib/hooks';
import { Button, Col, Form, FormInstance, message, Radio, Row } from 'antd';
import React, { useEffect } from 'react';
import { ICategoryCreate } from '../lib/interfaces';

interface IProps {
  isLoading: boolean;
  form: FormInstance;
  formType?: 'create' | 'update';
  initialValues?: Partial<ICategoryCreate>;
  onFinish: (values: ICategoryCreate) => void;
}

const CategoriesForm: React.FC<IProps> = ({ isLoading, form, formType = 'create', initialValues, onFinish }) => {
  const [messageApi, messageHolder] = message.useMessage();
  const formValues = Form.useWatch([], form);

  const handleImageUploadFn = (file: File) => {
    if (!file) {
      form.setFieldValue('image', null);
      return;
    }

    const formData: any = Toolbox.withFormData({ files: file, type: 'FILE', make_public: 'true' });

    galleriesCreateFn.mutate(formData);
  };

  const galleriesCreateFn = GalleriesHooks.useCreate({
    config: {
      onSuccess: (res) => {
        if (!res.success) {
          messageApi.error(res.message);
          return;
        }

        form.setFieldValue('image', res.data?.[0]?.file_url);
        messageApi.success(res.message);
      },
    },
  });

  useEffect(() => {
    form.resetFields();
  }, [form, initialValues]);

  return (
    <React.Fragment>
      {messageHolder}
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
            <Form.Item name="image" className="!mb-0">
              <CustomUploader
                isCrop
                type="DRAGGER"
                listType="picture-card"
                initialValues={[formValues?.image]}
                onFinish={([_, file]) => handleImageUploadFn(file)}
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
              <FloatInput
                placeholder="Name"
                onBlur={() => form.setFieldValue('slug', Toolbox.generateSlug(form.getFieldValue('name')))}
              />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item
              name="slug"
              rules={[
                {
                  required: true,
                  message: 'Slug is required!',
                },
              ]}
              className="!mb-0"
            >
              <FloatInput placeholder="Slug" />
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
    </React.Fragment>
  );
};

export default CategoriesForm;
