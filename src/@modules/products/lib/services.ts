import { IBaseResponse, TId } from '@base/interfaces';
import { AxiosSecureInstance } from '@lib/config/axiosInstance';
import { supabaseBrowserClient } from '@lib/config/supabase/browserClient';
import { Database } from '@lib/constant/database';
import { Paths } from '@lib/constant/paths';
import { responseHandlerFn } from '@lib/utils/errorHandler';
import { buildSelectionFn, SupabaseAdapter } from '@lib/utils/supabaseAdapter';
import { Toolbox } from '@lib/utils/toolbox';
import { IProduct, IProductCreate, IProductsFilter, IProductsResponse, IProductVariation } from './interfaces';

const END_POINT: string = Database.products;

export const ProductsServices = {
  NAME: END_POINT,

  findById: async (id: TId): Promise<IBaseResponse<IProduct>> => {
    try {
      const res = await SupabaseAdapter.findById<IProduct>(supabaseBrowserClient, END_POINT, id, {
        selection:
          '*, dosage_form:dosage_forms(*), generic:generics(*), supplier:suppliers(*), variations:product_variations(*)',
      });
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  findBulk: async (payload: TId[]): Promise<IProductsResponse> => {
    try {
      const res = await SupabaseAdapter.findByIds<IProduct>(supabaseBrowserClient, END_POINT, payload, {
        selection:
          '*, dosage_form:dosage_forms(*), generic:generics(*), supplier:suppliers(*), variations:product_variations(*)',
      });
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  find: async (filters: IProductsFilter): Promise<IProductsResponse> => {
    const { category_ids, is_low_stock, start_date, end_date, except_ids, ...restFilters } = filters;
    const newFilters: any = { ...restFilters };

    if (is_low_stock) {
      if (!newFilters.numericFilters) newFilters.numericFilters = {};

      if (Toolbox.toBool(is_low_stock)) {
        newFilters.numericFilters = {
          conditions: {
            quantity: { lte: 24 },
          },
        };
      } else {
        newFilters.numericFilters = {
          conditions: {
            quantity: { gt: 24 },
          },
        };
      }
    }

    if (Toolbox.isNotEmpty(category_ids)) {
      if (!newFilters.textFilters) newFilters.textFilters = { conditions: {} };

      newFilters.textFilters.conditions.product_categories = {
        category_id: { in: category_ids },
      };
    }

    if (Toolbox.isNotEmpty(except_ids)) {
      if (!newFilters.textFilters) newFilters.textFilters = { conditions: {} };

      newFilters.textFilters.conditions.id = {
        notin: except_ids,
      };
    }

    if (start_date) {
      newFilters.start_date = decodeURIComponent(start_date);
    }

    if (end_date) {
      newFilters.end_date = decodeURIComponent(end_date);
    }

    try {
      const res = await SupabaseAdapter.find<IProduct>(supabaseBrowserClient, END_POINT, newFilters, {
        selection: buildSelectionFn({
          relations: {
            dosage_form: { table: Database.dosageForms },
            generic: { table: Database.generics },
            supplier: { table: Database.suppliers },
            variations: { table: Database.productVariations },
            product_categories: {
              table: Database.productCategories,
              columns: [],
            },
            categories: { table: Database.productCategories, nested: { category: { table: Database.categories } } },
          },
          filters: newFilters,
        }),
      });
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  findByFuzzy: async (filters: { name: string }): Promise<IBaseResponse<{ product: IProduct; score: number }[]>> => {
    const { name } = filters;

    try {
      const res = await SupabaseAdapter.rpc<{ product: IProduct; score: number }[]>(
        supabaseBrowserClient,
        'search_products',
        {
          q: name,
        },
      );
      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  create: async (payload: IProductCreate): Promise<IBaseResponse<IProduct>> => {
    const { variations, categories, ...rest } = payload;

    try {
      const { success, data } = await SupabaseAdapter.create<IProduct>(supabaseBrowserClient, END_POINT, rest);

      if (success && Toolbox.isNotEmpty(variations)) {
        await SupabaseAdapter.batchCreate<IProductVariation[]>(
          supabaseBrowserClient,
          Database.productVariations,
          variations.map((variation) => ({ ...variation, product_id: data?.id })),
        );
      }

      if (success && Toolbox.isNotEmpty(categories)) {
        await SupabaseAdapter.batchCreate(
          supabaseBrowserClient,
          Database.productCategories,
          categories.map((category) => {
            const { id, ...rest } = category;

            return { ...rest, category_id: id, product_id: data?.id };
          }),
        );
      }

      const res = await SupabaseAdapter.findById<IProduct>(supabaseBrowserClient, END_POINT, data?.id, {
        selection:
          '*, dosage_form:dosage_forms(*), generic:generics(*), supplier:suppliers(*), variations:product_variations(*)',
      });

      await AxiosSecureInstance.post('/revalidate', {
        route: Paths.root,
      });

      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },

  update: async (payload: { id: TId; data: Partial<IProductCreate> }): Promise<IBaseResponse<IProduct>> => {
    const { variations, categories, ...rest } = payload.data;

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

      if (Toolbox.isNotEmpty(categories)) {
        const deletedCategories = categories.filter((category) => category.is_deleted);
        const updatedCategories = categories.filter((category) => !category.is_deleted);

        if (Toolbox.isNotEmpty(deletedCategories)) {
          await SupabaseAdapter.batchDelete(
            supabaseBrowserClient,
            Database.productCategories,
            deletedCategories.map((category) => category.id),
          );
        }

        if (Toolbox.isNotEmpty(updatedCategories)) {
          await SupabaseAdapter.batchCreate(
            supabaseBrowserClient,
            Database.productCategories,
            updatedCategories.map((category) => {
              const { id, ...rest } = category;

              return { ...rest, category_id: id, product_id: payload.id };
            }),
          );
        }
      }

      const res = await SupabaseAdapter.findById<IProduct>(supabaseBrowserClient, END_POINT, payload.id, {
        selection:
          '*, dosage_form:dosage_forms(*), generic:generics(*), supplier:suppliers(*), variations:product_variations(*)',
      });

      await AxiosSecureInstance.post('/revalidate', {
        route: Paths.root,
      });

      return Promise.resolve(res);
    } catch (error) {
      throw responseHandlerFn(error);
    }
  },
};
