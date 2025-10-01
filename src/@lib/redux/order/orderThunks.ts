import { SettingsServices } from '@modules/settings/lib/services';
import { UsersServices } from '@modules/users/lib/services';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const loadOrderCustomerId = createAsyncThunk('order/loadCustomerId', async () => {
  const { data } = await UsersServices.find({ page: '1', limit: '1', is_default_customer: 'true' });

  return { customerId: data?.[0]?.id || null };
});

export const loadOrderVatTax = createAsyncThunk('order/loadVatTax', async () => {
  const settings = await SettingsServices.find();
  const {
    data: { vat, tax },
  } = settings;

  return { vat, tax };
});
