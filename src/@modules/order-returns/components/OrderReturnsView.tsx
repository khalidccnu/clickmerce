import { Dayjs } from '@lib/constant/dayjs';
import { Toolbox } from '@lib/utils/toolbox';
import { Card, Descriptions } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { IOrderReturn } from '../lib/interfaces';

interface IProps {
  orderReturn: IOrderReturn;
}

const OrderReturnsView: React.FC<IProps> = ({ orderReturn }) => {
  return (
    <div className="space-y-4">
      <Card title="Order Return Information" size="small">
        <Descriptions
          bordered
          size="small"
          layout="vertical"
          column={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }}
          labelStyle={{ fontWeight: 600 }}
        >
          <Descriptions.Item label="Code">
            <span className="font-mono text-[var(--color-primary)]">{orderReturn?.code}</span>
          </Descriptions.Item>
          <Descriptions.Item label="Date">
            {dayjs(orderReturn?.created_at).format(Dayjs.dateTimeSecondsWithAmPm)}
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
            {orderReturn?.order?.customer?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Phone" span={2}>
            {orderReturn?.order?.customer?.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Email" span={4}>
            {orderReturn?.order?.customer?.email || 'N/A'}
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="Products" size="small">
        <div className="space-y-2">
          {orderReturn?.products?.map((product) => {
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
            <span>{orderReturn?.created_by?.name}</span>
            <br />
            <span className="text-xs text-gray-500">
              {dayjs(orderReturn?.created_at).format(Dayjs.dateTimeSecondsWithAmPm)}
            </span>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default OrderReturnsView;
