import FloatDatePicker from '@base/antd/components/FloatDatePicker';
import FloatInput from '@base/antd/components/FloatInput';
import FloatInputPassword from '@base/antd/components/FloatInputPassword';
import FloatSelect from '@base/antd/components/FloatSelect';
import InputPhone from '@base/components/InputPhone';
import { Dayjs } from '@lib/constant/dayjs';
import { bloodGroups } from '@lib/data/bloodGroups';
import { Col, Form, FormInstance, Row } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { IoCalendar } from 'react-icons/io5';

interface IProps {
  form: FormInstance;
}

const InitiateUsersForm: React.FC<IProps> = ({ form }) => {
  const formValues = Form.useWatch([], form);

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24}>
        <Form.Item
          name={['user', 'name']}
          rules={[
            {
              required: true,
              message: 'Name is required!',
            },
          ]}
          className="!mb-0"
        >
          <FloatInput placeholder="Name" required />
        </Form.Item>
      </Col>
      <Col xs={24}>
        <Form.Item
          name={['user', 'password']}
          rules={[
            {
              required: true,
              message: 'Password is required!',
            },
            {
              min: 8,
              message: 'Password must be at least 8 characters long!',
            },
          ]}
          className="!mb-0"
        >
          <FloatInputPassword placeholder="Password" required />
        </Form.Item>
      </Col>
      <Col xs={24}>
        <Form.Item
          name={['user', 'phone']}
          rules={[
            {
              required: true,
              message: 'Phone is required!',
            },
          ]}
          className="!mb-0"
        >
          <InputPhone size="large" />
        </Form.Item>
      </Col>
      <Col xs={24}>
        <Form.Item
          name={['user', 'email']}
          rules={[
            {
              type: 'email',
              message: 'Email is not valid!',
            },
            {
              required: true,
              message: 'Email is required!',
            },
          ]}
          className="!mb-0"
        >
          <FloatInput placeholder="Email" required />
        </Form.Item>
      </Col>
      <Col xs={24}>
        <Form.Item
          name={['user', 'blood_group']}
          rules={[
            {
              required: true,
              message: 'Blood group is required!',
            },
          ]}
          className="!mb-0"
        >
          <FloatSelect
            required
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
        <Form.Item
          name={['user', 'birthday']}
          rules={[
            {
              required: true,
              message: 'Birthday is required!',
            },
          ]}
          className="!mb-0"
        >
          <FloatDatePicker
            required
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
    </Row>
  );
};

export default InitiateUsersForm;
