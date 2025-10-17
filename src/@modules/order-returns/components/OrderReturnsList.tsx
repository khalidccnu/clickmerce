import BaseModalWithoutClicker from '@base/components/BaseModalWithoutClicker';
import { ENUM_SORT_ORDER_TYPES } from '@base/enums';
import { Dayjs } from '@lib/constant/dayjs';
import { Paths } from '@lib/constant/paths';
import type { PaginationProps, TableColumnsType } from 'antd';
import { Button, Space, Table } from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { AiFillEye } from 'react-icons/ai';
import { IOrderReturn } from '../lib/interfaces';
import OrderReturnsView from './OrderReturnsView';

interface IProps {
  isLoading: boolean;
  data: IOrderReturn[];
  pagination: PaginationProps;
}

const OrderReturnsList: React.FC<IProps> = ({ isLoading, data, pagination }) => {
  const router = useRouter();
  const [viewItem, setViewItem] = useState<IOrderReturn>(null);

  const dataSource = data?.map((elem) => ({
    key: elem?.id,
    id: elem?.id,
    code: elem?.code,
    order: elem?.order,
    products: elem?.products,
    is_active: elem?.is_active,
    created_at: elem?.created_at,
    created_by: elem?.created_by,
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
      title: 'History',
      render: (_, record) =>
        `${record?.created_by?.name} (${dayjs(record?.created_at).format(Dayjs.dateTimeSecondsWithAmPm)})`,
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
          </Space>
        );
      },
    },
  ];

  return (
    <React.Fragment>
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
        <OrderReturnsView orderReturn={viewItem} />
      </BaseModalWithoutClicker>
    </React.Fragment>
  );
};

export default OrderReturnsList;
