import BaseModalWithoutClicker from '@base/components/BaseModalWithoutClicker';
import CustomSwitch from '@base/components/CustomSwitch';
import { Dayjs } from '@lib/constant/dayjs';
import { getAccess } from '@modules/auth/lib/utils/client';
import {
  Button,
  Drawer,
  Form,
  PaginationProps,
  Popconfirm,
  Rate,
  Space,
  Table,
  TableColumnsType,
  Typography,
  message,
} from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { AiFillDelete, AiFillEdit, AiFillEye } from 'react-icons/ai';
import { ReviewsHooks } from '../lib/hooks';
import { IReview } from '../lib/interfaces';
import ReviewsForm from './ReviewsForm';
import ReviewsView from './ReviewsView';

interface IProps {
  isLoading: boolean;
  data: IReview[];
  pagination: PaginationProps;
}

const ReviewsList: React.FC<IProps> = ({ isLoading, data, pagination }) => {
  const [messageApi, messageHolder] = message.useMessage();
  const [formInstance] = Form.useForm();
  const [viewItem, setViewItem] = useState<IReview>(null);
  const [updateItem, setUpdateItem] = useState<IReview>(null);

  const reviewUpdateFn = ReviewsHooks.useUpdate({
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

  const reviewDeleteFn = ReviewsHooks.useDelete({
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
    user: elem?.user,
    product: elem?.product,
    rate: elem?.rate,
    comment: elem?.comment,
    image: elem?.image,
    is_active: elem?.is_active,
    created_at: elem?.created_at,
  }));

  const columns: TableColumnsType<(typeof dataSource)[number]> = [
    {
      key: 'name',
      dataIndex: ['user', 'name'],
      title: 'Customer',
      render: (name, record) => `${name} (${record?.user?.phone})`,
    },
    {
      key: 'product',
      dataIndex: ['product', 'name'],
      title: 'Product',
      render: (product) => product || 'N/A',
    },
    {
      key: 'rate',
      dataIndex: 'rate',
      title: 'Rate',
      render: (rate) => <Rate disabled allowHalf value={rate} />,
    },
    {
      key: 'comment',
      dataIndex: 'comment',
      title: 'Comment',
      render: (comment) => (
        <Typography.Paragraph ellipsis={{ rows: 3, expandable: true }} style={{ marginBottom: 0 }}>
          {comment}
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
      key: 'is_active',
      dataIndex: 'is_active',
      title: 'Active',
      render: (is_active, record) => {
        return (
          <CustomSwitch
            checked={is_active}
            onChange={(checked) => {
              getAccess({
                allowedPermissions: ['reviews:update'],
                func: () => {
                  reviewUpdateFn.mutate({
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
                  allowedPermissions: ['reviews:update'],
                  func: () => setUpdateItem(item),
                });
              }}
              ghost
            >
              <AiFillEdit />
            </Button>
            <Popconfirm
              title="Are you sure to delete this review?"
              onConfirm={() => {
                getAccess({
                  allowedPermissions: ['reviews:delete'],
                  func: () => reviewDeleteFn.mutate(id),
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
        title={viewItem?.product?.name || viewItem?.user?.name}
        open={!!viewItem?.id}
        onCancel={() => setViewItem(null)}
        footer={null}
      >
        <ReviewsView review={viewItem} />
      </BaseModalWithoutClicker>
      <Drawer
        width={640}
        title={`Update ${updateItem?.product?.name || updateItem?.user?.name}`}
        open={!!updateItem?.id}
        onClose={() => setUpdateItem(null)}
      >
        <ReviewsForm
          formType="update"
          form={formInstance}
          initialValues={{
            ...updateItem,
            is_active: updateItem?.is_active?.toString(),
          }}
          isLoading={reviewUpdateFn.isPending}
          onFinish={(values) =>
            reviewUpdateFn.mutate({
              id: updateItem?.id,
              data: values,
            })
          }
        />
      </Drawer>
    </React.Fragment>
  );
};

export default ReviewsList;
