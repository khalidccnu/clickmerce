import CustomSwitch from '@base/components/CustomSwitch';
import { Dayjs } from '@lib/constant/dayjs';
import { Toolbox } from '@lib/utils/toolbox';
import { getAccess } from '@modules/auth/lib/utils/client';
import type { PaginationProps, TableColumnsType } from 'antd';
import { Button, Drawer, Form, Table, message } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { AiFillEdit } from 'react-icons/ai';
import { DeliveryZonesHooks } from '../lib/hooks';
import { IDeliveryZone } from '../lib/interfaces';
import DeliveryZonesForm from './DeliveryZonesForm';

interface IProps {
  isLoading: boolean;
  data: IDeliveryZone[];
  pagination: PaginationProps;
}

const DeliveryZonesList: React.FC<IProps> = ({ isLoading, data, pagination }) => {
  const [messageApi, messageHolder] = message.useMessage();
  const [formInstance] = Form.useForm();
  const [updateItem, setUpdateItem] = useState<IDeliveryZone>(null);

  const deliveryZoneUpdateFn = DeliveryZonesHooks.useUpdate({
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
    delivery_service_type: elem?.delivery_service_type,
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
      key: 'delivery_service_type',
      dataIndex: ['delivery_service_type', 'name'],
      title: 'Delivery Service Type',
    },
    {
      key: 'charge',
      dataIndex: ['delivery_service_type', 'amount'],
      title: 'Delivery Charge',
      render: (amount) => Toolbox.withCurrency(amount),
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
                allowedPermissions: ['delivery_service_types:update'],
                func: () => {
                  deliveryZoneUpdateFn.mutate({
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
          <Button
            type="primary"
            onClick={() => {
              getAccess({
                allowedPermissions: ['delivery_service_types:update'],
                func: () => setUpdateItem(item),
              });
            }}
            ghost
          >
            <AiFillEdit />
          </Button>
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
        <DeliveryZonesForm
          formType="update"
          form={formInstance}
          initialValues={{
            ...updateItem,
            is_active: updateItem?.is_active?.toString(),
          }}
          isLoading={deliveryZoneUpdateFn.isPending}
          onFinish={(values) =>
            deliveryZoneUpdateFn.mutate({
              id: updateItem?.id,
              data: values,
            })
          }
        />
      </Drawer>
    </React.Fragment>
  );
};

export default DeliveryZonesList;
