import CustomSwitch from '@base/components/CustomSwitch';
import { Dayjs } from '@lib/constant/dayjs';
import { Toolbox } from '@lib/utils/toolbox';
import { getAccess } from '@modules/auth/lib/utils/client';
import type { PaginationProps, TableColumnsType } from 'antd';
import { Button, Drawer, Form, Popconfirm, Space, Table, message } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import { PaymentMethodsHooks } from '../lib/hooks';
import { IPaymentMethod } from '../lib/interfaces';
import PaymentMethodsForm from './PaymentMethodsForm';

interface IProps {
  isLoading: boolean;
  data: IPaymentMethod[];
  pagination: PaginationProps;
}

const PaymentMethodsList: React.FC<IProps> = ({ isLoading, data, pagination }) => {
  const [messageApi, messageHolder] = message.useMessage();
  const [formInstance] = Form.useForm();
  const [updateItem, setUpdateItem] = useState<IPaymentMethod>(null);

  const paymentMethodUpdateFn = PaymentMethodsHooks.useUpdate({
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

  const paymentMethodDeleteFn = PaymentMethodsHooks.useDelete({
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

  const dataSource = data?.map((elem) => ({
    key: elem?.id,
    id: elem?.id,
    name: elem?.name,
    type: elem?.type,
    reference_type: elem?.reference_type,
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
      key: 'type',
      dataIndex: 'type',
      title: 'Type',
      render: (type) => Toolbox.toPrettyText(type),
    },
    {
      key: 'reference_type',
      dataIndex: 'reference_type',
      title: 'Reference Type',
      render: (reference_type) => Toolbox.toPrettyText(reference_type),
    },
    {
      key: 'created_at',
      dataIndex: 'created_at',
      title: 'Created At',
      render: (created_at) => dayjs(created_at).format(Dayjs.dateTimeSecondsWithAmPm),
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
                allowedPermissions: ['payment_methods:update'],
                func: () => {
                  paymentMethodUpdateFn.mutate({
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
      align: 'center',
      render: (id) => {
        const item = data?.find((item) => item.id === id);

        return (
          <Space>
            <Button
              type="primary"
              onClick={() => {
                getAccess({
                  allowedPermissions: ['payment_methods:update'],
                  func: () => setUpdateItem(item),
                });
              }}
              ghost
            >
              <AiFillEdit />
            </Button>
            <Popconfirm
              title="Are you sure to delete this payment method?"
              onConfirm={() => {
                getAccess({
                  allowedPermissions: ['payment_methods:delete'],
                  func: () => paymentMethodDeleteFn.mutate(id),
                });
              }}
            >
              <Button type="primary" danger ghost>
                <AiFillDelete />
              </Button>
            </Popconfirm>
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
        width={640}
        title={`Update ${updateItem?.name}`}
        open={!!updateItem?.id}
        onClose={() => setUpdateItem(null)}
      >
        <PaymentMethodsForm
          formType="update"
          form={formInstance}
          initialValues={{
            ...updateItem,
            is_default: updateItem?.is_default?.toString(),
            is_active: updateItem?.is_active?.toString(),
          }}
          isLoading={paymentMethodUpdateFn.isPending}
          onFinish={(values) =>
            paymentMethodUpdateFn.mutate({
              id: updateItem?.id,
              data: values,
            })
          }
        />
      </Drawer>
    </React.Fragment>
  );
};

export default PaymentMethodsList;
