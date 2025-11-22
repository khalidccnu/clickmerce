import { ShoppingCartOutlined } from '@ant-design/icons';
import FloatInput from '@base/antd/components/FloatInput';
import FloatTextarea from '@base/antd/components/FloatTextarea';
import InfiniteScrollSelect from '@base/components/InfiniteScrollSelect';
import InputPhone from '@base/components/InputPhone';
import { Paths } from '@lib/constant/paths';
import { States } from '@lib/constant/states';
import { useAnalyticEvent } from '@lib/hooks/useAnalyticEvent';
import useLocalState from '@lib/hooks/useLocalState';
import { cn } from '@lib/utils/cn';
import { Toolbox } from '@lib/utils/toolbox';
import { useAuthSession } from '@modules/auth/lib/utils/client';
import { CouponsHooks } from '@modules/coupons/lib/hooks';
import { DeliveryZonesHooks } from '@modules/delivery-zones/lib/hooks';
import { IDeliveryZone } from '@modules/delivery-zones/lib/interfaces';
import { OrdersHooks } from '@modules/orders/lib/hooks';
import { IOrderQuickCreate } from '@modules/orders/lib/interfaces';
import { ENUM_PAYMENT_METHOD_REFERENCE_TYPES } from '@modules/payment-methods/lib/enums';
import { PaymentMethodsHooks } from '@modules/payment-methods/lib/hooks';
import { IPaymentMethod } from '@modules/payment-methods/lib/interfaces';
import { ProductsWebHooks } from '@modules/products/lib/webHooks';
import { ENUM_SETTINGS_TAX_TYPES, ENUM_SETTINGS_VAT_TYPES } from '@modules/settings/lib/enums';
import { ISettings } from '@modules/settings/lib/interfaces';
import { Button, Card, Col, Divider, Empty, Form, message, Row, Typography } from 'antd';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import { FaCheck } from 'react-icons/fa';

const { Title, Text } = Typography;

interface IProps {
  className?: string;
  vat?: ISettings['vat'];
  tax?: ISettings['tax'];
}

