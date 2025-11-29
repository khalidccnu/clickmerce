import { ShoppingCartOutlined } from '@ant-design/icons';
import { Paths } from '@lib/constant/paths';
import { States } from '@lib/constant/states';
import useLocalState from '@lib/hooks/useLocalState';
import { IOrderCartItem } from '@lib/redux/order/orderSlice';
import { cn } from '@lib/utils/cn';
import { Toolbox } from '@lib/utils/toolbox';
import { cartItemIdxFn } from '@modules/orders/lib/utils';
import { ProductsWebHooks } from '@modules/products/lib/webHooks';
import { Button, Col, Empty, InputNumber, message, Popconfirm, Row, Space, Spin, Table, TableColumnsType } from 'antd';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import { FaTrash, FaTrashAlt } from 'react-icons/fa';
import { RiShoppingBag3Line } from 'react-icons/ri';

interface IProps {
  className?: string;
}

const CartSection: React.FC<IProps> = ({ className }) => {
  const router = useRouter();
  const [messageApi, messageHolder] = message.useMessage();
  const [order, setOrder] = useLocalState(States.order);
  const [refetchKey, setRefetchKey] = useState(null);

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

  const updateCartFn = ({ item }: { item: IOrderCartItem }) => {
    const { productId, productVariationId, selectedQuantity } = item;
    const purifiedCart = order?.cart || [];

    const itemIdx = cartItemIdxFn(productId, productVariationId, purifiedCart);

    if (itemIdx === -1) {
      message.error('Not found in the cart!');
      return;
    }

    if (!selectedQuantity) {
      return;
    }

    if (selectedQuantity) {
      purifiedCart[itemIdx].selectedQuantity = selectedQuantity;
    }

    setOrder({
      ...order,
      cart: purifiedCart,
    });
    setRefetchKey(Toolbox.generateKey());
  };

  const removeFromCartFn = ({ item }: { item: IOrderCartItem }) => {
    const purifiedCart = order?.cart || [];

    const sanitizedCart = purifiedCart.filter(
      (cartItem) => !(cartItem.productId === item.productId && cartItem.productVariationId === item.productVariationId),
    );

    setOrder({ ...order, cart: sanitizedCart });
    message.info('Successfully removed from the cart!');
  };

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
          sale_discount_price: variation?.sale_discount_price,
          quantity: cartItem?.selectedQuantity ?? 1,
        };
      });

    return sanitizedCart;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productsBulkQuery.data?.data, order?.cart, refetchKey]);

  const columns: TableColumnsType<(typeof dataSource)[number]> = [
    {
      key: 'name',
      dataIndex: 'name',
      title: 'Name',
      width: 384,
      render: (name, record) => {
        const v = record?.variation;

        if (!v) return null;

        const isOutOfStock = !v.quantity;
        const isLowStock = v.quantity <= 10;

        return (
          <div className="space-y-1 min-w-96">
            <p className="font-medium">{name}</p>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                {v.color && (
                  <span className="px-2 py-0.5 rounded bg-gray-200 text-gray-700 flex items-center gap-1">
                    Color: {v.color}
                    <span
                      style={{
                        display: 'inline-block',
                        width: 10,
                        height: 10,
                        borderRadius: '100%',
                        backgroundColor: v.color,
                      }}
                    />
                  </span>
                )}
                {v.size && <span className="px-2 py-0.5 rounded bg-gray-200 text-gray-700">Size: {v.size}</span>}
                {v.weight && <span className="px-2 py-0.5 rounded bg-gray-200 text-gray-700">Weight: {v.weight}</span>}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {isOutOfStock && <span className="px-2 py-0.5 rounded bg-red-100 text-red-700">Out of Stock</span>}
                {!isOutOfStock && isLowStock && (
                  <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-700">Low Stock</span>
                )}
                {!isOutOfStock && !isLowStock && (
                  <span className="px-2 py-0.5 rounded bg-green-100 text-green-700">In Stock</span>
                )}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: 'sale_price',
      dataIndex: 'sale_price',
      title: 'Price',
      render: (_, record) =>
        record?.sale_discount_price ? (
          <p>
            {Toolbox.withCurrency(record?.sale_discount_price)} <del>{Toolbox.withCurrency(record?.sale_price)}</del>
          </p>
        ) : (
          Toolbox.withCurrency(record?.sale_price)
        ),
    },
    {
      key: 'quantity',
      dataIndex: 'quantity',
      title: 'Quantity',
      render: (quantity, record) => (
        <InputNumber
          min={1}
          max={record.stock}
          value={quantity}
          onChange={(value) => {
            if (!value) return;

            updateCartFn({
              item: {
                productId: record?.product?.id,
                productVariationId: record?.variation?.id,
                selectedQuantity: value,
              },
            });
          }}
        />
      ),
    },
    {
      key: 'total',
      title: 'Total',
      dataIndex: 'total',
      render: (_, record) => {
        const unitPrice =
          record?.sale_discount_price && record.sale_discount_price !== record.sale_price
            ? record.sale_discount_price
            : record.sale_price;

        const total = unitPrice * record.quantity;
        return Toolbox.withCurrency(total);
      },
    },
    {
      key: 'action',
      title: 'Action',
      align: 'center',
      render: (_, record) => (
        <Popconfirm
          title="Remove this item?"
          onConfirm={() =>
            removeFromCartFn({ item: { productId: record?.product?.id, productVariationId: record?.variation?.id } })
          }
          okText="Yes"
          cancelText="No"
          okButtonProps={{ danger: true }}
        >
          <Button danger icon={<FaTrash />} />
        </Popconfirm>
      ),
    },
  ];

  useEffect(() => {
    if (order?.cart) productsBulkQuery.mutate(order.cart.map((c) => c.productId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?.cart?.length]);

  return (
    <section className={cn('cart_section', className)}>
      {messageHolder}
      <div className="container">
        {productsBulkQuery.isPending || !productsBulkQuery.isSuccess ? (
          <div className="flex justify-center py-8">
            <Spin />
          </div>
        ) : order?.cart?.length ? (
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Table
                bordered
                pagination={false}
                loading={productsBulkQuery.isPending || !productsBulkQuery.isSuccess}
                dataSource={dataSource}
                columns={columns}
                scroll={{ x: true }}
              />
            </Col>
            <Col xs={24} className="text-end">
              <Space wrap>
                <Popconfirm
                  title="Are you sure you want to clear the cart?"
                  onConfirm={() => {
                    setOrder({ ...order, cart: [] });
                    messageApi.info('Cart cleared!');
                  }}
                  okText="Yes"
                  cancelText="No"
                  okButtonProps={{ danger: true }}
                >
                  <Button
                    size="large"
                    type="primary"
                    icon={<FaTrashAlt size={16} />}
                    danger
                    ghost
                    disabled={!order?.cart?.length}
                  >
                    Clear Cart
                  </Button>
                </Popconfirm>
                <Button
                  size="large"
                  type="primary"
                  icon={<RiShoppingBag3Line size={16} />}
                  disabled={!order?.cart?.length}
                  onClick={() => router.push(Paths.checkout)}
                >
                  Proceed to Checkout
                </Button>
              </Space>
            </Col>
          </Row>
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

export default CartSection;
