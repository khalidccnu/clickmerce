import BaseModalWithoutClicker from '@base/components/BaseModalWithoutClicker';
import { Dayjs } from '@lib/constant/dayjs';
import { Toolbox } from '@lib/utils/toolbox';
import { Button, PaginationProps, Space, Table, TableColumnsType, Typography } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { AiFillEye } from 'react-icons/ai';
import { ITransaction } from '../lib/interfaces';
import TransactionsView from './TransactionsView';

interface IProps {
  isLoading: boolean;
  data: ITransaction[];
  pagination: PaginationProps;
}

const TransactionsList: React.FC<IProps> = ({ isLoading, data, pagination }) => {
  // const [messageApi, messageHolder] = message.useMessage();
  // const [formInstance] = Form.useForm();
  const [viewItem, setViewItem] = useState<ITransaction>(null);
  // const [updateItem, setUpdateItem] = useState<ITransaction>(null);

  // const transactionUpdateFn = TransactionsHooks.useUpdate({
  //   config: {
  //     onSuccess: (res) => {
  //       if (!res.success) {
  //         messageApi.error(res.message);
  //         return;
  //       }

  //       setUpdateItem(null);
  //       messageApi.success(res.message);
  //     },
  //   },
  // });

  // const transactionDeleteFn = TransactionsHooks.useDelete({
  //   config: {
  //     onSuccess: (res) => {
  //       if (!res.success) {
  //         messageApi.error(res.message);
  //         return;
  //       }

  //       messageApi.success(res.message);
  //     },
  //   },
  // });

  const dataSource = data?.map((elem) => ({
    key: elem?.id,
    id: elem?.id,
    code: elem?.code,
    type: elem?.type,
    amount: elem?.amount,
    note: elem?.note,
    user: elem?.user,
    created_by: elem?.created_by,
    is_active: elem?.is_active,
    created_at: elem?.created_at,
  }));

  const columns: TableColumnsType<(typeof dataSource)[number]> = [
    {
      key: 'code',
      dataIndex: 'code',
      title: 'Code',
    },
    {
      key: 'type',
      dataIndex: 'type',
      title: 'Type',
      render: (type) => Toolbox.toPrettyText(type),
    },
    {
      key: 'amount',
      dataIndex: 'amount',
      title: 'Amount',
      render: (amount) => Toolbox.withCurrency(amount),
    },
    {
      key: 'note',
      dataIndex: 'note',
      title: 'Note',
      render: (note) => (
        <Typography.Paragraph ellipsis={{ rows: 3, expandable: true }} style={{ marginBottom: 0 }}>
          {note || 'N/A'}
        </Typography.Paragraph>
      ),
    },
    {
      key: 'created_at',
      dataIndex: 'created_at',
      title: 'Created At',
      render: (created_at) => dayjs(created_at).format(Dayjs.dateTimeSecondsWithAmPm),
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
            <Button type="dashed" onClick={() => setViewItem(item)}>
              <AiFillEye />
            </Button>
            {/* <Button
              type="primary"
              onClick={() => {
                getAccess({
                  allowedPermissions: ['transactions:update'],
                  func: () => setUpdateItem(item),
                });
              }}
              ghost
            >
              <AiFillEdit />
            </Button>
            <Popconfirm
              title="Are you sure to delete this transaction?"
              onConfirm={() => {
                getAccess({
                  allowedPermissions: ['transactions:delete'],
                  func: () => transactionDeleteFn.mutate(id),
                });
              }}
            >
              <Button type="primary" danger ghost>
                <AiFillDelete />
              </Button>
            </Popconfirm> */}
          </Space>
        );
      },
    },
  ];

  return (
    <React.Fragment>
      {/* {messageHolder} */}
      <Table
        loading={isLoading}
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        scroll={{ x: true }}
      />
      <BaseModalWithoutClicker
        width={640}
        title={viewItem?.code}
        open={!!viewItem?.id}
        onCancel={() => setViewItem(null)}
        footer={null}
      >
        <TransactionsView transaction={viewItem} />
      </BaseModalWithoutClicker>
      {/* <Drawer
        width={640}
        title={`Update ${updateItem?.code}`}
        open={!!updateItem?.id}
        onClose={() => setUpdateItem(null)}
      >
        <TransactionsForm
          formType="update"
          form={formInstance}
          initialValues={updateItem}
          isLoading={transactionUpdateFn.isPending}
          onFinish={(values) =>
            transactionUpdateFn.mutate({
              id: updateItem?.id,
              data: values,
            })
          }
        />
      </Drawer> */}
    </React.Fragment>
  );
};

export default TransactionsList;
