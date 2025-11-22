import FloatTextarea from '@base/antd/components/FloatTextarea';
import BaseModalWithoutClicker from '@base/components/BaseModalWithoutClicker';
import CustomUploader from '@base/components/CustomUploader';
import InfiniteScrollSelect from '@base/components/InfiniteScrollSelect';
import { Toolbox } from '@lib/utils/toolbox';
import { GalleriesHooks } from '@modules/galleries/lib/hooks';
import { ProductsHooks } from '@modules/products/lib/hooks';
import { IProduct } from '@modules/products/lib/interfaces';
import UsersForm from '@modules/users/components/UsersForm';
import { UsersHooks } from '@modules/users/lib/hooks';
import { IUser } from '@modules/users/lib/interfaces';
import { Button, Col, Divider, Form, FormInstance, message, Radio, Rate, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { IReviewCreate } from '../lib/interfaces';

interface IProps {
  isLoading: boolean;
  form: FormInstance;
  formType?: 'create' | 'update';
  initialValues?: Partial<IReviewCreate>;
  onFinish: (values: IReviewCreate) => void;
}

const ReviewsForm: React.FC<IProps> = ({ isLoading, form, formType = 'create', initialValues, onFinish }) => {
  const [messageApi, messageHolder] = message.useMessage();
  const formValues = Form.useWatch([], form);
  const [userFormInstance] = Form.useForm();
  const [userSearchTerm, setUserSearchTerm] = useState(null);
  const [isUserModalOpen, setUserModalOpen] = useState(false);
  const [productSearchTerm, setProductSearchTerm] = useState(null);

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

  const userCreateFn = UsersHooks.useCreate({
    config: {
      onSuccess: (res) => {
        if (!res.success) {
          messageApi.error(res.message);
          return;
        }

        form.setFieldValue('user_id', res.data.id);
        setUserModalOpen(false);
        userFormInstance.resetFields();
        messageApi.success(res.message);
      },
    },
  });

  const userQuery = UsersHooks.useFindById({
    id: formValues?.user_id,
    config: {
      queryKey: [],
      enabled: !!formValues?.user_id,
    },
  });

  const usersQuery = UsersHooks.useFindInfinite({
    options: {
      limit: '20',
      search_term: userSearchTerm,
      search_fields: ['name', 'phone', 'email'],
    },
  });

  const productQuery = ProductsHooks.useFindById({
    id: formValues?.product_id,
    config: {
      queryKey: [],
      enabled: !!formValues?.product_id,
    },
  });

  const productsQuery = ProductsHooks.useFindInfinite({
    options: {
      limit: '20',
      search_term: productSearchTerm,
      search_field: 'name',
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
              name="rate"
              rules={[
                {
                  required: true,
                  message: 'Rate is required!',
                },
              ]}
              className="!mb-0"
            >
              <Rate allowHalf style={{ color: 'var(--color-primary' }} />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item
              name="comment"
              rules={[
                {
                  required: true,
                  message: 'Comment is required!',
                },
              ]}
              className="!mb-0"
            >
              <FloatTextarea placeholder="Comment" autoSize={{ minRows: 1, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item
              name="user_id"
              rules={[
                {
                  required: true,
                  message: 'User is required!',
                },
              ]}
              className="!mb-0"
            >
              <InfiniteScrollSelect<IUser>
                isFloat
                allowClear
                showSearch
                virtual={false}
                placeholder="User"
                initialOptions={userQuery.data?.data?.id ? [userQuery.data?.data] : []}
                option={({ item: user }) => ({
                  key: user?.id,
                  label: user?.name,
                  value: user?.id,
                })}
                onChangeSearchTerm={setUserSearchTerm}
                query={usersQuery}
                popupRender={(options) => (
                  <React.Fragment>
                    {options}
                    <Divider style={{ marginBlock: '8px' }} />
                    <Button type="text" block onClick={() => setUserModalOpen(true)}>
                      Add New
                    </Button>
                  </React.Fragment>
                )}
              />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item name="product_id" className="!mb-0">
              <InfiniteScrollSelect<IProduct>
                isFloat
                allowClear
                showSearch
                virtual={false}
                placeholder="Product"
                initialOptions={productQuery.data?.data?.id ? [productQuery.data?.data] : []}
                option={({ item: product }) => ({
                  key: product?.id,
                  label: product?.name,
                  value: product?.id,
                })}
                onChangeSearchTerm={setProductSearchTerm}
                query={productsQuery}
              />
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
      <BaseModalWithoutClicker
        destroyOnHidden
        width={540}
        title="Create a new user"
        footer={null}
        open={isUserModalOpen}
        onCancel={() => setUserModalOpen(false)}
      >
        <UsersForm
          form={userFormInstance}
          initialValues={{ is_admin: 'false', is_default_customer: 'false', is_active: 'true' }}
          isLoading={userCreateFn.isPending}
          onFinish={(values) => userCreateFn.mutate(values)}
        />
      </BaseModalWithoutClicker>
    </React.Fragment>
  );
};

export default ReviewsForm;
