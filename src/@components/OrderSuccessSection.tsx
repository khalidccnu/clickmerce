import { Dayjs } from '@lib/constant/dayjs';
import { Paths } from '@lib/constant/paths';
import { cn } from '@lib/utils/cn';
import { Toolbox } from '@lib/utils/toolbox';
import { IOrder } from '@modules/orders/lib/interfaces';
import { OrderPaymentStatusColorFn, OrderStatusColorFn } from '@modules/orders/lib/utils';
import { Button, Card, Space, Table, TableColumnsType, Tag } from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { FaHome, FaShoppingCart } from 'react-icons/fa';

interface IProps {
  className?: string;
  showActionButtons?: boolean;
  order: IOrder;
}

const OrderSuccessSection: React.FC<IProps> = ({ className, showActionButtons = true, order }) => {
  const router = useRouter();

  const dataSource = useMemo(() => {
    if (!order?.products) return [];

    return order.products.flatMap((product) =>
      product.variations.map((variation) => ({
        key: variation.id,
        id: variation.id,
        product,
        variation,
        name: product.current_info?.name,
        stock: variation.quantity,
        sale_price: variation.sale_price,
        sale_discount_price: variation.sale_discount_price,
        quantity: variation.quantity,
      })),
    );
  }, [order]);

  const columns: TableColumnsType<(typeof dataSource)[number]> = [
    {
      key: 'name',
      dataIndex: 'name',
      title: 'Name',
      width: 384,
      render: (name, record) => {
        const v = record.variation;

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
        record.sale_discount_price && record.sale_discount_price !== record.sale_price ? (
          <p>
            {Toolbox.withCurrency(record.sale_discount_price)} <del>{Toolbox.withCurrency(record.sale_price)}</del>
          </p>
        ) : (
          Toolbox.withCurrency(record.sale_price)
        ),
    },
    {
      key: 'quantity',
      dataIndex: 'quantity',
      title: 'Quantity',
    },
    {
      key: 'total',
      dataIndex: 'total',
      title: 'Total',
      render: (_, record) => {
        const unitPrice =
          record.sale_discount_price && record.sale_discount_price !== record.sale_price
            ? record.sale_discount_price
            : record.sale_price;

        return Toolbox.withCurrency(unitPrice * record.quantity);
      },
    },
  ];

  return (
    <section className={cn('order_success_section', className)}>
      <div className="container space-y-4">
        <Card title="Order Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <p>
              <span className="font-medium">Code: </span> {order.code}
            </p>
            <p>
              <span className="font-medium">Placed: </span>
              {dayjs(order.created_at).format(Dayjs.dateTimeSecondsWithAmPm)}
            </p>
            <p>
              <span className="font-medium">Status: </span>
              <Tag color={OrderStatusColorFn(order.status)}>{Toolbox.toPrettyText(order.status)}</Tag>
            </p>
            <p>
              <span className="font-medium">Payment: </span>
              <Tag color={OrderPaymentStatusColorFn(order.payment_status)}>
                {Toolbox.toPrettyText(order.payment_status)}
              </Tag>
            </p>
          </div>
        </Card>
        <Card title="Customer Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <p>
              <span className="font-medium">Name: </span> {order.customer.name}
            </p>
            <p>
              <span className="font-medium">Phone: </span> {order.customer.phone}
            </p>
            <p>
              <span className="font-medium">Email: </span> {order.customer.email || 'N/A'}
            </p>
            <p>
              <span className="font-medium">Delivery Zone: </span> {order.delivery_zone.name}
            </p>
          </div>
        </Card>
        <Card title="Products">
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            scroll={{ x: true }}
            onRow={(record) => ({
              onClick: () => router.push(Paths.products.toSlug(record?.product?.current_info?.slug)),
              style: { cursor: 'pointer' },
            })}
          />
        </Card>
        <Card title="Summary">
          <div className="text-sm space-y-2">
            <div className="flex justify-between gap-2">
              <span>Subtotal</span>
              <span>{Toolbox.withCurrency(order.sub_total_amount)}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span>VAT</span>
              <span>{Toolbox.withCurrency(order.vat_amount)}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span>Tax</span>
              <span>{Toolbox.withCurrency(order.tax_amount)}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span>Delivery Charge</span>
              <span>{Toolbox.withCurrency(order.delivery_charge)}</span>
            </div>
            {!order.redeem_amount || (
              <div className="flex justify-between gap-2">
                <span>Redeem Amount</span>
                <span className="text-green-600">-{Toolbox.withCurrency(order.redeem_amount)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold border-t dark:border-white/10 pt-2">
              <span>Grand Total</span>
              <span>{Toolbox.withCurrency(order.grand_total_amount)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Due Amount</span>
              <span className="text-red-500">{Toolbox.withCurrency(order.due_amount)}</span>
            </div>
          </div>
        </Card>
        {showActionButtons && (
          <Space style={{ width: '100%', justifyContent: 'flex-end' }} wrap>
            <Button size="large" type="primary" onClick={() => router.push(Paths.root)} icon={<FaHome />} ghost>
              Go to Home
            </Button>
            <Button
              size="large"
              type="primary"
              onClick={() => router.push(Paths.products.root)}
              icon={<FaShoppingCart />}
            >
              Buy More
            </Button>
          </Space>
        )}
      </div>
    </section>
  );
};

export default OrderSuccessSection;
