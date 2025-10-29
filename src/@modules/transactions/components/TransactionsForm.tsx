import FloatInputNumber from '@base/antd/components/FloatInputNumber';
import FloatSelect from '@base/antd/components/FloatSelect';
import FloatTextarea from '@base/antd/components/FloatTextarea';
import BaseModalWithoutClicker from '@base/components/BaseModalWithoutClicker';
import InfiniteScrollSelect from '@base/components/InfiniteScrollSelect';
import { Toolbox } from '@lib/utils/toolbox';
import UsersForm from '@modules/users/components/UsersForm';
import { UsersHooks } from '@modules/users/lib/hooks';
import { IUser } from '@modules/users/lib/interfaces';
import { Button, Col, Divider, Form, FormInstance, message, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { transactionTypes } from '../lib/enums';
import { ITransactionCreate } from '../lib/interfaces';

interface IProps {
  isLoading: boolean;
  form: FormInstance;
  formType?: 'create' | 'update';
  initialValues?: Partial<ITransactionCreate>;
  onFinish: (values: ITransactionCreate) => void;
}

const TransactionsForm: React.FC<IProps> = ({ isLoading, form, formType = 'create', initialValues, onFinish }) => {
  const [messageApi, messageHolder] = message.useMessage();
  const [userFormInstance] = Form.useForm();
  const [userSearchTerm, setUserSearchTerm] = useState(null);
  const [isUserModalOpen, setUserModalOpen] = useState(false);

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
    id: initialValues?.user_id,
    config: {
      queryKey: [],
      enabled: !!initialValues?.user_id,
    },
  });

  const usersQuery = UsersHooks.useFindInfinite({
    options: {
      limit: '20',
      search_term: userSearchTerm,
      is_active: 'true',
      search_fields: ['name', 'phone', 'email'],
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
                showSearch
                virtual={false}
                placeholder="Type"
                filterOption={(input, option: any) => option.label.toLowerCase().includes(input.toLowerCase())}
                options={transactionTypes.map((transactionType) => ({
                  key: transactionType,
                  label: Toolbox.toPrettyText(transactionType),
                  value: transactionType,
                }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item
              name="amount"
              rules={[
                {
                  required: true,
                  message: 'Amount is required!',
                },
              ]}
              className="!mb-0"
            >
              <FloatInputNumber placeholder="Amount" className="w-full" />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item name="note" className="!mb-0">
              <FloatTextarea placeholder="Note" autoSize={{ minRows: 1, maxRows: 3 }} />
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

export default TransactionsForm;
