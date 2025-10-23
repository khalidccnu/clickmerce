import { Dayjs } from '@lib/constant/dayjs';
import { cn } from '@lib/utils/cn';
import { Toolbox } from '@lib/utils/toolbox';
import { Card, Descriptions, Tag } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { IOrder } from '../lib/interfaces';
import { OrderPaymentStatusColorFn, OrderStatusColorFn } from '../lib/utils';

interface IProps {
  order: IOrder;
}

const OrdersView: React.FC<IProps> = ({ order }) => {
  return (
    <div className="space-y-4">
      <Card title="Order Information" size="small">
        <Descriptions
          bordered
          size="small"
          layout="vertical"
          column={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
          labelStyle={{ fontWeight: 600 }}
        >
          <Descriptions.Item label="Code" span={2}>
            <span className="font-mono text-[var(--color-primary)]">{order?.code}</span>
          </Descriptions.Item>
          <Descriptions.Item label="Date" span={2}>
            {dayjs(order?.created_at).format(Dayjs.dateTimeSecondsWithAmPm)}
          </Descriptions.Item>
          <Descriptions.Item label="Payment Status">
            <Tag color={OrderPaymentStatusColorFn(order?.payment_status)}>
              {Toolbox.toPrettyText(order?.payment_status)}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={OrderStatusColorFn(order?.status)}>{Toolbox.toPrettyText(order?.status)}</Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="Customer Information" size="small">
        <Descriptions
          bordered
          size="small"
          layout="vertical"
          column={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 4, xxl: 4 }}
          labelStyle={{ fontWeight: 600 }}
        >
          <Descriptions.Item label="Name" span={2}>
            {order?.customer?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Phone" span={2}>
            {order?.customer?.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Email" span={4}>
            {order?.customer?.email || 'N/A'}
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="Payment & Delivery Information" size="small">
        <Descriptions
          bordered
          size="small"
          layout="vertical"
          column={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 }}
          labelStyle={{ fontWeight: 600 }}
        >
          <Descriptions.Item label="Payment Method">{order?.payment_method?.name || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Delivery Zone">{order?.delivery_zone?.name}</Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="Financial Summary" size="small">
        <Descriptions
          bordered
          size="small"
          layout="vertical"
          column={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
          labelStyle={{ fontWeight: 600 }}
        >
          <Descriptions.Item label="Redeem">
            <span className="text-red-500">{Toolbox.withCurrency(order?.redeem_amount)}</span>
          </Descriptions.Item>
          <Descriptions.Item label="Vat">{Toolbox.withCurrency(order?.vat_amount)}</Descriptions.Item>
          <Descriptions.Item label="Tax">{Toolbox.withCurrency(order?.tax_amount)}</Descriptions.Item>
          <Descriptions.Item label="Delivery Charge">{Toolbox.withCurrency(order?.delivery_charge)}</Descriptions.Item>
          <Descriptions.Item label="Subtotal">
            <span className="font-semibold">{Toolbox.withCurrency(order?.sub_total_amount)}</span>
          </Descriptions.Item>
          <Descriptions.Item label="Grand Total">
            <span className="font-semibold text-green-500 text-lg">
              {Toolbox.withCurrency(order?.grand_total_amount)}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="Round Off">{Toolbox.withCurrency(order?.round_off_amount)}</Descriptions.Item>
          <Descriptions.Item label="Paid Amount">
            <span className="font-semibold text-blue-500">{Toolbox.withCurrency(order?.pay_amount || 0)}</span>
          </Descriptions.Item>
          <Descriptions.Item label="Due Amount">
            <span className={cn('font-semibold', order?.due_amount ? 'text-red-500' : 'text-green-500')}>
              {Toolbox.withCurrency(order?.due_amount)}
            </span>
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="Products" size="small">
        <div className="space-y-2">
          {order?.products?.map((product) => {
            return (
              <div key={product?.id} className="border dark:border-gray-700/50 rounded-lg p-4">
                <div className="mb-2">
                  <p className="font-semibold text-gray-700 dark:text-gray-300 text-base">
                    {product?.current_info?.name}
                  </p>
                  {product?.current_info?.specification && (
                    <div className="text-sm text-gray-500">{product?.current_info?.specification}</div>
                  )}
                  <div className="text-xs text-gray-500 mt-0.5">Supplier: {product?.current_info?.supplier?.name}</div>
                </div>
                <div className="space-y-2">
                  {product.variations?.map((variation, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-start border-t border-gray-100 dark:border-gray-700/50 pt-2 mt-2"
                    >
                      <div>
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {variation?.sale_discount_price ? (
                            <span className="line-through mr-1">{Toolbox.withCurrency(variation?.sale_price)}</span>
                          ) : null}
                          {Toolbox.withCurrency(variation?.sale_discount_price || variation?.sale_price)} ×{' '}
                          {variation?.quantity}
                        </div>
                        {(variation?.mfg || variation?.exp) && (
                          <div className="text-xs text-gray-500 mt-0.5">
                            {variation?.mfg && <span>MFG: {dayjs(variation.mfg).format(Dayjs.date)}</span>}
                            {variation?.mfg && variation?.exp && <span> • </span>}
                            {variation?.exp && <span>EXP: {dayjs(variation.exp).format(Dayjs.date)}</span>}
                          </div>
                        )}
                        {(variation?.color || variation?.size || variation?.weight) && (
                          <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                            {variation?.color && (
                              <span className="inline-flex items-center gap-1">
                                <span className="font-medium">Color:</span> {variation.color}
                                <div
                                  className="w-3 h-3 rounded-full border border-gray-300"
                                  style={{ backgroundColor: variation.color }}
                                />
                              </span>
                            )}
                            {variation?.color && (variation?.size || variation?.weight) && <span> • </span>}
                            {variation?.size && (
                              <span className="inline-flex items-center gap-1">
                                <span className="font-medium">Size:</span> {variation.size}
                              </span>
                            )}
                            {variation?.size && variation?.weight && <span> • </span>}
                            {variation?.weight && (
                              <span className="inline-flex items-center gap-1">
                                <span className="font-medium">Weight:</span> {variation.weight}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">
                          {Toolbox.withCurrency(
                            (variation?.sale_discount_price || variation?.sale_price) * variation?.quantity,
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
      <Card title="Meta" size="small">
        <Descriptions
          bordered
          size="small"
          layout="vertical"
          column={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 }}
          labelStyle={{ fontWeight: 600 }}
        >
          <Descriptions.Item label="Created By" span={2}>
            <span>{order?.created_by?.name}</span>
            <br />
            <span className="text-xs text-gray-500">
              {dayjs(order?.created_at).format(Dayjs.dateTimeSecondsWithAmPm)}
            </span>
          </Descriptions.Item>
          {order?.updated_by && (
            <Descriptions.Item label="Updated By" span={2}>
              <span>{order?.updated_by?.name}</span>
              <br />
              <span className="text-xs text-gray-500">
                {dayjs(order?.updated_at).format(Dayjs.dateTimeSecondsWithAmPm)}
              </span>
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>
    </div>
  );
};

export default OrdersView;
