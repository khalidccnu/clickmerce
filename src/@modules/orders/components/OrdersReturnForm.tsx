import BaseModalWithoutClicker from '@base/components/BaseModalWithoutClicker';
import { TId } from '@base/interfaces';
import { Dayjs } from '@lib/constant/dayjs';
import { cn } from '@lib/utils/cn';
import { Toolbox } from '@lib/utils/toolbox';
import { IOrder, IOrderReturnUpdate } from '@modules/orders/lib/interfaces';
import OrderSummaryDiscountForm from '@modules/pos/components/OrderSummaryDiscountForm';
import { ENUM_PRODUCT_DISCOUNT_TYPES } from '@modules/products/lib/enums';
import { IProductVariation } from '@modules/products/lib/interfaces';
import { Button, Col, Form, InputNumber, Row, Tooltip } from 'antd';
import dayjs from 'dayjs';
import React, { useMemo, useState } from 'react';
import { FaRegEdit, FaUndoAlt } from 'react-icons/fa';

interface IProps {
  isLoading: boolean;
  initialValues: IOrder;
  onFinish: (values: IOrderReturnUpdate) => void;
}

const kv = (productId: TId, variationId: TId) => `${productId}-${variationId}`;

const OrdersReturnForm: React.FC<IProps> = ({ initialValues, isLoading, onFinish }) => {
  const activeProducts = useMemo(() => initialValues?.products || [], [initialValues?.products]);

  const [returnQuantities, setReturnQuantities] = useState<Record<string, number>>(() => {
    const quantityMap: Record<string, number> = {};

    (initialValues?.products || []).forEach((product) => {
      (product.variations || []).forEach((variation) => {
        quantityMap[kv(product.id, variation.id)] = 0;
      });
    });

    return quantityMap;
  });

  const [discount, setDiscount] = useState<IProductVariation['discount']>({
    type: ENUM_PRODUCT_DISCOUNT_TYPES.FIXED,
    amount: initialValues?.redeem_amount,
  });

  const [discountFormInstance] = Form.useForm();
  const [isDiscountModalOpen, setDiscountModalOpen] = useState(false);

  const handleQuantityChangeFn = (productId: TId, variationId: TId, value: number) => {
    const key = kv(productId, variationId);
    const quantity = Math.max(0, Math.floor(Number(value || 0)));

    setReturnQuantities((prev) => ({ ...prev, [key]: quantity }));
  };

  const handleRemoveProductFn = (productId: TId) => {
    setReturnQuantities((prev) => {
      const sanitized = { ...prev };

      const product = activeProducts.find((product) => product.id === productId);
      if (product) {
        product.variations.forEach((variation) => {
          const key = kv(productId, variation.id);
          sanitized[key] = variation.quantity || 0;
        });
      }

      return sanitized;
    });
  };

  const totals = useMemo(() => {
    let remainingSubtotal = 0;
    let remainingProfit = 0;

    (activeProducts || []).forEach((product) => {
      (product.variations || []).forEach((variation) => {
        const originalQuantity = variation.quantity;
        const key = kv(product.id, variation.id);
        const returnQuantity = returnQuantities[key];
        const remainingQuantity = Math.max(0, originalQuantity - returnQuantity);
        const salePrice = variation.sale_price;
        const costPrice = variation.cost_price;
        const price = variation.sale_discount_price || salePrice;

        const isBeingReturned = !!returnQuantity;

        const saleDiscountPrice = isBeingReturned ? salePrice : price;
        const remainingItemTotal = remainingQuantity * saleDiscountPrice;
        const remainingItemCost = remainingQuantity * costPrice;
        const remainingItemProfit = remainingItemTotal - remainingItemCost;

        remainingSubtotal += remainingItemTotal;
        remainingProfit += remainingItemProfit;
      });
    });

    const discountAmount =
      discount.type === ENUM_PRODUCT_DISCOUNT_TYPES.PERCENTAGE
        ? (remainingSubtotal * Math.min(100, Math.max(0, discount.amount))) / 100
        : Math.max(0, discount.amount);

    const maxProfitDiscount = Math.max(0, remainingProfit);
    const discountLimitAmount = Math.min(discountAmount, maxProfitDiscount);

    const vatAmount = initialValues?.vat_amount;
    const taxAmount = initialValues?.tax_amount;
    const deliveryCharge = initialValues?.delivery_charge;
    const roundOffAmount = initialValues?.round_off_amount;

    const grandTotal = remainingSubtotal + vatAmount + taxAmount + deliveryCharge - discountLimitAmount;
    const grandTotalWithRoundOff = roundOffAmount ? Math.round(grandTotal) : grandTotal;
    const actualRoundOffAmount = roundOffAmount ? grandTotalWithRoundOff - grandTotal : 0;

    const paid = initialValues?.pay_amount;
    const dueAmount = Math.max(0, grandTotalWithRoundOff - paid);
    const returnAmount = Math.max(0, paid - grandTotalWithRoundOff);

    return {
      discountAmount: discountLimitAmount,
      vatAmount,
      taxAmount,
      deliveryCharge,
      subtotal: remainingSubtotal,
      roundOffAmount: actualRoundOffAmount,
      grandTotal,
      grandTotalWithRoundOff,
      dueAmount,
      returnAmount,
      totalProfit: remainingProfit,
      maxProfitBasedDiscount: maxProfitDiscount,
      isDiscountExceedingProfit: discountAmount > maxProfitDiscount,
    };
  }, [activeProducts, returnQuantities, discount, initialValues]);

  const handleFinishFn = () => {
    const returnProducts = (activeProducts || [])
      .map((product) => {
        const productVariations = (product.variations || [])
          .map((variation) => {
            const key = kv(product.id, variation.id);
            const returnQuantity = returnQuantities[key] || 0;

            if (returnQuantity) {
              return {
                id: variation.id,
                return_quantity: returnQuantity,
              };
            }

            return null;
          })
          .filter(Boolean);

        if (productVariations.length) {
          return {
            id: product.id,
            variations: productVariations,
          };
        }

        return null;
      })
      .filter(Boolean);

    const result = {
      redeem_amount: totals.discountAmount,
      products: returnProducts,
    };

    onFinish(result);
  };

  return (
    <React.Fragment>
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <div className="space-y-4">
            {(activeProducts || []).map((product, idx) => (
              <div key={product.id} className="rounded-lg border dark:border-gray-700/50">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-t-lg px-4 py-2 border-b border-gray-300 dark:border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="bg-[var(--color-primary)] text-white px-2 py-1 rounded-md text-xs font-medium">
                          Product #{idx + 1}
                        </p>
                        <p className="font-semibold text-base text-gray-700 dark:text-gray-300">
                          {product.current_info?.name}
                        </p>
                      </div>
                      {product.current_info?.specification && (
                        <p className="text-sm text-gray-500 dark:text-gray-300 ml-2">
                          {product.current_info.specification}
                        </p>
                      )}
                    </div>
                    <Tooltip title="Return All">
                      <Button type="text" icon={<FaUndoAlt />} onClick={() => handleRemoveProductFn(product.id)} />
                    </Tooltip>
                  </div>
                </div>
                <div className="space-y-4">
                  {(product.variations || []).map((variation) => {
                    const key = kv(product.id, variation.id);
                    const expirationDate = variation.exp ? dayjs(variation.exp) : null;
                    const isExpiringSoon = expirationDate && expirationDate.diff(dayjs(), 'months') < 3;
                    const isExpired = expirationDate && expirationDate.isBefore(dayjs(), 'day');

                    const salePrice = variation.sale_price;
                    const returnQuantity = returnQuantities[key];

                    const isBeingReturned = !!returnQuantity;

                    const price = variation.sale_discount_price || salePrice;
                    const saleDiscountPrice = isBeingReturned ? salePrice : price;
                    const hasDiscount = price < salePrice;

                    return (
                      <div
                        key={variation.id}
                        className={cn('p-4 transition-colors duration-300 rounded-b-lg', {
                          'bg-red-50 dark:bg-red-900/20': isExpired,
                          'bg-orange-50 dark:bg-orange-900/20': isExpiringSoon,
                        })}
                      >
                        <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex flex-wrap items-center gap-6">
                              <div className="flex flex-col">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Price</p>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-blue-500 dark:text-blue-300 text-base">
                                    {Toolbox.withCurrency(saleDiscountPrice)}
                                  </span>
                                  {hasDiscount && !isBeingReturned && (
                                    <span className="text-xs text-gray-400 line-through">
                                      {Toolbox.withCurrency(salePrice)}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-col">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Ordered Quantity</p>
                                <p className="font-semibold text-green-500 dark:text-green-300">{variation.quantity}</p>
                              </div>
                            </div>
                            {(variation.mfg || variation.exp) && (
                              <div className="flex items-center gap-4 text-xs">
                                {variation.mfg && (
                                  <div className="flex items-center gap-1">
                                    <span className="text-gray-500 dark:text-gray-300">MFG:</span>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                      {dayjs(variation.mfg).format(Dayjs.date)}
                                    </span>
                                  </div>
                                )}
                                {variation.exp && (
                                  <div className="flex items-center gap-1">
                                    <span className="text-gray-500 dark:text-gray-300">EXP:</span>
                                    <span
                                      className={cn('font-medium', {
                                        'text-red-500 dark:text-red-300': isExpired,
                                        'text-orange-500 dark:text-orange-300': isExpiringSoon,
                                        'text-gray-700 dark:text-gray-300': !isExpired && !isExpiringSoon,
                                      })}
                                    >
                                      {dayjs(variation.exp).format(Dayjs.date)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                            {(variation.color || variation.size) && (
                              <div className="flex items-center gap-2">
                                {variation.color && (
                                  <div className="inline-flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-900 rounded border border-gray-300 dark:border-gray-700 text-xs">
                                    <span className="text-gray-500 dark:text-gray-300">Color:</span>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                      {variation.color}
                                    </span>
                                    <div
                                      className="w-3 h-3 rounded-full border border-gray-300 ml-1"
                                      style={{ backgroundColor: variation.color }}
                                    />
                                  </div>
                                )}
                                {variation.size && (
                                  <div className="inline-flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-900 rounded border border-gray-300 dark:border-gray-700 text-xs">
                                    <span className="text-gray-500 dark:text-gray-300">Size:</span>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                      {variation.size}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col items-center gap-2">
                            <label className="text-xs font-medium text-gray-500 dark:text-gray-300">
                              Return Quantity
                            </label>
                            <InputNumber
                              min={0}
                              max={variation.quantity}
                              step={1}
                              precision={0}
                              value={returnQuantities[key]}
                              onChange={(value) => handleQuantityChangeFn(product.id, variation.id, value)}
                              disabled={isExpired || !variation.quantity}
                              className="w-24"
                              placeholder="0"
                            />
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 mt-4">
                          {isExpired && (
                            <p className="inline-block px-2 py-1 text-xs font-medium bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-full">
                              🚫 Expired - Cannot Return
                            </p>
                          )}
                          {!isExpired && isExpiringSoon && (
                            <p className="inline-block px-2 py-1 text-xs font-medium bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 rounded-full">
                              ⚠️ Expiring Soon
                            </p>
                          )}
                          {isBeingReturned && (
                            <p className="text-xs text-orange-500 dark:text-orange-300">Discount removed on return</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            {(!activeProducts || !activeProducts.length) && (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">📦</div>
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">No products for return</h3>
                <p className="text-sm text-gray-500 dark:text-gray-300">All products have been removed.</p>
              </div>
            )}
          </div>
        </Col>
        <Col xs={24}>
          <div className="rounded-lg border border-gray-300 dark:border-gray-700/50">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-t-lg px-4 py-2 border-b border-gray-300 dark:border-gray-700/50">
              <p className="text-base font-semibold text-gray-700 dark:text-gray-300">Summary</p>
            </div>
            <div className="p-2 flex flex-col gap-2">
              <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-[var(--color-dark-gray)] rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Discount</span>
                  <Button type="text" size="small" icon={<FaRegEdit />} onClick={() => setDiscountModalOpen(true)} />
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-700 dark:text-gray-300">
                    <span className="text-gray-500 dark:text-gray-300">
                      {Toolbox.withCurrency(initialValues?.redeem_amount)}
                    </span>
                    <span className="mx-2 text-gray-400">→</span>
                    <span className="text-purple-500 dark:text-purple-300">
                      {Toolbox.withCurrency(totals.discountAmount)}
                    </span>
                  </div>
                  {totals.isDiscountExceedingProfit && (
                    <div className="text-xs text-orange-500 dark:text-orange-300 mt-1 flex items-center gap-1">
                      <span>⚠️</span>
                      <span>Discount limited to: {Toolbox.withCurrency(totals.maxProfitBasedDiscount)}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-[var(--color-dark-gray)] rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Vat</span>
                </div>
                <p className="font-semibold text-orange-500 dark:text-orange-300">
                  {Toolbox.withCurrency(totals.vatAmount)}
                </p>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-[var(--color-dark-gray)] rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Tax</span>
                </div>
                <p className="font-semibold text-yellow-600 dark:text-yellow-400">
                  {Toolbox.withCurrency(totals.taxAmount)}
                </p>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-[var(--color-dark-gray)] rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Delivery Charge</span>
                </div>
                <p className="font-semibold text-teal-600 dark:text-teal-400">
                  {Toolbox.withCurrency(totals.deliveryCharge)}
                </p>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-[var(--color-dark-gray)] rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Subtotal</span>
                </div>
                <div className="font-semibold text-gray-700 dark:text-gray-300">
                  <span className="text-gray-500 dark:text-gray-300">
                    {Toolbox.withCurrency(initialValues?.sub_total_amount)}
                  </span>
                  <span className="mx-2 text-gray-400">→</span>
                  <span className="text-blue-500 dark:text-blue-300">{Toolbox.withCurrency(totals.subtotal)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-[var(--color-dark-gray)] rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Round Off</span>
                </div>
                <p
                  className={cn('font-semibold', {
                    'text-green-500 dark:text-green-300': totals.roundOffAmount > 0,
                    'text-red-500 dark:text-red-300': totals.roundOffAmount < 0,
                    'text-gray-700 dark:text-gray-300': totals.roundOffAmount === 0,
                  })}
                >
                  {Toolbox.withCurrency(totals.roundOffAmount)}
                </p>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-[var(--color-dark-gray)] rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Grand Total</span>
                </div>
                <div className="font-semibold text-gray-700 dark:text-gray-300">
                  <span className="text-gray-500 dark:text-gray-300">
                    {Toolbox.withCurrency(initialValues?.grand_total_amount)}
                  </span>
                  <span className="mx-2 text-gray-400">→</span>
                  <span className="text-indigo-600 dark:text-indigo-400">
                    {Toolbox.withCurrency(totals.grandTotalWithRoundOff)}
                  </span>
                </div>
              </div>
              <div className="border-t border-gray-300/30 dark:border-gray-700 my-2"></div>
              <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-300 dark:border-blue-700">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="font-medium text-blue-700 dark:text-blue-300">Paid Amount</span>
                </div>
                <p className="font-semibold text-blue-700 dark:text-blue-300">
                  {Toolbox.withCurrency(initialValues?.pay_amount)}
                </p>
              </div>
              <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-300 dark:border-green-700">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Return Amount</span>
                </div>
                <p className="font-semibold text-green-500 dark:text-green-300">
                  {Toolbox.withCurrency(totals.returnAmount)}
                </p>
              </div>
              {!!totals.returnAmount && (
                <p className="text-center text-sm text-green-500 dark:text-green-300 bg-green-50 dark:bg-green-900/20 p-2 rounded">
                  💡 Customer will receive a refund of {Toolbox.withCurrency(totals.returnAmount)}
                </p>
              )}
              {!!totals.dueAmount && (
                <div className="text-center text-sm text-red-500 dark:text-red-300 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                  ⚠️ Remaining due amount: {Toolbox.withCurrency(totals.dueAmount)}
                </div>
              )}
            </div>
          </div>
        </Col>
        <Col xs={24}>
          <div className="text-end">
            <Button
              type="primary"
              size="large"
              loading={isLoading}
              onClick={handleFinishFn}
              disabled={!activeProducts || !activeProducts.length}
            >
              {isLoading ? 'Processing...' : 'Confirm Return'}
            </Button>
          </div>
        </Col>
      </Row>
      <BaseModalWithoutClicker
        destroyOnHidden
        width={540}
        title="Discount"
        footer={null}
        open={isDiscountModalOpen}
        onCancel={() => setDiscountModalOpen(false)}
      >
        <OrderSummaryDiscountForm
          form={discountFormInstance}
          isLoading={false}
          initialValues={{ type: discount.type, amount: discount.amount }}
          onFinish={({ type, amount }) => {
            setDiscount({ type, amount });
            setDiscountModalOpen(false);
          }}
        />
      </BaseModalWithoutClicker>
    </React.Fragment>
  );
};

export default OrdersReturnForm;
