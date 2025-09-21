import { IBaseResponse, TId } from '@base/interfaces';
import { supabaseBrowserClient } from '@lib/config/supabase/browserClient';
import { Database } from '@lib/constant/database';
import { responseHandlerFn } from '@lib/utils/errorHandler';
import { SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import { Toolbox } from '@lib/utils/toolbox';
import { IProduct, IProductCreate, IProductsFilter, IProductsResponse, IProductVariation } from './interfaces';

const END_POINT: string = Database.products;

export const ProductsServices = {
  NAME: END_POINT,

  findById: async (id: TId): Promise<IBaseResponse<IProduct>> => {
    try {
      const res = await SupabaseAdapter.findById<IProduct>(supabaseBrowserClient, END_POINT, id, {
        selection:
          '*, dosage_form:dosage_forms!inner(*), generic:generics!inner(*), supplier:suppliers!inner(*), variations:product_variations!inner(*)',
      });
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  find: async (filters: IProductsFilter): Promise<IProductsResponse> => {
    const { start_date, end_date, ...restFilters } = filters;
    const newFilters: any = { ...restFilters };

    if (start_date) {
      newFilters.start_date = decodeURIComponent(start_date);
    }

    if (end_date) {
      newFilters.end_date = decodeURIComponent(end_date);
    }

    try {
      const res = await SupabaseAdapter.find<IProduct>(supabaseBrowserClient, END_POINT, newFilters, {
        selection:
          '*, dosage_form:dosage_forms!inner(*), generic:generics!inner(*), supplier:suppliers!inner(*), variations:product_variations!inner(*)',
      });
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  create: async (payload: IProductCreate): Promise<IBaseResponse<IProduct>> => {
    const { variations, ...rest } = payload;

    try {
      const { success, data } = await SupabaseAdapter.create<IProduct>(supabaseBrowserClient, END_POINT, rest);

      if (success && Toolbox.isNotEmpty(variations)) {
        await SupabaseAdapter.batchCreate<IProductVariation[]>(
          supabaseBrowserClient,
          Database.productVariations,
          variations.map((variation) => ({ ...variation, product_id: data?.id })),
        );
      }

      const res = await SupabaseAdapter.findById<IProduct>(supabaseBrowserClient, END_POINT, data?.id, {
        selection:
          '*, dosage_form:dosage_forms!inner(*), generic:generics!inner(*), supplier:suppliers!inner(*), variations:product_variations!inner(*)',
      });
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  update: async (payload: { id: TId; data: Partial<IProductCreate> }): Promise<IBaseResponse<IProduct>> => {
    const { variations, ...rest } = payload.data;

    try {
      if (Toolbox.isNotEmpty(rest)) {
        await SupabaseAdapter.update<IProduct>(supabaseBrowserClient, END_POINT, payload.id, rest);
      }

      if (Toolbox.isNotEmpty(variations)) {
        const deletedVariations = variations.filter((variation) => variation.is_deleted);
        const updatedVariations = variations.filter((variation) => !variation.is_deleted && variation.id);
        const newVariations = variations.filter((variation) => !variation.is_deleted && !variation.id);

        if (Toolbox.isNotEmpty(deletedVariations)) {
          await SupabaseAdapter.batchDelete<IProductVariation[]>(
            supabaseBrowserClient,
            Database.productVariations,
            deletedVariations.map((variation) => variation.id),
          );
        }

        if (Toolbox.isNotEmpty(updatedVariations)) {
          await SupabaseAdapter.batchUpdate<IProductVariation[]>(
            supabaseBrowserClient,
            Database.productVariations,
            updatedVariations.map((variation) => ({
              id: variation.id,
              payload: variation,
            })),
          );
        }

        if (Toolbox.isNotEmpty(newVariations)) {
          await SupabaseAdapter.batchCreate<IProductVariation[]>(
            supabaseBrowserClient,
            Database.productVariations,
            newVariations.map((variation) => ({ ...variation, product_id: payload.id })),
          );
        }
      }

      const res = await SupabaseAdapter.findById<IProduct>(supabaseBrowserClient, END_POINT, payload.id, {
        selection:
          '*, dosage_form:dosage_forms!inner(*), generic:generics!inner(*), supplier:suppliers!inner(*), variations:product_variations!inner(*)',
      });
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },
};
