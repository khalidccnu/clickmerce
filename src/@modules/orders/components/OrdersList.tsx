import { Env } from '.environments';
import BaseModalWithoutClicker from '@base/components/BaseModalWithoutClicker';
import { TId } from '@base/interfaces';
import { Dayjs } from '@lib/constant/dayjs';
import { Toolbox } from '@lib/utils/toolbox';
import { getAccess } from '@modules/auth/lib/utils/client';
import { SettingsHooks } from '@modules/settings/lib/hooks';
import { pdf } from '@react-pdf/renderer';
import type { PaginationProps, TableColumnsType } from 'antd';
import { Button, Drawer, Dropdown, Form, message, Space, Table } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { AiFillEye } from 'react-icons/ai';
import { BiCaretDown } from 'react-icons/bi';
import { FaEdit } from 'react-icons/fa';
import { IoReturnUpBack } from 'react-icons/io5';
import { TbInvoice, TbReceipt, TbTruckDelivery } from 'react-icons/tb';
import { ENUM_ORDER_STATUS_TYPES } from '../lib/enums';
import { OrdersHooks } from '../lib/hooks';
import { IOrder } from '../lib/interfaces';
import Invoice from './Invoice';
import OrdersPayForm from './OrdersPayForm';
import OrdersReturnForm from './OrdersReturnForm';
import OrdersStatusForm from './OrdersStatusForm';
import OrdersStatusTracker from './OrdersStatusTracker';
import OrdersView from './OrdersView';
import Receipt from './Receipt';

interface IProps {
  isLoading: boolean;
  data: IOrder[];
  pagination: PaginationProps;
}

