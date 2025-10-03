import BaseSearch from '@base/components/BaseSearch';
import PageHeader from '@base/components/PageHeader';
import PageWrapper from '@base/container/PageWrapper';
import { Toolbox } from '@lib/utils/toolbox';
import Authorization from '@modules/auth/components/Authorization';
import WithAuthorization from '@modules/auth/components/WithAuthorization';
import ProductsFilter from '@modules/products/components/ProductsFilter';
import ProductsForm from '@modules/products/components/ProductsForm';
import ProductsList from '@modules/products/components/ProductsList';
import { ENUM_PRODUCT_DISCOUNT_TYPES, ENUM_PRODUCT_TYPES } from '@modules/products/lib/enums';
import { ProductsHooks } from '@modules/products/lib/hooks';
import { IProductsFilter } from '@modules/products/lib/interfaces';
import { Button, Drawer, Form, message, Tag } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';

const ProductsPage = () => {
  const router = useRouter();
  const [messageApi, messageHolder] = message.useMessage();
  const [formInstance] = Form.useForm();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const { page = '1', limit = '10', ...rest } = Toolbox.parseQueryParams<IProductsFilter>(router.asPath);

  const productsQuery = ProductsHooks.useFind({
    options: {
      ...rest,
      page,
      limit,
      search_field: 'name',
    },
  });

  const productCreateFn = ProductsHooks.useCreate({
    config: {
      onSuccess: (res) => {
        if (!res.success) {
          messageApi.error(res.message);
          return;
        }

        setDrawerOpen(false);
        formInstance.resetFields();
        messageApi.success(res.message);
      },
    },
  });

  return (
    <PageWrapper>
      {messageHolder}
      <PageHeader
        title="Products"
        subTitle={<BaseSearch />}
        tags={[<Tag key={1}>Total: {productsQuery.data?.meta?.total || 0}</Tag>]}
        extra={
          <Authorization allowedPermissions={['products:write']}>
            <Button type="primary" onClick={() => setDrawerOpen(true)}>
              Create
            </Button>
          </Authorization>
        }
      />
      <ProductsFilter
        initialValues={Toolbox.toCleanObject(router.query)}
        onChange={(values) => {
          router.push({
            query: Toolbox.toCleanObject({ ...router.query, ...values }),
          });
        }}
      />
      <ProductsList
        isLoading={productsQuery.isLoading}
        data={productsQuery.data?.data}
        pagination={{
          current: +page,
          pageSize: +limit,
          total: productsQuery.data?.meta?.total,
          onChange: (page, limit) =>
            router.push({
              query: Toolbox.toCleanObject({ ...router.query, page, limit }),
            }),
        }}
      />
      <Drawer width={640} title="Create a new product" open={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
        <ProductsForm
          form={formInstance}
          initialValues={{
            type: ENUM_PRODUCT_TYPES.GENERAL,
            variations: [{ discount: { type: ENUM_PRODUCT_DISCOUNT_TYPES.FIXED, amount: 0 } }],
            is_active: 'true',
          }}
          isLoading={productCreateFn.isPending}
          onFinish={(values) => productCreateFn.mutate(values)}
        />
      </Drawer>
    </PageWrapper>
  );
};

export default WithAuthorization(ProductsPage, { allowedPermissions: ['products:read'] });
