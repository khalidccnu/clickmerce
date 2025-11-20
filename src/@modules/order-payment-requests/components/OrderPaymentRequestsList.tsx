import BaseModalWithoutClicker from '@base/components/BaseModalWithoutClicker';
import { ENUM_SORT_ORDER_TYPES } from '@base/enums';
import { Dayjs } from '@lib/constant/dayjs';
import { Paths } from '@lib/constant/paths';
import { getAccess } from '@modules/auth/lib/utils/client';
import type { PaginationProps, TableColumnsType } from 'antd';
import { Button, message, Popconfirm, Space, Table } from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { AiFillDelete, AiFillEye } from 'react-icons/ai';
import { OrderPaymentRequestsHooks } from '../lib/hooks';
import { IOrderPaymentRequest } from '../lib/interfaces';
import OrderPaymentRequestsView from './OrderPaymentRequestsView';

interface IProps {
  isLoading: boolean;
  data: IOrderPaymentRequest[];
  pagination: PaginationProps;
}

const OrderPaymentRequestsList: React.FC<IProps> = ({ isLoading, data, pagination }) => {
  const [messageApi, messageHolder] = message.useMessage();
  const router = useRouter();
  const [viewItem, setViewItem] = useState<IOrderPaymentRequest>(null);

  const orderPaymentRequestDeleteFn = OrderPaymentRequestsHooks.useDelete({
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
    code: elem?.code,
    payment_reference: elem?.payment_reference,
    order: elem?.order,
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
      key: 'name',
      dataIndex: ['order', 'customer', 'name'],
      title: 'Customer',
      render: (name, record) => `${name} (${record?.order?.customer?.phone})`,
    },
    {
      key: 'history',
      dataIndex: 'created_at',
      title: 'Requested At',
      render: (_, record) => dayjs(record?.created_at).format(Dayjs.dateTimeSecondsWithAmPm),
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
                router.push({
                  pathname: Paths.admin.sale.orders.list,
                  query: {
                    page: 1,
                    limit: 10,
                    sort_order: ENUM_SORT_ORDER_TYPES.DESC,
                    search_term: item?.order?.code,
                  },
                });
              }}
              ghost
            >
              Ref Order
            </Button>
            <Button type="dashed" onClick={() => setViewItem(item)}>
              <AiFillEye />
            </Button>
            <Popconfirm
              title="Are you sure to delete this order payment request?"
              onConfirm={() => {
                getAccess({
                  allowedPermissions: ['order_payment_requests:delete'],
                  func: () => orderPaymentRequestDeleteFn.mutate(id),
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
      <BaseModalWithoutClicker
        width={640}
        title={viewItem?.code}
        open={!!viewItem?.id}
        onCancel={() => setViewItem(null)}
        footer={null}
      >
        <OrderPaymentRequestsView orderPaymentRequest={viewItem} />
      </BaseModalWithoutClicker>
    </React.Fragment>
  );
};

export default OrderPaymentRequestsList;