const OrdersList: React.FC<IProps> = ({ isLoading, data, pagination }) => {
  const [messageApi, messageHolder] = message.useMessage();
  const [payFormInstance] = Form.useForm();
  const [updateFormInstance] = Form.useForm();
  const [payItem, setPayItem] = useState<IOrder>(null);
  const [viewItem, setViewItem] = useState<IOrder>(null);
  const [updateItem, setUpdateItem] = useState<IOrder>(null);
  const [returnItem, setReturnItem] = useState<IOrder>(null);
  const [statusTrackerItem, setStatusTrackerItem] = useState<IOrder>(null);
  const [orderLoadingId, setOrderLoadingId] = useState<TId>(null);

  const handlePdfFn = async (type: 'INVOICE' | 'RECEIPT', order: IOrder) => {
    try {
      const products = order?.products
        ?.flatMap((product) =>
          (product?.variations || []).map((variation) => ({
            name: product?.current_info?.name,
            specification: product?.current_info?.specification,
            salePrice: variation?.sale_price,
            saleDiscountPrice: variation?.sale_discount_price,
            quantity: variation?.quantity,
            mfg: variation?.mfg,
            exp: variation?.exp,
            color: variation?.color,
            size: variation?.size,
            weight: variation?.weight,
          })),
        )
        .filter(Boolean);

      const props = {
        webLogo: settingsQuery.data?.data?.identity?.logo_url || Env.webBrandLogo,
        webTitle: settingsQuery.data?.data?.identity?.name || Env.webTitle,
        moneyReceiptDate: dayjs(order.created_at).format(Dayjs.dateTimeSecondsWithAmPm),
        trxId: order?.code,
        customerName: order?.customer?.name,
        phone: order?.customer?.phone,
        products,
        coupon: 0,
        discount: order?.redeem_amount,
        vat: order?.vat_amount,
        vatPercent: 0,
        tax: order?.tax_amount,
        taxPercent: 0,
        deliveryCharge: order?.delivery_charge,
        subTotal: order?.sub_total_amount,
        roundOff: order?.round_off_amount,
        grandTotal: order?.grand_total_amount,
        paymentStatus: order?.payment_status,
        receivedBy: order?.created_by?.name,
      };

      let blob: Blob;

      if (type === 'INVOICE') {
        blob = await pdf(
          <Invoice
            order={{ ...props, streetAddress: order?.street_address, deliveryZone: order?.delivery_zone?.name }}
          />,
        ).toBlob();
      } else {
        blob = await pdf(<Receipt type="PRINT" order={props} />).toBlob();
      }

      Toolbox.printWindow('pdf', URL.createObjectURL(blob));
    } catch (error) {
      messageApi.error('Failed to generate receipt preview. Please try again.');
    } finally {
      setOrderLoadingId(null);
    }
  };

  const settingsQuery = SettingsHooks.useFind();

  const orderUpdateFn = OrdersHooks.useUpdate({
    config: {
      onSuccess: (res) => {
        if (!res.success) {
          messageApi.error(res.message);
          return;
        }

        setPayItem(null);
        setUpdateItem(null);
        messageApi.success(res.message);
      },
    },
  });

  const orderReturnFn = OrdersHooks.useReturn({
    config: {
      onSuccess: (res) => {
        if (!res.success) {
          messageApi.error(res.message);
          return;
        }

        setReturnItem(null);
        messageApi.success(res.message);
      },
    },
  });

  const dataSource = data?.map((elem) => ({
    key: elem?.id,
    id: elem?.id,
    code: elem?.code,
    customer: elem?.customer,
    products: elem?.products,
    redeem_amount: elem?.redeem_amount,
    vat_amount: elem?.vat_amount,
    tax_amount: elem?.tax_amount,
    delivery_charge: elem?.delivery_charge,
    pay_amount: elem?.pay_amount,
    due_amount: elem?.due_amount,
    sub_total_amount: elem?.sub_total_amount,
    grand_total_amount: elem?.grand_total_amount,
    round_off_amount: elem?.round_off_amount,
    street_address: elem?.street_address,
    payment_method: elem?.payment_method,
    delivery_zone: elem?.delivery_zone,
    payment_status: elem?.payment_status,
    status: elem?.status,
    is_active: elem?.is_active,
    created_at: elem?.created_at,
    created_by: elem?.created_by,
    updated_at: elem?.updated_at,
    updated_by: elem?.updated_by,
  }));

  const columns: TableColumnsType<(typeof dataSource)[number]> = [
    {
      key: 'code',
      dataIndex: 'code',
      title: 'Code',
    },
    {
      key: 'name',
      dataIndex: ['customer', 'name'],
      title: 'Customer',
      render: (name, record) => `${name} (${record?.customer?.phone})`,
    },
    {
      key: 'pay_amount',
      dataIndex: 'pay_amount',
      title: 'Pay Amount',
      render: (pay_amount) => Toolbox.withCurrency(pay_amount),
    },
    {
      key: 'due_amount',
      dataIndex: 'due_amount',
      title: 'Due Amount',
      render: (due_amount) => Toolbox.withCurrency(due_amount),
    },
    {
      key: 'grand_total_amount',
      dataIndex: 'grand_total_amount',
      title: 'Grand Amount',
      render: (grand_total_amount) => Toolbox.withCurrency(grand_total_amount),
    },
    {
      key: 'payment_status',
      dataIndex: 'payment_status',
      title: 'Payment Status',
      render: (payment_status) => Toolbox.toPrettyText(payment_status),
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: 'Status',
      render: (status) => Toolbox.toPrettyText(status),
    },
    // {
    //   key: 'created_at',
    //   dataIndex: 'created_at',
    //   title: 'Created At',
    //   render: (_, record) => {
    //     return (
    //       <React.Fragment>
    //         {record?.created_at && (
    //           <div className="flex justify-between gap-2">
    //             <p className="font-medium">Created At:</p>
    //             <p className="text-end">{dayjs(record?.created_at).format(Dayjs.dateTimeSecondsWithAmPm)}</p>
    //           </div>
    //         )}

    //         {record?.created_by && (
    //           <div className="flex justify-between gap-2">
    //             <p className="font-medium">Created By:</p>
    //             <p className="text-end">{record?.created_by?.name}</p>
    //           </div>
    //         )}

    //         {record?.updated_at && record?.updated_by && (
    //           <div className="flex justify-between gap-2">
    //             <p className="font-medium">Updated At:</p>
    //             <p className="text-end">{dayjs(record?.updated_at).format(Dayjs.dateTimeSecondsWithAmPm)}</p>
    //           </div>
    //         )}

    //         {record?.updated_by && (
    //           <div className="flex justify-between gap-2">
    //             <p className="font-medium">Updated By:</p>
    //             <p className="text-end">{record?.updated_by?.name}</p>
    //           </div>
    //         )}
    //       </React.Fragment>
    //     );
    //   },
    // },
    {
      key: 'id',
      dataIndex: 'id',
      title: 'Action',
      align: 'center',
      render: (id, record) => {
        const item = data?.find((item) => item.id === id);

        return (
          <Space>
            {!record?.due_amount || (
              <Button
                disabled={record?.status === ENUM_ORDER_STATUS_TYPES.CANCELLED}
                type="primary"
                onClick={() => {
                  getAccess({
                    allowedPermissions: ['orders:update'],
                    func: () => {
                      setPayItem(item);
                    },
                  });
                }}
              >
                Pay
              </Button>
            )}
            <Button type="dashed" onClick={() => setViewItem(item)}>
              <AiFillEye />
            </Button>
            <Dropdown
              placement="bottomRight"
              menu={{
                items: [
                  {
                    key: 'receipt',
                    icon: <TbReceipt />,
                    onClick: () => {
                      setOrderLoadingId(id);
                      handlePdfFn('RECEIPT', item);
                    },
                    label: 'Receipt',
                  },
                  {
                    key: 'invoice',
                    icon: <TbInvoice />,
                    onClick: () => {
                      setOrderLoadingId(id);
                      handlePdfFn('INVOICE', item);
                    },
                    label: 'Invoice',
                  },
                  {
                    key: 'track',
                    icon: <TbTruckDelivery />,
                    onClick: () => setStatusTrackerItem(item),
                    label: 'Track',
                  },
                  {
                    key: 'status',
                    icon: <FaEdit />,
                    onClick: () => {
                      getAccess({
                        allowedPermissions: ['orders:update'],
                        func: () => setUpdateItem(item),
                      });
                    },
                    label: 'Status',
                    disabled: record?.status === ENUM_ORDER_STATUS_TYPES.CANCELLED,
                  },
                  {
                    key: 'return',
                    icon: <IoReturnUpBack />,
                    onClick: () => {
                      getAccess({
                        allowedPermissions: ['order_returns:write'],
                        func: () => setReturnItem(item),
                      });
                    },
                    label: 'Return',
                    disabled: record?.status !== ENUM_ORDER_STATUS_TYPES.DELIVERED,
                  },
                ],
              }}
              trigger={['click']}
            >
              <Button loading={orderLoadingId === id} icon={<BiCaretDown />}>
                Action
              </Button>
            </Dropdown>
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
        <OrdersView order={viewItem} />
      </BaseModalWithoutClicker>
      <Drawer
        width={640}
        title={`Status Tracking (${statusTrackerItem?.code})`}
        open={!!statusTrackerItem?.id}
        onClose={() => setStatusTrackerItem(null)}
      >
        <OrdersStatusTracker order={statusTrackerItem} />
      </Drawer>
      <BaseModalWithoutClicker
        destroyOnHidden
        width={540}
        title={`Make Payment for ${payItem?.code}`}
        footer={null}
        open={!!payItem?.id}
        onCancel={() => setPayItem(null)}
      >
        <OrdersPayForm
          form={payFormInstance}
          initialValues={payItem}
          isLoading={orderUpdateFn.isPending}
          onFinish={(values) =>
            orderUpdateFn.mutate({
              id: payItem?.id,
              data: values,
            })
          }
        />
      </BaseModalWithoutClicker>
      <BaseModalWithoutClicker
        destroyOnHidden
        width={540}
        title={`Change Status for ${updateItem?.code}`}
        footer={null}
        open={!!updateItem?.id}
        onCancel={() => setUpdateItem(null)}
      >
        <OrdersStatusForm
          form={updateFormInstance}
          initialValues={{ status: updateItem?.status }}
          isLoading={orderUpdateFn.isPending}
          onFinish={(values) =>
            orderUpdateFn.mutate({
              id: updateItem?.id,
              data: values,
            })
          }
        />
      </BaseModalWithoutClicker>
      <BaseModalWithoutClicker
        destroyOnHidden
        width={720}
        title={`Return for ${returnItem?.customer?.name} (${returnItem?.code})`}
        footer={null}
        open={!!returnItem?.id}
        onCancel={() => setReturnItem(null)}
      >
        <OrdersReturnForm
          isLoading={orderReturnFn.isPending}
          initialValues={returnItem}
          onFinish={(values) => {
            orderReturnFn.mutate({
              id: returnItem?.id,
              data: values,
            });
          }}
        />
      </BaseModalWithoutClicker>
    </React.Fragment>
  );
};

export default OrdersList;
