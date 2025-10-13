import FloatDatePicker from '@base/antd/components/FloatDatePicker';
import FloatInput from '@base/antd/components/FloatInput';
import FloatInputPassword from '@base/antd/components/FloatInputPassword';
import FloatSelect from '@base/antd/components/FloatSelect';
import InfiniteScrollSelect from '@base/components/InfiniteScrollSelect';
import InputPhone from '@base/components/InputPhone';
import { TId } from '@base/interfaces';
import { Dayjs } from '@lib/constant/dayjs';
import { bloodGroups } from '@lib/data/bloodGroups';
import { Toolbox } from '@lib/utils/toolbox';
import Authorization from '@modules/auth/components/Authorization';
import { hasAccess } from '@modules/auth/lib/utils/client';
import { RolesHooks } from '@modules/roles/lib/hooks';
import { IRole } from '@modules/roles/lib/interfaces';
import { Button, Col, Form, FormInstance, message, Radio, Row } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { IoCalendar } from 'react-icons/io5';
import { IUserCreate } from '../lib/interfaces';

interface IProps {
  isLoading: boolean;
  form: FormInstance;
  formType?: 'create' | 'update';
  initialValues?: Partial<IUserCreate>;
  onFinish: (values: IUserCreate) => void;
}

const UsersForm: React.FC<IProps> = ({ isLoading, form, formType = 'create', initialValues, onFinish }) => {
  const [messageApi, messageHolder] = message.useMessage();
  const formValues = Form.useWatch([], form);
  const [roleSearchTerm, setRoleSearchTerm] = useState(null);

  const rolesSpecificQuery = RolesHooks.useFindSpecifics({
    config: {
      onSuccess: (res) => {
        if (!res.success) {
          messageApi.error(res.message);
          return;
        }
      },
    },
  });

  const rolesQuery = RolesHooks.useFindInfinite({
    config: {
      queryKey: [],
      enabled: hasAccess({ allowedPermissions: ['roles:read'] }),
    },
    options: {
      limit: '20',
      search_term: roleSearchTerm,
      search_field: 'name',
    },
  });

  const handleFinishFn = (values) => {
    let sanitizedRoles = [];

    if (hasAccess({ allowedPermissions: ['roles:read'] })) {
      const currentSanitizedRoles = values?.roles?.map((role: TId) => ({ id: role }));
      sanitizedRoles = Toolbox.computeArrayDiffs(initialValues?.roles, currentSanitizedRoles, 'id');
    }

    onFinish({ ...values, roles: sanitizedRoles });
  };

  useEffect(() => {
    form.resetFields();

    if (formType === 'update' && hasAccess({ allowedPermissions: ['roles:read'] })) {
      if (Toolbox.isNotEmpty(initialValues?.roles)) {
        const roles = initialValues?.roles?.map((role) => role?.id);
        rolesSpecificQuery.mutate(roles);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formType, form, initialValues]);

  return (
    <React.Fragment>
      {messageHolder}
      <Form
        autoComplete="off"
        size="large"
        layout="vertical"
        form={form}
        initialValues={{
          ...initialValues,
          birthday: initialValues?.birthday ? dayjs(initialValues?.birthday) : null,
          roles: initialValues?.roles?.map((role) => role?.id),
        }}
        onFinish={handleFinishFn}
      >
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
              name="password"
              rules={[
                {
                  required: formType === 'create' && Toolbox.toBool(formValues?.is_admin),
                  message: 'Password is required!',
                },
                {
                  min: 8,
                  message: 'Password must be at least 8 characters long!',
                },
              ]}
              className="!mb-0"
            >
              <FloatInputPassword placeholder="Password" />
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
              <InputPhone size="large" />
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
          <Authorization allowedPermissions={['roles:read']}>
            <Col xs={24}>
              <Form.Item className="!mb-0" name="roles">
                <InfiniteScrollSelect<IRole>
                  isFloat
                  allowClear
                  showSearch
                  mode="multiple"
                  virtual={false}
                  placeholder="Roles"
                  initialOptions={rolesSpecificQuery.data?.data}
                  option={({ item: role }) => ({
                    key: role?.id,
                    label: role?.name,
                    value: role?.id,
                  })}
                  onChangeSearchTerm={setRoleSearchTerm}
                  query={rolesQuery}
                />
              </Form.Item>
            </Col>
          </Authorization>
          <Col xs={24}>
            <Form.Item name="is_admin" className="!mb-0">
              <Radio.Group buttonStyle="solid" className="w-full text-center">
                <Radio.Button className="w-1/2" value="true">
                  Admin
                </Radio.Button>
                <Radio.Button className="w-1/2" value="false">
                  Customer
                </Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item name="is_default_customer" className="!mb-0">
              <Radio.Group buttonStyle="solid" className="w-full text-center">
                <Radio.Button className="w-1/2" value="true">
                  Default Customer
                </Radio.Button>
                <Radio.Button className="w-1/2" value="false">
                  Optional Customer
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
    </React.Fragment>
  );
};

export default UsersForm;
