import FloatInputNumber from '@base/antd/components/FloatInputNumber';
import BaseModalWithoutClicker from '@base/components/BaseModalWithoutClicker';
import InfiniteScrollSelect from '@base/components/InfiniteScrollSelect';
import { TId } from '@base/interfaces';
import { useAppDispatch, useAppSelector } from '@lib/redux/hooks';
import { orderChangeAmountSnap } from '@lib/redux/order/orderSelector';
import { clearOrderFn, setCustomerId, setPayableAmount } from '@lib/redux/order/orderSlice';
import { cn } from '@lib/utils/cn';
import UsersForm from '@modules/users/components/UsersForm';
import { UsersHooks } from '@modules/users/lib/hooks';
import { IUser } from '@modules/users/lib/interfaces';
import { Button, Col, Form, message, Modal, Row, Space, Tag } from 'antd';
import React, { useState } from 'react';
import { FaShoppingBag, FaTrash, FaUserPlus } from 'react-icons/fa';
import OrderSummaryPrice from './OrderSummaryPrice';
import OrderSummaryProducts from './OrderSummaryProducts';

interface IProps {
  className?: string;
  invId: TId;
}

const OrderSummary: React.FC<IProps> = ({ className, invId }) => {
  const [messageApi, messageHolder] = message.useMessage();
  const [userFormInstance] = Form.useForm();
  const [usersSearchTerm, setUsersSearchTerm] = useState(null);
  const [isUserModalOpen, setUserModalOpen] = useState(false);
  const { customerId, cart, payableAmount } = useAppSelector((store) => store.orderSlice);
  const orderChangeAmount = useAppSelector(orderChangeAmountSnap);
  const dispatch = useAppDispatch();

  const handleClearOrderFn = () => {
    Modal.confirm({
      title: 'Clear Order',
      content: 'Are you sure you want to clear this order? This action cannot be undone.',
      okText: 'Yes, Clear',
      cancelText: 'Cancel',
      okType: 'danger',
      onOk: () => {
        dispatch(clearOrderFn());
        messageApi.success('Order cleared successfully');
      },
    });
  };

  const userCreateFn = UsersHooks.useCreate({
    config: {
      onSuccess: (res) => {
        if (!res.success) {
          messageApi.error(res.message);
          return;
        }

        dispatch(setCustomerId(res?.data?.id));
        setUserModalOpen(false);
        userFormInstance.resetFields();
        messageApi.success(res.message);
      },
    },
  });

  const userQuery = UsersHooks.useFindById({
    id: customerId,
    config: {
      queryKey: [],
      enabled: !!customerId,
    },
  });

  const usersQuery = UsersHooks.useFindInfinite({
    options: {
      limit: '20',
      search_term: usersSearchTerm,
      is_active: 'true',
      search_fields: ['name', 'phone', 'email'],
    },
  });

  return (
    <React.Fragment>
      {messageHolder}
      <div className={cn('order_summary', className)}>
        <div className="order_summary_header space-y-4 border-b border-gray-300 border-dotted pb-4 mb-4">
          <p className="font-semibold dark:text-white">Order Summary</p>
          <div className="flex items-center gap-2 justify-between">
            <Tag color="green">{invId}</Tag>
            <Button size="small" type="dashed" danger onClick={handleClearOrderFn}>
              <FaTrash />
            </Button>
          </div>
        </div>
        <div className="order_summary_wrapper">
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Space.Compact style={{ width: '100%' }} size="large">
                <InfiniteScrollSelect<IUser>
                  showSearch
                  virtual={false}
                  placeholder="Customer"
                  onChange={(value) => {
                    dispatch(setCustomerId(value));
                  }}
                  value={customerId ? [customerId] : []}
                  initialOptions={userQuery.data?.data?.id ? [userQuery.data?.data] : []}
                  option={({ item: user }) => ({
                    key: user?.id,
                    label: user?.name,
                    value: user?.id,
                  })}
                  onChangeSearchTerm={setUsersSearchTerm}
                  query={usersQuery}
                  style={{ width: '100%' }}
                />
                <Button type="primary" onClick={() => setUserModalOpen(true)}>
                  <FaUserPlus />
                </Button>
              </Space.Compact>
            </Col>
            <Col xs={24}>
              <OrderSummaryProducts className="border-y border-gray-300 border-dotted py-4" />
            </Col>
            <Col xs={24}>
              <OrderSummaryPrice className="border-b border-gray-300 border-dotted pb-4" />
            </Col>
            <Col xs={24} md={12}>
              <FloatInputNumber
                size="large"
                placeholder="Payable Amount"
                min={0}
                value={payableAmount}
                className="w-full"
                onChange={(value: number) => {
                  dispatch(setPayableAmount({ amount: value || 0 }));
                }}
              />
            </Col>
            <Col xs={24} md={12}>
              <FloatInputNumber
                size="large"
                placeholder="Change Amount"
                value={orderChangeAmount}
                className="w-full"
                readOnly
              />
            </Col>
            <Col xs={24}>
              <Button
                type="primary"
                size="large"
                block
                disabled={!invId || !customerId || !cart?.length}
                icon={<FaShoppingBag />}
              >
                Place Order
              </Button>
            </Col>
          </Row>
        </div>
      </div>
      <BaseModalWithoutClicker
        destroyOnHidden
        width={540}
        title="Create a new customer"
        footer={null}
        open={isUserModalOpen}
        onCancel={() => setUserModalOpen(false)}
      >
        <UsersForm
          form={userFormInstance}
          initialValues={{ is_admin: 'false', is_active: 'true' }}
          isLoading={userCreateFn.isPending}
          onFinish={(values) => userCreateFn.mutate(values)}
        />
      </BaseModalWithoutClicker>
    </React.Fragment>
  );
};

export default OrderSummary;
