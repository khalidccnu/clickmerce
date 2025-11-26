import FloatInput from '@base/antd/components/FloatInput';
import FloatSelect from '@base/antd/components/FloatSelect';
import FloatTextarea from '@base/antd/components/FloatTextarea';
import CustomUploader from '@base/components/CustomUploader';
import { Toolbox } from '@lib/utils/toolbox';
import { GalleriesHooks } from '@modules/galleries/lib/hooks';
import { Button, Col, Form, FormInstance, message, Radio, Row } from 'antd';
import React, { useEffect } from 'react';
import { ENUM_POPUP_TYPES, popupTypes } from '../lib/enums';
import { IPopupCreate } from '../lib/interfaces';

interface IProps {
  isLoading: boolean;
  form: FormInstance;
  formType?: 'create' | 'update';
  initialValues?: Partial<IPopupCreate>;
  onFinish: (values: IPopupCreate) => void;
}

const PopupsForm: React.FC<IProps> = ({ isLoading, form, formType = 'create', initialValues, onFinish }) => {
  const [messageApi, messageHolder] = message.useMessage();
  const formValues = Form.useWatch([], form);

  const handleImageUploadFn = (file: File) => {
    if (!file) return;

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
    <Form
      autoComplete="off"
      size="large"
      layout="vertical"
      form={form}
      initialValues={initialValues}
      onFinish={onFinish}
    >
      {messageHolder}
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
              options={popupTypes.map((popupType) => ({
                key: popupType,
                label: Toolbox.toPrettyText(popupType),
                value: popupType,
              }))}
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
        {[ENUM_POPUP_TYPES.IMAGE, ENUM_POPUP_TYPES.TEXT_AND_IMAGE].includes(formValues?.type) && (
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
                type="DRAGGER"
                listType="picture-card"
                initialValues={[formValues?.image]}
                onFinish={([_, file]) => handleImageUploadFn(file)}
              />
            </Form.Item>
          </Col>
        )}
        {[ENUM_POPUP_TYPES.TEXT, ENUM_POPUP_TYPES.TEXT_AND_IMAGE].includes(formValues?.type) && (
          <Col xs={24}>
            <Form.Item
              name="content"
              rules={[
                {
                  required: true,
                  message: 'Content is required!',
                },
              ]}
              className="!mb-0"
            >
              <FloatTextarea placeholder="Content" autoSize={{ minRows: 3, maxRows: 5 }} />
            </Form.Item>
          </Col>
        )}
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

export default PopupsForm;