const CheckoutSection: React.FC<IProps> = ({ className, vat, tax }) => {
  const router = useRouter();
  const { user } = useAuthSession();
  const { sendEventFn } = useAnalyticEvent();
  const [form] = Form.useForm();
  const formValues = Form.useWatch([], form);
  const [messageApi, messageHolder] = message.useMessage();
  const [order, setOrder] = useLocalState(States.order);
  const [paymentMethodsSearchTerm, setPaymentMethodsSearchTerm] = useState(null);
  const [deliveryZonesSearchTerm, setDeliveryZonesSearchTerm] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [isOrderPlacing, setOrderPlacing] = useState(false);

  const handleFinishFn = (values: IOrderQuickCreate) => {
    values.products =
      order?.cart?.map((cartItem) => ({
        id: cartItem.productId,
        variation_id: cartItem.productVariationId,
        selected_quantity: cartItem.selectedQuantity,
      })) || [];

    orderCreateFn.mutate(values);
  };

  const validateCouponFn = CouponsHooks.useValidate({
    config: {
      onSuccess: (res) => {
        if (!res.success) {
          messageApi.error(res.message);
          setCouponDiscount(0);
          form.setFieldsValue({ coupon: null });
          return;
        }

        setCouponDiscount(res.data?.discount || 0);
        messageApi.success('Coupon applied successfully');
      },
    },
  });

  const orderCreateFn = OrdersHooks.useQuickCreate({
    config: {
      onSuccess: (res) => {
        if (!res.success) {
          messageApi.error(res.message);
          return;
        }

        setOrderPlacing(true);

        sendEventFn({
          name: 'purchase',
          data: {
            order_id: res.data?.id,
            code: res.data?.code,
            customer_id: res.data?.customer_id,
            customer: {
              name: res.data?.customer?.name,
              email: res.data?.customer?.email,
              phone: res.data?.customer?.phone,
            },
            products: res.data?.products?.map((product) => ({
              id: product?.id,
              name: product?.current_info?.name,
              variations: product?.variations?.map((variation) => ({
                id: variation.id,
                sale_price: variation.sale_price,
                sale_discount_price: variation.sale_discount_price,
                quantity: variation.quantity,
              })),
            })),
            payment_method: res.data?.payment_method?.name,
            delivery_zone: res.data?.delivery_zone?.name,
            sub_total_amount: res.data?.sub_total_amount,
            grand_total_amount: res.data?.grand_total_amount,
          },
        });

        messageApi.success(res.message).then(() => {
          const redirectUrl =
            paymentMethodQuery.data?.data?.reference_type === ENUM_PAYMENT_METHOD_REFERENCE_TYPES.AUTO
              ? Paths.order.success
              : Paths.order.payment;

          form.resetFields();
          setOrder({ ...order, cart: [] });
          router.push({
            pathname: redirectUrl,
            query: { order_id: res.data?.id },
          });
        });
      },
    },
  });

  const productsBulkQuery = ProductsWebHooks.useFindBulk({
    config: {
      onSuccess: (res) => {
        if (!res.success) {
          messageApi.error(res.message);
          return;
        }
      },
    },
  });

  const deliveryZoneQuery = DeliveryZonesHooks.useFindById({
    id: formValues?.delivery_zone_id,
    config: { queryKey: [], enabled: !!formValues?.delivery_zone_id },
  });

  const deliveryZonesQuery = DeliveryZonesHooks.useFindInfinite({
    options: {
      limit: '20',
      search_term: deliveryZonesSearchTerm,
      search_field: 'name',
      is_active: 'true',
    },
  });

  const paymentMethodQuery = PaymentMethodsHooks.useFindById({
    id: formValues?.payment_method_id,
    config: { queryKey: [], enabled: !!formValues?.payment_method_id },
  });

  const paymentMethodsQuery = PaymentMethodsHooks.useFindInfinite({
    options: {
      limit: '20',
      search_term: paymentMethodsSearchTerm,
      search_field: 'name',
      is_active: 'true',
    },
  });

  const dataSource = useMemo(() => {
    if (!productsBulkQuery.data?.data || !order?.cart) return [];

    const sanitizedCart = [...order?.cart]
      ?.sort((a, b) => b.priority - a.priority)
      .map((cartItem) => {
        const product = productsBulkQuery.data?.data.find((product) => product?.id === cartItem?.productId);
        const variation = product?.variations?.find((variation) => variation?.id === cartItem?.productVariationId);

        return {
          key: variation?.id,
          id: variation?.id,
          product,
          variation,
          name: product?.name,
          stock: variation?.quantity,
          sale_price: variation?.sale_price,
          sale_discount_price: variation?.['sale_discount_price'],
          quantity: cartItem?.selectedQuantity ?? 1,
        };
      });

    return sanitizedCart;
  }, [productsBulkQuery.data?.data, order?.cart]);

  const subtotal = dataSource.reduce((acc, item) => {
    const price = item.sale_discount_price ?? item.sale_price ?? 0;
    return acc + price * item.quantity;
  }, 0);

  const deliveryCharge = deliveryZoneQuery.data?.data?.delivery_service_type?.amount || 0;

  const vatAmount =
    vat?.type === ENUM_SETTINGS_VAT_TYPES.PERCENTAGE ? subtotal * (vat.amount / 100) : (vat?.amount ?? 0);

  const taxAmount =
    tax?.type === ENUM_SETTINGS_TAX_TYPES.PERCENTAGE
      ? subtotal * (tax.amount / 100)
      : tax?.type === 'FIXED'
        ? tax.amount
        : 0;

  const grandTotal = subtotal + deliveryCharge + vatAmount + taxAmount;

  useEffect(() => {
    if (order?.cart) productsBulkQuery.mutate(order.cart.map((c) => c.productId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?.cart?.length]);

  useEffect(() => {
    if (user) form.setFieldsValue({ name: user?.name, phone: user?.phone, email: user?.email });
  }, [form, user]);

  return (
    <section className={cn('checkout_section py-10', className)}>
      {messageHolder}
      <div className="container">
        {order?.cart?.length ? (
          isOrderPlacing ? (
            <Card
              style={{
                textAlign: 'center',
                maxWidth: 768,
                marginInline: 'auto',
              }}
            >
              <FaCheck className="mx-auto mb-4 text-5xl text-[var(--color-primary)]" />
              <Title level={3}>Placing your order...</Title>
              <Text>Your order is being processed. Please wait a moment.</Text>
            </Card>
          ) : (
            <Row gutter={[24, 24]}>
              <Col xs={24} md={14}>
                <Card className="shadow-sm rounded-lg">
                  <Title level={4}>Billing Information</Title>
                  <Divider style={{ marginBlock: 16 }} />
                  <Form autoComplete="off" size="large" layout="vertical" form={form} onFinish={handleFinishFn}>
                    <Row gutter={[16, 16]}>
                      <Col xs={24}>
                        <Row gutter={[16, 16]}>
                          <Col xs={24} lg={12}>
                            <Form.Item
                              name="name"
                              rules={[{ required: true, message: 'Name is required!' }]}
                              className="!mb-0"
                            >
                              <FloatInput placeholder="Name" required />
                            </Form.Item>
                          </Col>
                          <Col xs={24} lg={12}>
                            <Form.Item
                              name="phone"
                              rules={[{ required: true, message: 'Phone is required!' }]}
                              className="!mb-0"
                            >
                              <InputPhone size="large" />
                            </Form.Item>
                          </Col>
                          <Col xs={24}>
                            <Form.Item
                              name="email"
                              rules={[{ type: 'email', message: 'Email is not valid!' }]}
                              className="!mb-0"
                            >
                              <FloatInput placeholder="Email Address" />
                            </Form.Item>
                          </Col>
                          <Col xs={24} lg={12}>
                            <Form.Item
                              name="delivery_zone_id"
                              rules={[{ required: true, message: 'Delivery zone is required!' }]}
                              className="!mb-0"
                            >
                              <InfiniteScrollSelect<IDeliveryZone>
                                required
                                isFloat
                                showSearch
                                virtual={false}
                                placeholder="Delivery Zone"
                                initialOptions={deliveryZoneQuery.data?.data?.id ? [deliveryZoneQuery.data?.data] : []}
                                option={({ item: deliveryZone }) => ({
                                  key: deliveryZone?.id,
                                  label: deliveryZone?.name,
                                  value: deliveryZone?.id,
                                })}
                                onChangeSearchTerm={setDeliveryZonesSearchTerm}
                                query={deliveryZonesQuery}
                                style={{ width: '100%' }}
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24} lg={12}>
                            <Form.Item
                              name="payment_method_id"
                              rules={[{ required: true, message: 'Payment method is required!' }]}
                              className="!mb-0"
                            >
                              <InfiniteScrollSelect<IPaymentMethod>
                                required
                                isFloat
                                showSearch
                                virtual={false}
                                placeholder="Payment Method"
                                initialOptions={
                                  paymentMethodQuery.data?.data?.id ? [paymentMethodQuery.data?.data] : []
                                }
                                option={({ item: paymentMethod }) => ({
                                  key: paymentMethod?.id,
                                  label: paymentMethod?.name,
                                  value: paymentMethod?.id,
                                })}
                                onChangeSearchTerm={setPaymentMethodsSearchTerm}
                                query={paymentMethodsQuery}
                                style={{ width: '100%' }}
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24}>
                            <Divider style={{ marginBlock: 0 }} />
                          </Col>
                          <Col xs={24} lg={16}>
                            <Form.Item name="coupon" className="!mb-0">
                              <FloatInput
                                placeholder="Coupon"
                                suffix={couponDiscount ? <FaCheck color="green" /> : undefined}
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24} lg={8}>
                            <Form.Item className="!mb-0">
                              <Button
                                type="primary"
                                block
                                ghost
                                danger={!!couponDiscount}
                                onClick={() => {
                                  if (couponDiscount) {
                                    setCouponDiscount(0);
                                    form.setFieldsValue({ coupon: null });
                                    return;
                                  }

                                  validateCouponFn.mutate({
                                    code: formValues?.coupon,
                                    products:
                                      order?.cart?.map((cartItem) => ({
                                        id: cartItem.productId,
                                        variation_id: cartItem.productVariationId,
                                        selected_quantity: cartItem.selectedQuantity,
                                      })) || [],
                                  });
                                }}
                                disabled={!formValues?.coupon || !order?.cart?.length}
                                loading={validateCouponFn.isPending}
                              >
                                {couponDiscount ? 'Remove' : 'Apply'}
                              </Button>
                            </Form.Item>
                          </Col>
                          <Col xs={24}>
                            <Form.Item name="note" className="!mb-0">
                              <FloatTextarea placeholder="Note (Optional)" autoSize={{ minRows: 1, maxRows: 5 }} />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Form>
                </Card>
              </Col>
              <Col xs={24} md={10}>
                <Row gutter={[16, 16]}>
                  <Col xs={24}>
                    <Card className="shadow-sm rounded-lg">
                      <Title level={4}>Order Summary</Title>
                      <Divider style={{ marginBlock: 16 }} />
                      <div className="flex justify-between mb-2">
                        <Text>Subtotal</Text>
                        <Text strong>{Toolbox.withCurrency(subtotal)}</Text>
                      </div>
                      <div className="flex justify-between mb-2">
                        <Text>Delivery Charge</Text>
                        <Text strong>{Toolbox.withCurrency(deliveryCharge)}</Text>
                      </div>
                      <div className="flex justify-between mb-2">
                        <Text>VAT</Text>
                        <Text strong>{Toolbox.withCurrency(vatAmount)}</Text>
                      </div>
                      <div className="flex justify-between">
                        <Text>Tax</Text>
                        <Text strong>{Toolbox.withCurrency(taxAmount)}</Text>
                      </div>
                      {!couponDiscount || (
                        <div className="flex justify-between text-lg mt-2">
                          <Text>Discount</Text>
                          <Text strong>- {Toolbox.withCurrency(couponDiscount)}</Text>
                        </div>
                      )}
                      <Divider />
                      <div className="flex justify-between text-lg">
                        <Text strong>Grand Total</Text>
                        <Text strong>{Toolbox.withCurrency(grandTotal)}</Text>
                      </div>
                      {!couponDiscount || (
                        <React.Fragment>
                          <Divider />
                          <div className="flex justify-between text-lg">
                            <Text strong>Payable Amount</Text>
                            <Text strong>{Toolbox.withCurrency(grandTotal - couponDiscount)}</Text>
                          </div>
                        </React.Fragment>
                      )}
                    </Card>
                  </Col>
                  <Col xs={24}>
                    <Card className="shadow-sm rounded-lg">
                      <Button
                        type="primary"
                        size="large"
                        block
                        disabled={!order?.cart?.length}
                        onClick={form.submit}
                        loading={orderCreateFn.isPending}
                      >
                        Place Order
                      </Button>
                    </Card>
                  </Col>
                </Row>
              </Col>
            </Row>
          )
        ) : (
          <Empty
            image={<ShoppingCartOutlined style={{ fontSize: 86, color: 'var(--color-primary)' }} />}
            description={
              <span className="text-gray-700 dark:text-gray-300 text-lg font-medium">Your cart is empty</span>
            }
          >
            <Button type="primary" onClick={() => router.push(Paths.products.root)}>
              Shop Now
            </Button>
          </Empty>
        )}
      </div>
    </section>
  );
};

export default CheckoutSection;
