import FloatDatePicker from '@base/antd/components/FloatDatePicker';
import FloatInput from '@base/antd/components/FloatInput';
import FloatSelect from '@base/antd/components/FloatSelect';
import InputPhone from '@base/components/InputPhone';
import { Dayjs } from '@lib/constant/dayjs';
import { bloodGroups } from '@lib/data/bloodGroups';
import { AuthHooks } from '@modules/auth/lib/hooks';
import { IUser } from '@modules/users/lib/interfaces';
import { Button, Col, Form, message, Row } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { IoCalendar } from 'react-icons/io5';

interface IProps {
  className?: string;
}

const EditProfileForm: React.FC<IProps> = ({ className }) => {
  const [messageApi, messageHolder] = message.useMessage();
  const [form] = Form.useForm();
  const formValues = Form.useWatch([], form);

  const handleFinishFn = (values: IUser) => {
    delete values?.phone;
    profileUpdateFn.mutate(values);
  };

  const profileQuery = AuthHooks.useProfile();

  const profileUpdateFn = AuthHooks.useProfileUpdate({
    config: {
      onSuccess: (res) => {
        if (!res.success) {
          messageApi.error(res.message);
          return;
        }

        messageApi.success(res.message);
      },
    },
  });

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      name: profileQuery.data?.data?.name,
      phone: profileQuery.data?.data?.phone,
      email: profileQuery.data?.data?.email,
      blood_group: profileQuery.data?.data?.user_info?.blood_group,
      birthday: profileQuery.data?.data?.user_info?.birthday
        ? dayjs(profileQuery.data?.data?.user_info?.birthday)
        : null,
    });
  }, [form, profileQuery.data?.data]);

  return (
    <div className={className}>
      {messageHolder}
      <Form autoComplete="off" size="large" layout="vertical" form={form} onFinish={handleFinishFn}>
        <Row gutter={[16, 16]}>
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
              name="phone"
              rules={[
                {
                  required: true,
                  message: 'Phone is required!',
                },
              ]}
              className="!mb-0"
            >
              <InputPhone size="large" disabled />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item
              name="email"
              rules={[
                {
                  type: 'email',
                  message: 'Email is not valid!',
                },
              ]}
              className="!mb-0"
            >
              <FloatInput placeholder="Email" />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item name="blood_group" className="!mb-0">
              <FloatSelect
                allowClear
                showSearch
                virtual={false}
                placeholder="Blood Group"
                filterOption={(input, option: any) => option.label.toLowerCase().includes(input.toLowerCase())}
                options={bloodGroups.map((bloodGroup) => ({
                  key: bloodGroup.key,
                  label: bloodGroup.label,
                  value: bloodGroup.value,
                }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item name="birthday" className="!mb-0">
              <FloatDatePicker
                placeholder="Birthday"
                format={Dayjs.date}
                suffixIcon={<IoCalendar />}
                disabledDate={(current) => current && current > dayjs().subtract(5, 'years').startOf('day')}
                defaultPickerValue={
                  formValues?.birthday ? dayjs(formValues?.birthday) : dayjs().subtract(5, 'years').startOf('day')
                }
                className="w-full"
              />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item className="text-right !mb-0">
              <Button loading={profileUpdateFn.isPending} type="primary" htmlType="submit">
                Update
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default EditProfileForm;
