import BaseModalWithoutClicker from '@base/components/BaseModalWithoutClicker';
import CustomSwitch from '@base/components/CustomSwitch';
import { Dayjs } from '@lib/constant/dayjs';
import { Toolbox } from '@lib/utils/toolbox';
import { getAccess } from '@modules/auth/lib/utils/client';
import type { PaginationProps, TableColumnsType } from 'antd';
import { Button, Drawer, Form, Space, Table, message } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { AiFillEdit, AiFillEye } from 'react-icons/ai';
import { ENUM_COUPON_TYPES } from '../lib/enums';
import { CouponsHooks } from '../lib/hooks';
import { ICoupon } from '../lib/interfaces';
import CouponsForm from './CouponsForm';
import CouponsView from './CouponsView';

interface IProps {
  isLoading: boolean;
  data: ICoupon[];
  pagination: PaginationProps;
}

const CouponsList: React.FC<IProps> = ({ isLoading, data, pagination }) => {
  const [messageApi, messageHolder] = message.useMessage();
  const [formInstance] = Form.useForm();
  const [viewItem, setViewItem] = useState<ICoupon>(null);
  const [updateItem, setUpdateItem] = useState<ICoupon>(null);

  const couponUpdateFn = CouponsHooks.useUpdate({
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
    code: elem?.code,
    type: elem?.type,
    amount: elem?.amount,
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
      render: (amount, record) =>
        record?.type === ENUM_COUPON_TYPES.FIXED ? Toolbox.withCurrency(amount) : amount + '%',
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
                allowedPermissions: ['coupons:update'],
                func: () => {
                  couponUpdateFn.mutate({
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
            <Button type="dashed" onClick={() => setViewItem(item)}>
              <AiFillEye />
            </Button>
            <Button
              type="primary"
              onClick={() => {
                getAccess({
                  allowedPermissions: ['coupons:update'],
                  func: () => setUpdateItem(item),
                });
              }}
              ghost
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
      <BaseModalWithoutClicker
        width={640}
        title={viewItem?.code}
        open={!!viewItem?.id}
        onCancel={() => setViewItem(null)}
        footer={null}
      >
        <CouponsView data={viewItem} />
      </BaseModalWithoutClicker>
      <Drawer
        width={640}
        title={`Update ${updateItem?.code}`}
        open={!!updateItem?.id}
        onClose={() => setUpdateItem(null)}
      >
        <CouponsForm
          formType="update"
          form={formInstance}
          initialValues={{
            ...updateItem,
            is_active: updateItem?.is_active?.toString(),
          }}
          isLoading={couponUpdateFn.isPending}
          onFinish={(values) =>
            couponUpdateFn.mutate({
              id: updateItem?.id,
              data: values,
            })
          }
        />
      </Drawer>
    </React.Fragment>
  );
};

export default CouponsList;
