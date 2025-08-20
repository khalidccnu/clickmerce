import InfiniteScrollSelect from '@base/components/InfiniteScrollSelect';
import { PermissionTypesHooks } from '@modules/permission-types/lib/hooks';
import { Form } from 'antd';
import React, { useEffect, useState } from 'react';
import { IPermissionType } from '../../permission-types/lib/interfaces';
import { IPermissionsFilter } from '../lib/interfaces';

interface IProps {
  initialValues: IPermissionsFilter;
  onChange: (values: IPermissionsFilter) => void;
}

const PermissionsFilter: React.FC<IProps> = ({ initialValues, onChange }) => {
  const [formInstance] = Form.useForm();
  const [permissionTypeSearchTerm, setPermissionTypeSearchTerm] = useState(null);

  const permissionTypeQuery = PermissionTypesHooks.useFindById({
    id: initialValues?.permission_type_id,
    config: {
      queryKey: [],
      enabled: !!initialValues?.permission_type_id,
    },
  });

  const permissionTypesQuery = PermissionTypesHooks.useFindInfinite({
    options: {
      limit: 20,
      search_term: permissionTypeSearchTerm,
      search_field: 'name',
    },
  });

  useEffect(() => {
    formInstance.resetFields();
    formInstance.setFieldsValue(initialValues);
  }, [formInstance, initialValues]);

  return (
    <div className="flex justify-end mb-4">
      <Form form={formInstance} onValuesChange={(values) => onChange(values)}>
        <Form.Item name="permission_type_id" className="!mb-0">
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
            onChangeSearchTerm={(searchTerm) => setPermissionTypeSearchTerm(searchTerm)}
            query={permissionTypesQuery}
            style={{ width: '13rem' }}
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default PermissionsFilter;
