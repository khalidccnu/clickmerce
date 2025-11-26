import { Env } from '.environments';
import FloatInputNumber from '@base/antd/components/FloatInputNumber';
import FloatSelect from '@base/antd/components/FloatSelect';
import FloatTextarea from '@base/antd/components/FloatTextarea';
import BaseModalWithoutClicker from '@base/components/BaseModalWithoutClicker';
import InfiniteScrollSelect from '@base/components/InfiniteScrollSelect';
import { Dayjs } from '@lib/constant/dayjs';
import { useAppDispatch, useAppSelector } from '@lib/redux/hooks';
import { orderChangeAmountSnap, orderGrandTotalSnap, orderRedeemSnap } from '@lib/redux/order/orderSelector';
import {
  clearOrderFn,
  setCustomerId,
  setDeliveryCharge,
  setDeliveryZoneId,
  setPayableAmount,
  setPaymentMethodId,
} from '@lib/redux/order/orderSlice';
import {
  loadOrderCustomerId,
  loadOrderInvId,
  loadOrderPaymentMethodId,
  loadOrderVatTax,
} from '@lib/redux/order/orderThunks';
import { cn } from '@lib/utils/cn';
import { Toolbox } from '@lib/utils/toolbox';
import { DeliveryZonesHooks } from '@modules/delivery-zones/lib/hooks';
import { IDeliveryZone } from '@modules/delivery-zones/lib/interfaces';
import Receipt from '@modules/orders/components/Receipt';
import { ENUM_ORDER_STATUS_TYPES, orderStatusTypes, TOrderStatusType } from '@modules/orders/lib/enums';
import { OrdersHooks } from '@modules/orders/lib/hooks';
import { IOrder } from '@modules/orders/lib/interfaces';
import { PaymentMethodsHooks } from '@modules/payment-methods/lib/hooks';
import { IPaymentMethod } from '@modules/payment-methods/lib/interfaces';
import { SettingsHooks } from '@modules/settings/lib/hooks';
import UsersForm from '@modules/users/components/UsersForm';
import { UsersHooks } from '@modules/users/lib/hooks';
import { IUser } from '@modules/users/lib/interfaces';
import { pdf } from '@react-pdf/renderer';
import { Alert, Button, Col, Form, message, Modal, Row, Space, Tag } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { FaShoppingBag, FaTrash, FaUserPlus } from 'react-icons/fa';
import { normalizeReceiptImageUrlFn } from '../lib/utils';
import OrderSummaryPrice from './OrderSummaryPrice';
import OrderSummaryProducts from './OrderSummaryProducts';

interface IProps {
  className?: string;
}

