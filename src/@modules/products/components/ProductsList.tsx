import BaseModalWithoutClicker from '@base/components/BaseModalWithoutClicker';
import CustomSwitch from '@base/components/CustomSwitch';
import { Dayjs } from '@lib/constant/dayjs';
import { getAccess } from '@modules/auth/lib/utils/client';
import type { PaginationProps, TableColumnsType } from 'antd';
import { Button, Drawer, Form, Space, Table, message } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { AiFillEdit, AiFillEye } from 'react-icons/ai';
import { ProductsHooks } from '../lib/hooks';
import { IProduct } from '../lib/interfaces';
import ProductsForm from './ProductsForm';
import ProductsView from './ProductsView';

interface IProps {
  isLoading: boolean;
  data: IProduct[];
  pagination: PaginationProps;
}

const ProductsList: React.FC<IProps> = ({ isLoading, data, pagination }) => {
  const [messageApi, messageHolder] = message.useMessage();
  const [formInstance] = Form.useForm();
  const [viewItem, setViewItem] = useState<IProduct>(null);
  const [updateItem, setUpdateItem] = useState<IProduct>(null);

  const productUpdateFn = ProductsHooks.useUpdate({
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
    slug: elem?.slug,
    type: elem?.type,
    specification: elem?.specification,
    supplier: elem?.supplier,
    quantity: elem?.quantity,
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
      key: 'specification',
      dataIndex: 'specification',
      title: 'Specification',
      render: (specification) => specification || 'N/A',
    },
    {
      key: 'supplier',
      dataIndex: ['supplier', 'name'],
      title: 'Supplier',
    },
    {
      key: 'quantity',
      dataIndex: 'quantity',
      title: 'Quantity',
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
                allowedPermissions: ['products:update'],
                func: () => {
                  productUpdateFn.mutate({
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
                  allowedPermissions: ['products:update'],
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
        title={viewItem?.name}
        open={!!viewItem?.id}
        onCancel={() => setViewItem(null)}
        footer={null}
      >
        <ProductsView data={viewItem} />
      </BaseModalWithoutClicker>
      <Drawer
        width={640}
        title={`Update ${updateItem?.name}`}
        open={!!updateItem?.id}
        onClose={() => setUpdateItem(null)}
      >
        <ProductsForm
          formType="update"
          form={formInstance}
          initialValues={{
            ...updateItem,
            generic_id: updateItem?.generic?.id,
            dosage_form_id: updateItem?.dosage_form?.id,
            supplier_id: updateItem?.supplier?.id,
            variations: updateItem?.variations?.map((variation) => ({
              id: variation?.id,
              cost_price: variation?.cost_price,
              sale_price: variation?.sale_price,
              mfg: variation?.mfg,
              exp: variation?.exp,
              color: variation?.color,
              size: variation?.size,
              quantity: variation?.quantity,
            })),
            is_active: updateItem?.is_active?.toString(),
          }}
          isLoading={productUpdateFn.isPending}
          onFinish={(values) =>
            productUpdateFn.mutate({
              id: updateItem?.id,
              data: values,
            })
          }
        />
      </Drawer>
    </React.Fragment>
  );
};

export default ProductsList;
