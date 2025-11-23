import FloatInputPassword from '@base/antd/components/FloatInputPassword';
import { AuthHooks } from '@modules/auth/lib/hooks';
import { Button, Col, Form, message, Row } from 'antd';
import React, { useEffect } from 'react';

interface IProps {
  className?: string;
}

const logoutFn = AuthHooks.useLogout;

const ChangePasswordForm: React.FC<IProps> = ({ className }) => {
  const [messageApi, messageHolder] = message.useMessage();
  const [form] = Form.useForm();

  const passwordUpdateFn = AuthHooks.usePasswordUpdate({
    config: {
      onSuccess(data) {
        if (!data.success) {
          messageApi.error(data.message);
          return;
        }

        messageApi.loading(data.message, 1).then(() => logoutFn());
      },
    },
  });

  useEffect(() => {
    form.resetFields();
  }, [form]);

  return (
    <div className={className}>
      {messageHolder}
      <Form autoComplete="off" size="large" layout="vertical" form={form} onFinish={passwordUpdateFn.mutate}>
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Form.Item
              name="current_password"
              rules={[
                {
                  required: true,
                  message: 'Please input your current password!',
                },
              ]}
              className="!mb-0"
            >
              <FloatInputPassword placeholder="Current Password" />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item
              name="new_password"
              rules={[
                {
                  required: true,
                  message: 'Please input your new password!',
                },
                {
                  min: 8,
                  message: 'New password must be at least 8 characters long!',
                },
              ]}
              className="!mb-0"
            >
              <FloatInputPassword placeholder="New Password" />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item className="text-right !mb-0">
              <Button loading={passwordUpdateFn.isPending} type="primary" htmlType="submit">
                Update
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default ChangePasswordForm;
