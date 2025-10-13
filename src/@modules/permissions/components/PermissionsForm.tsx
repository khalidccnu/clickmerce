import FloatSelect from '@base/antd/components/FloatSelect';
import InfiniteScrollSelect from '@base/components/InfiniteScrollSelect';
import { Permissions } from '@lib/constant/permissions';
import { PermissionTypesHooks } from '@modules/permission-types/lib/hooks';
import { Button, Col, Form, FormInstance, Radio, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { IPermissionType } from '../../permission-types/lib/interfaces';
import { PermissionsHooks } from '../lib/hooks';
import { IPermissionCreate } from '../lib/interfaces';

interface IProps {
  isLoading: boolean;
  form: FormInstance;
  formType?: 'create' | 'update';
  initialValues?: Partial<IPermissionCreate>;
  onFinish: (values: IPermissionCreate) => void;
}

const PermissionsForm: React.FC<IProps> = ({ isLoading, form, formType = 'create', initialValues, onFinish }) => {
  const [permissionTypesSearchTerm, setPermissionTypesSearchTerm] = useState(null);

  const permissionTypeQuery = PermissionTypesHooks.useFindById({
    id: initialValues?.permission_type_id,
    config: {
      queryKey: [],
      enabled: !!initialValues?.permission_type_id,
    },
  });

  const permissionTypesQuery = PermissionTypesHooks.useFindInfinite({
    options: {
      limit: '20',
      search_term: permissionTypesSearchTerm,
      search_field: 'name',
      is_active: 'true',
    },
  });

  const permissionsQuery = PermissionsHooks.useFind({
    options: {
      page: '1',
      limit: '500',
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
            <FloatSelect
              allowClear
              showSearch
              virtual={false}
              loading={permissionsQuery.isLoading}
              placeholder="Name"
              filterOption={(input, option: any) => option.label.toLowerCase().includes(input.toLowerCase())}
              options={Object.values(Permissions)
                .filter(
                  (permission) =>
                    !permissionsQuery.data?.data?.map((permission) => permission.name).includes(permission) ||
                    initialValues?.name === permission,
                )
                .map((permission) => ({
                  key: permission,
                  label: permission,
                  value: permission,
                }))}
            />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item
            name="permission_type_id"
            rules={[
              {
                required: true,
                message: 'Type is required!',
              },
            ]}
            className="!mb-0"
          >
            <InfiniteScrollSelect<IPermissionType>
              isFloat
              allowClear
              showSearch
              virtual={false}
              placeholder="Type"
              initialOptions={permissionTypeQuery.data?.data?.id ? [permissionTypeQuery.data?.data] : []}
              option={({ item: permissionType }) => ({
                key: permissionType?.id,
                label: permissionType?.name,
                value: permissionType?.id,
              })}
              onChangeSearchTerm={setPermissionTypesSearchTerm}
              query={permissionTypesQuery}
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
  );
};

export default PermissionsForm;
