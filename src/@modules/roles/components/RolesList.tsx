import CustomSwitch from '@base/components/CustomSwitch';
import { Paths } from '@lib/constant/paths';
import { Roles } from '@lib/constant/roles';
import { getAccess } from '@modules/auth/lib/utils';
import type { PaginationProps, TableColumnsType } from 'antd';
import { Button, Drawer, Form, message, Space, Table } from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { AiFillEdit } from 'react-icons/ai';
import { RolesHooks } from '../lib/hooks';
import { IRole } from '../lib/interfaces';
import RolesForm from './RolesForm';

interface IProps {
  isLoading: boolean;
  data: IRole[];
  pagination: PaginationProps;
}

const RolesList: React.FC<IProps> = ({ isLoading, data, pagination }) => {
  const router = useRouter();
  const [messageApi, messageHolder] = message.useMessage();
  const [formInstance] = Form.useForm();
  const [updateItem, setUpdateItem] = useState<IRole>(null);

  const roleUpdateFn = RolesHooks.useUpdate({
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
            disabled={record?.name === Roles.SUPER_ADMIN}
            checked={is_active}
            onChange={(checked) => {
              getAccess(['roles:update'], () => {
                roleUpdateFn.mutate({
                  id: record?.id,
                  data: {
                    is_active: checked.toString(),
                  },
                });
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
      render: (id, record) => {
        const isDisabled = record?.name === Roles.SUPER_ADMIN;

        return (
          <Space>
            <Button
              type="primary"
              ghost
              disabled={isDisabled}
              onClick={() => {
                getAccess(['roles:update'], () => {
                  const path = Paths.admin.roleManager.roles.toId(id);
                  router.push(path);
                });
              }}
            >
              Edit Permissions
            </Button>
            <Button
              disabled={isDisabled}
              type="primary"
              onClick={() => {
                getAccess(['roles:update'], () => {
                  const item = data?.find((item) => item.id === id);
                  setUpdateItem(item);
                });
              }}
            >
              <AiFillEdit />
            </Button>
          </Space>
        );
      },
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
        <RolesForm
          formType="update"
          form={formInstance}
          initialValues={{ ...updateItem, is_active: updateItem?.is_active?.toString() }}
          isLoading={roleUpdateFn.isPending}
          onFinish={(values) =>
            roleUpdateFn.mutate({
              id: updateItem?.id,
              data: values,
            })
          }
        />
      </Drawer>
    </React.Fragment>
  );
};

export default RolesList;