const OrderSummary: React.FC<IProps> = ({ className }) => {
  const [messageApi, messageHolder] = message.useMessage();
  const [modalApi, modalHolder] = Modal.useModal();
  const [userFormInstance] = Form.useForm();
  const [usersSearchTerm, setUsersSearchTerm] = useState(null);
  const [paymentMethodsSearchTerm, setPaymentMethodsSearchTerm] = useState(null);
  const [deliveryZonesSearchTerm, setDeliveryZonesSearchTerm] = useState(null);
  const [isUserModalOpen, setUserModalOpen] = useState(false);
  const { invId, customerId, cart, coupon, isRoundOff, payableAmount, paymentMethodId, deliveryZoneId } =
    useAppSelector((store) => store.orderSlice);
  const orderRedeem = useAppSelector(orderRedeemSnap);
  const orderGrandTotal = useAppSelector(orderGrandTotalSnap);
  const orderChangeAmount = useAppSelector(orderChangeAmountSnap);
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState<TOrderStatusType>(ENUM_ORDER_STATUS_TYPES.DELIVERED);
  const [note, setNote] = useState<string>(null);

  const handlePdfFn = async (order: IOrder) => {
    try {
      const webLogo = await normalizeReceiptImageUrlFn(
        settingsQuery.data?.data?.identity?.logo_url || Env.webBrandLogo,
      );
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
        webLogo,
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

      const blob = await pdf(<Receipt type="PRINT" order={props} />).toBlob();
      Toolbox.printWindow('pdf', URL.createObjectURL(blob));
    } catch (error) {
      messageApi.error('Failed to generate receipt preview. Please try again.');
    }
  };

  const handleClearOrderFn = () => {
    modalApi.confirm({
      title: 'Clear Order',
      content: 'Are you sure you want to clear this order? This action cannot be undone.',
      okText: 'Yes, Clear',
      cancelText: 'Cancel',
      okType: 'danger',
      onOk: () => {
        messageApi.success('Order cleared successfully');

        dispatch(clearOrderFn());
        dispatch(loadOrderInvId());
        dispatch(loadOrderCustomerId());
        dispatch(loadOrderVatTax());
        dispatch(loadOrderPaymentMethodId());
      },
    });
  };

  const settingsQuery = SettingsHooks.useFind();

  const orderCreateFn = OrdersHooks.useCreate({
    config: {
      onSuccess: (res) => {
        if (!res.success) {
          messageApi.error(res.message);
          return;
        }

        messageApi.success('Order placed successfully');
        handlePdfFn(res.data);

        dispatch(clearOrderFn());
        dispatch(loadOrderInvId());
        dispatch(loadOrderCustomerId());
        dispatch(loadOrderVatTax());
        dispatch(loadOrderPaymentMethodId());
        setStatus(ENUM_ORDER_STATUS_TYPES.DELIVERED);
        setNote(null);
      },
    },
  });

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

  const paymentMethodQuery = PaymentMethodsHooks.useFindById({
    id: paymentMethodId,
    config: {
      queryKey: [],
      enabled: !!paymentMethodId,
    },
  });

  const paymentMethodsQuery = PaymentMethodsHooks.useFindInfinite({
    options: {
      limit: '20',
      search_term: paymentMethodsSearchTerm,
      search_field: 'name',
      is_active: 'true',
    },
  });

  const deliveryZoneQuery = DeliveryZonesHooks.useFindById({
    id: deliveryZoneId,
    config: {
      queryKey: [],
      enabled: !!deliveryZoneId,
    },
  });

  const deliveryZonesQuery = DeliveryZonesHooks.useFindInfinite({
    options: {
      limit: '20',
      search_term: deliveryZonesSearchTerm,
      search_field: 'name',
      is_active: 'true',
    },
  });

  useEffect(() => {
    dispatch(loadOrderInvId());
    dispatch(loadOrderCustomerId());
    dispatch(loadOrderVatTax());
    dispatch(loadOrderPaymentMethodId());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      {messageHolder} {modalHolder}
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
            {orderGrandTotal.isRedeemExceedingProfit && (
              <Col xs={24}>
                <Alert
                  showIcon
                  closable
                  type="warning"
                  message="Redeem Warning"
                  description="The redeem exceeds the profit margin. Redeem has been automatically adjusted to maintain minimum profit."
                />
              </Col>
            )}
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
            <Col xs={24} md={12}>
              <InfiniteScrollSelect<IPaymentMethod>
                isFloat
                showSearch
                virtual={false}
                placeholder="Payment Method"
                initialOptions={paymentMethodQuery.data?.data?.id ? [paymentMethodQuery.data?.data] : []}
                option={({ item: paymentMethod }) => ({
                  key: paymentMethod?.id,
                  label: paymentMethod?.name,
                  value: paymentMethod?.id,
                })}
                onChangeSearchTerm={setPaymentMethodsSearchTerm}
                query={paymentMethodsQuery}
                value={paymentMethodId ? [paymentMethodId] : []}
                onChange={(value) => {
                  dispatch(setPaymentMethodId(value));
                }}
                style={{ width: '100%' }}
                size="large"
              />
            </Col>
            <Col xs={24} md={12}>
              <InfiniteScrollSelect<IDeliveryZone>
                isFloat
                showSearch
                virtual={false}
                placeholder="Delivery Zone"
                initialOptions={deliveryZoneQuery.data?.data?.id ? [deliveryZoneQuery.data?.data] : []}
                option={({ item: deliveryZone }) => ({
                  key: deliveryZone?.id,
                  label: deliveryZone?.name,
                  value: deliveryZone?.id,
                  data: deliveryZone,
                })}
                onChangeSearchTerm={setDeliveryZonesSearchTerm}
                query={deliveryZonesQuery}
                value={deliveryZoneId ? [deliveryZoneId] : []}
                onChange={(value, options: { data: IDeliveryZone }) => {
                  dispatch(setDeliveryZoneId(value));
                  dispatch(setDeliveryCharge(options?.data?.delivery_service_type?.amount || 0));
                }}
                style={{ width: '100%' }}
                size="large"
              />
            </Col>
            <Col xs={24}>
              <FloatSelect
                showSearch
                virtual={false}
                placeholder="Status"
                filterOption={(input, option: any) => option.label.toLowerCase().includes(input.toLowerCase())}
                options={orderStatusTypes
                  .map((orderStatusType) => {
                    if (orderStatusType === ENUM_ORDER_STATUS_TYPES.CANCELLED) return;

                    return {
                      key: orderStatusType,
                      label: Toolbox.toPrettyText(orderStatusType),
                      value: orderStatusType,
                    };
                  })
                  .filter(Boolean)}
                value={status}
                onChange={setStatus}
                style={{ width: '100%' }}
                size="large"
              />
            </Col>
            <Col xs={24}>
              <FloatTextarea
                placeholder="Note (Optional)"
                autoSize={{ minRows: 1, maxRows: 5 }}
                value={note}
                onChange={(e) => setNote(e?.target?.value)}
                size="large"
              />
            </Col>
            {/* <Col xs={24}>
              <Button
                type="primary"
                size="large"
                block
                disabled={!invId || !customerId || !cart?.length}
                icon={<FaClipboardList />}
                loading={orderCreateFn.isPending}
                onClick={() => {
                  orderCreateFn.mutate({
                    code: invId,
                    customer_id: customerId,
                    payment_method_id: paymentMethodId,
                    delivery_zone_id: deliveryZoneId,
                    coupon_id: orderRedeem.couponAmount ? coupon?.id : null,
                    status,
                    pay_amount: payableAmount,
                    redeem_amount: orderGrandTotal.totalRedeem,
                    is_round_off: isRoundOff,
                    products: cart.map((item) => ({
                      id: item.productId,
                      variation_id: item.productVariationId,
                      selected_quantity: item.selectedQuantity,
                      discount: item.discount,
                    })),
                    is_draft: true,
                    note,
                  });
                }}
                ghost
              >
                Place Draft Order
              </Button>
            </Col> */}
            <Col xs={24}>
              <Button
                type="primary"
                size="large"
                block
                disabled={!invId || !customerId || !cart?.length}
                icon={<FaShoppingBag />}
                loading={orderCreateFn.isPending}
                onClick={() => {
                  orderCreateFn.mutate({
                    code: invId,
                    customer_id: customerId,
                    payment_method_id: paymentMethodId,
                    delivery_zone_id: deliveryZoneId,
                    coupon_id: orderRedeem.couponAmount ? coupon?.id : null,
                    status,
                    pay_amount: payableAmount,
                    redeem_amount: orderGrandTotal.totalRedeem,
                    is_round_off: isRoundOff,
                    products: cart.map((item) => ({
                      id: item.productId,
                      variation_id: item.productVariationId,
                      selected_quantity: item.selectedQuantity,
                      discount: item.discount,
                    })),
                    note,
                  });
                }}
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
          initialValues={{ is_admin: 'false', is_default_customer: 'false', is_active: 'true' }}
          isLoading={userCreateFn.isPending}
          onFinish={(values) => userCreateFn.mutate(values)}
        />
      </BaseModalWithoutClicker>
    </React.Fragment>
  );
};

export default OrderSummary;
