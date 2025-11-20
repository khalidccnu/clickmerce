import { IBaseResponse } from '@base/interfaces';
import { supabaseServiceClient } from '@lib/config/supabase/serviceClient';
import { Database } from '@lib/constant/database';
import { SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import { Toolbox } from '@lib/utils/toolbox';
import { validate } from '@lib/utils/yup';
import {
  orderPaymentRequestQuickCreateSchema,
  TOrderPaymentRequestQuickCreateDto,
} from '@modules/order-payment-requests/lib/dtos';
import { IOrderPaymentRequest } from '@modules/order-payment-requests/lib/interfaces';
import { ENUM_ORDER_PAYMENT_STATUS_TYPES } from '@modules/orders/lib/enums';
import { IOrder } from '@modules/orders/lib/interfaces';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'OPTIONS':
      return res.status(200).end();
    case 'POST':
      return handleCreate(req, res);
    default:
      const response: IBaseResponse = {
        success: false,
        statusCode: 405,
        message: 'Method not allowed',
        data: null,
        meta: null,
      };

      return res.status(405).json(response);
  }
}

async function handleCreate(req: NextApiRequest, res: NextApiResponse) {
  const { success, data, ...restProps } = await validate<TOrderPaymentRequestQuickCreateDto>(
    orderPaymentRequestQuickCreateSchema,
    req.body,
  );

  if (!success) return res.status(400).json({ success, data, ...restProps });

  const { order_id, ...rest } = data;

  try {
    const order = await SupabaseAdapter.findById<IOrder>(supabaseServiceClient, Database.orders, order_id);

    if (!order) {
      const response: IBaseResponse = {
        success: false,
        statusCode: 404,
        message: 'Order not found',
        data: null,
        meta: null,
      };

      return res.status(404).json(response);
    }

    if (order.data?.payment_status !== ENUM_ORDER_PAYMENT_STATUS_TYPES.PROCESSING || order.data?.payment_reference) {
      const response: IBaseResponse = {
        success: false,
        statusCode: 400,
        message: 'Order payment is not in acceptable state for payment request',
        data: null,
        meta: null,
      };

      return res.status(400).json(response);
    }

    const orderPaymentRequest = await SupabaseAdapter.findOne<IOrderPaymentRequest>(
      supabaseServiceClient,
      Database.orderPaymentRequests,
      { textFilters: { conditions: { order_id: { eq: order_id } } } },
    );

    if (orderPaymentRequest.data) {
      const response: IBaseResponse = {
        success: false,
        statusCode: 400,
        message: 'Order payment request already exists for this order',
        data: null,
        meta: null,
      };

      return res.status(400).json(response);
    }

    await SupabaseAdapter.create<IOrderPaymentRequest>(supabaseServiceClient, Database.orderPaymentRequests, {
      code: Toolbox.generateKey({ prefix: 'OPR', type: 'upper' }),
      ...rest,
      order_id,
    });

    const response: IBaseResponse<IOrderPaymentRequest> = {
      success: true,
      statusCode: 201,
      message: 'Order payment request placed successfully',
      data: null,
      meta: null,
    };

    return res.status(201).json(response);
  } catch (error) {
    const response: IBaseResponse = {
      success: false,
      statusCode: 500,
      message: error.message || 'Failed to place order payment request',
      data: null,
      meta: null,
    };

    return res.status(500).json(response);
  }
}
