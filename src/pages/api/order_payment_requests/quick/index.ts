import { Env } from '.environments';
import { IBaseResponse } from '@base/interfaces';
import { mailerSendFn } from '@lib/config/mailer';
import { smsSendFn } from '@lib/config/sms';
import { supabaseServiceClient } from '@lib/config/supabase/serviceClient';
import { Database } from '@lib/constant/database';
import { buildSelectionFn, SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import { Toolbox } from '@lib/utils/toolbox';
import { validate } from '@lib/utils/yup';
import {
  orderPaymentRequestQuickCreateSchema,
  TOrderPaymentRequestQuickCreateDto,
} from '@modules/order-payment-requests/lib/dtos';
import { IOrderPaymentRequest } from '@modules/order-payment-requests/lib/interfaces';
import { ENUM_ORDER_PAYMENT_STATUS_TYPES } from '@modules/orders/lib/enums';
import { IOrder } from '@modules/orders/lib/interfaces';
import { ENUM_PAYMENT_METHOD_REFERENCE_TYPES } from '@modules/payment-methods/lib/enums';
import { NextApiRequest, NextApiResponse } from 'next';
import { handleGetSettings } from '../../settings';

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

    if (
      order?.data?.payment_method?.reference_type === ENUM_PAYMENT_METHOD_REFERENCE_TYPES.AUTO ||
      order.data?.payment_status !== ENUM_ORDER_PAYMENT_STATUS_TYPES.PROCESSING ||
      order.data?.payment_reference
    ) {
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

    const code = Toolbox.generateKey({ prefix: 'OPR', type: 'upper' });

    const newOrderPaymentRequest = await SupabaseAdapter.create<IOrderPaymentRequest>(
      supabaseServiceClient,
      Database.orderPaymentRequests,
      {
        code,
        ...rest,
        order_id,
      },
      {
        selection: buildSelectionFn({
          relations: {
            order: {
              table: Database.orders,
              nested: {
                customer: {
                  table: Database.users,
                  foreignKey: 'customer_id',
                  columns: ['id', 'name', 'phone', 'email'],
                },
              },
            },
          },
        }),
      },
    );

    const response: IBaseResponse<IOrderPaymentRequest> = {
      success: true,
      statusCode: 201,
      message: 'Order payment request placed successfully',
      data: null,
      meta: null,
    };

    const settings = await handleGetSettings(req, res, supabaseServiceClient);

    if (!settings || !settings.data) {
      return res.status(500).json(response);
    }

    if (!settings.data?.is_sms_configured) {
      if (settings.data?.is_email_configured && newOrderPaymentRequest?.data?.order?.customer?.email) {
        await mailerSendFn({
          from_email: settings?.data?.email?.from_email,
          from_name: settings?.data?.email?.from_name,
          to: newOrderPaymentRequest?.data?.order?.customer?.email,
          subject: `Order Payment Request Confirmation for ${settings?.data?.identity?.name || Env.webTitle}`,
          template: 'base',
          data: {
            webTitle: settings?.data?.identity?.name || Env.webTitle,
            webHostUrl: Env.webHostUrl,
            logoUrl: settings?.data?.identity?.logo_url || Env.webBrandLogo,
            email: settings?.data?.identity?.email,
            phone: settings?.data?.identity?.phone,
            address: settings?.data?.identity?.address,
            facebookUrl: settings?.data?.identity?.fb_url,
            instagramUrl: settings?.data?.identity?.ig_url,
            youTubeUrl: settings?.data?.identity?.yt_url,
            copyrightYear: new Date().getFullYear(),
            content: `Your ${settings?.data?.identity?.name || Env.webTitle} order payment request is placed successfully. Your order payment request code is: ${code}.`,
          },
          provider: settings?.data?.email?.provider,
          apiKey: settings?.data?.email?.api_key,
          host: settings?.data?.email?.host,
          port: settings?.data?.email?.port,
          secure: settings?.data?.email?.is_secure,
          username: settings?.data?.email?.username,
          pass: settings?.data?.email?.password,
          region: settings?.data?.email?.region,
        });
      }

      return res.status(500).json(response);
    }

    const message = `Your ${settings?.data?.identity?.name || Env.webTitle} order payment request is placed successfully. Your order payment request code is: ${code}.`;

    await smsSendFn({
      provider: settings?.data?.sms?.provider,
      accountSid: settings?.data?.sms?.account_sid,
      apiKey: settings?.data?.sms?.api_key,
      apiSecret: settings?.data?.sms?.api_secret,
      authToken: settings?.data?.sms?.auth_token,
      endpoint: settings?.data?.sms?.endpoint,
      region: settings?.data?.sms?.region,
      senderId: settings?.data?.sms?.sender_id,
      to: newOrderPaymentRequest?.data?.order?.customer?.phone,
      message,
    });

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
