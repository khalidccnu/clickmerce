import FloatDatePicker from '@base/antd/components/FloatDatePicker';
import FloatInput from '@base/antd/components/FloatInput';
import FloatInputPassword from '@base/antd/components/FloatInputPassword';
import FloatSelect from '@base/antd/components/FloatSelect';
import InfiniteScrollSelect from '@base/components/InfiniteScrollSelect';
import PhoneCodeSelect from '@base/components/PhoneCodeSelect';
import { TId } from '@base/interfaces';
import { bloodGroups } from '@lib/data/bloodGroups';
import { Storage } from '@lib/utils/storage';
import { Toolbox } from '@lib/utils/toolbox';
import Authorization from '@modules/auth/components/Authorization';
import { PC_KEY } from '@modules/auth/lib/constant';
import { hasAccessPermission } from '@modules/auth/lib/utils';
import { RolesHooks } from '@modules/roles/lib/hooks';
import { IRole } from '@modules/roles/lib/interfaces';
import { Button, Col, Form, FormInstance, Input, message, Radio, Row } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { IoCalendar } from 'react-icons/io5';
import { IUserCreate } from '../lib/interfaces';

interface IProps {
  isInitiate?: boolean;
  isLoading: boolean;
  form: FormInstance;
  formType?: 'create' | 'update';
  initialValues?: Partial<IUserCreate>;
  onFinish: (values: IUserCreate) => void;
}

const UsersForm: React.FC<IProps> = ({
  isInitiate = false,
  isLoading,
  form,
  formType = 'create',
  initialValues,
  onFinish,
}) => {
  const [messageApi, messageHolder] = message.useMessage();
  const formValues = Form.useWatch([], form);
  const [phoneCode, setPhoneCode] = useState(null);
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
      enabled: !isInitiate && hasAccessPermission(['roles:read']),
    },
    options: {
      limit: 20,
      search_term: roleSearchTerm,
      search_field: 'name',
    },
  });

  const handleFinishFn = (values) => {
    values.phone_code = phoneCode;

    let sanitizedRoles = [];

    if (!isInitiate && hasAccessPermission(['roles:read'])) {
      const currentSanitizedRoles = values?.roles?.map((role: TId) => ({ id: role }));
      sanitizedRoles = Toolbox.computeArrayDiffs(initialValues?.roles, currentSanitizedRoles, 'id');
    }

    onFinish({ ...values, roles: sanitizedRoles });
  };

  useEffect(() => {
    form.resetFields();

    if (formType === 'update' && !isInitiate && hasAccessPermission(['roles:read'])) {
      if (Toolbox.isNotEmpty(initialValues?.roles)) {
        const roles = initialValues?.roles?.map((role) => role?.id);
        rolesSpecificQuery.mutate(roles);
      }
    }

    const initialPhoneCode = formType === 'create' ? Storage.getData(PC_KEY) : initialValues?.phone_code;
    setPhoneCode(initialPhoneCode);
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
                  required: isInitiate || (formType === 'create' && Toolbox.toBool(formValues?.is_admin)),
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
                {
                  validator: (_, value) => {
                    if (!value) return Promise.resolve();

                    if (!/^\d+$/.test(value)) {
                      return Promise.reject(new Error('Phone must contain only numbers!'));
                    }

                    if (!/^(13|14|15|16|17|18|19)/.test(value)) {
                      return Promise.reject(new Error('Please enter a valid phone!'));
                    }

                    if (value.length !== 10) {
                      return Promise.reject(new Error('Phone must be exactly 10 digits!'));
                    }

                    return Promise.resolve();
                  },
                },
              ]}
              className="!mb-0"
            >
              <Input
                classNames={{ input: 'placeholder:text-[0.85rem] placeholder:text-[rgba(0,_0,_0,_0.45)]' }}
                placeholder="XXXXXXXXXX"
                addonBefore={
                  <PhoneCodeSelect
                    disabled
                    showSearch
                    code={phoneCode}
                    onSelectCode={setPhoneCode}
                    style={{ width: 120 }}
                  />
                }
              />
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
                {
                  required: isInitiate,
                  message: 'Email is required!',
                },
              ]}
              className="!mb-0"
            >
              <FloatInput placeholder="Email" />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item
              name="blood_group"
              rules={[
                {
                  required: isInitiate,
                  message: 'Blood group is required!',
                },
              ]}
              className="!mb-0"
            >
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
            <Form.Item
              name="birthday"
              rules={[
                {
                  required: isInitiate,
                  message: 'Birthday is required!',
                },
              ]}
              className="!mb-0"
            >
              <FloatDatePicker
                placeholder="Birthday"
                format="YYYY-MM-DD"
                suffixIcon={<IoCalendar />}
                disabledDate={(current) => current && current > dayjs().subtract(5, 'years').startOf('day')}
                defaultPickerValue={
                  formValues?.birthday ? dayjs(formValues?.birthday) : dayjs().subtract(5, 'years').startOf('day')
                }
                className="w-full"
              />
            </Form.Item>
          </Col>
          {isInitiate || (
            <React.Fragment>
              <Authorization allowedAccess={['roles:read']}>
                <Col xs={24} md={24}>
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
                      onChangeSearchTerm={(searchTerm) => setRoleSearchTerm(searchTerm)}
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
            </React.Fragment>
          )}
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
