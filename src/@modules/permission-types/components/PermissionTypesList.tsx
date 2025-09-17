import CustomSwitch from '@base/components/CustomSwitch';
import { getAccess } from '@modules/auth/lib/utils/client';
import type { PaginationProps, TableColumnsType } from 'antd';
import { Button, Drawer, Form, message, Table } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { AiFillEdit } from 'react-icons/ai';
import { PermissionTypesHooks } from '../lib/hooks';
import { IPermissionType } from '../lib/interfaces';
import PermissionTypesForm from './PermissionTypesForm';

interface IProps {
  isLoading: boolean;
  data: IPermissionType[];
  pagination: PaginationProps;
}

const PermissionTypesList: React.FC<IProps> = ({ isLoading, data, pagination }) => {
  const [messageApi, messageHolder] = message.useMessage();
  const [formInstance] = Form.useForm();
  const [updateItem, setUpdateItem] = useState<IPermissionType>(null);

  const permissionTypeUpdateFn = PermissionTypesHooks.useUpdate({
    config: {
      onSuccess: (res) => {
        if (!res.success) {
          messageApi.error(res.message);
          return;
        }

        setUpdateItem(null);
        messageApi.success(res.message);
      },
    },
  });

  const dataSource = data?.map((elem) => ({
    key: elem?.id,
    id: elem?.id,
    name: elem?.name,
    is_active: elem?.is_active,
    created_at: elem?.created_at,
  }));

  const columns: TableColumnsType<(typeof dataSource)[number]> = [
    {
      key: 'name',
      dataIndex: 'name',
      title: 'Name',
    },
    {
      key: 'created_at',
      dataIndex: 'created_at',
      title: 'Created At',
      render: (created_at) => <p className="min-w-24">{dayjs(created_at).format('DD-MM-YYYY')}</p>,
    },
    {
      key: 'is_active',
      dataIndex: 'is_active',
      title: 'Active',
      render: (is_active, record) => {
        return (
          <CustomSwitch
            checked={is_active}
            onChange={(checked) => {
              getAccess({
                allowedPermissions: ['permission_types:update'],
                func: () => {
                  permissionTypeUpdateFn.mutate({
                    id: record?.id,
                    data: {
                      is_active: checked.toString(),
                    },
                  });
                },
              });
            }}
          />
        );
      },
    },
    {
      key: 'id',
      dataIndex: 'id',
      title: 'Action',
      render: (id) => (
        <Button
          type="primary"
          onClick={() => {
            getAccess({
              allowedPermissions: ['permission_types:update'],
              func: () => {
                const item = data?.find((item) => item.id === id);
                setUpdateItem(item);
              },
            });
          }}
          ghost
        >
          <AiFillEdit />
        </Button>
      ),
    },
  ];

  return (
    <React.Fragment>
      {messageHolder}
      <Table
        loading={isLoading}
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        scroll={{ x: true }}
      />
      <Drawer
        width={450}
        title={`Update ${updateItem?.name}`}
        open={!!updateItem?.id}
        onClose={() => setUpdateItem(null)}
      >
        <PermissionTypesForm
          formType="update"
          form={formInstance}
          initialValues={{ ...updateItem, is_active: updateItem?.is_active?.toString() }}
          isLoading={permissionTypeUpdateFn.isPending}
          onFinish={(values) =>
            permissionTypeUpdateFn.mutate({
              id: updateItem?.id,
              data: values,
            })
          }
        />
      </Drawer>
    </React.Fragment>
  );
};

export default PermissionTypesList;
