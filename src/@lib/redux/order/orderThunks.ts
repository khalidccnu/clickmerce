import { Toolbox } from '@lib/utils/toolbox';
import { PaymentMethodsServices } from '@modules/payment-methods/lib/services';
import { SettingsServices } from '@modules/settings/lib/services';
import { UsersServices } from '@modules/users/lib/services';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const loadOrderInvId = createAsyncThunk('order/loadInvId', async () => {
  const invId = Toolbox.generateKey({ prefix: 'INV', type: 'upper' });

  return { invId };
});

export const loadOrderCustomerId = createAsyncThunk('order/loadCustomerId', async () => {
  const { data } = await UsersServices.find({ page: '1', limit: '1', is_default_customer: 'true', is_active: 'true' });

  return { customerId: data?.[0]?.id || null };
});

export const loadOrderVatTax = createAsyncThunk('order/loadVatTax', async () => {
  const settings = await SettingsServices.find();
  const {
    data: { vat, tax },
  } = settings;

  return { vat, tax };
});

export const loadOrderPaymentMethodId = createAsyncThunk('order/loadPaymentMethodId', async () => {
  const { data } = await PaymentMethodsServices.find({ page: '1', limit: '1', is_default: 'true', is_active: 'true' });

  return { paymentMethodId: data?.[0]?.id || null };
});
