import BaseSearch from '@base/components/BaseSearch';
import PageHeader from '@base/components/PageHeader';
import PageWrapper from '@base/container/PageWrapper';
import { Toolbox } from '@lib/utils/toolbox';
import Authorization from '@modules/auth/components/Authorization';
import WithAuthorization from '@modules/auth/components/WithAuthorization';
import CouponsFilter from '@modules/coupons/components/CouponsFilter';
import CouponsForm from '@modules/coupons/components/CouponsForm';
import CouponsList from '@modules/coupons/components/CouponsList';
import { ENUM_COUPON_TYPES } from '@modules/coupons/lib/enums';
import { CouponsHooks } from '@modules/coupons/lib/hooks';
import { ICouponsFilter } from '@modules/coupons/lib/interfaces';
import { Button, Drawer, Form, message, Tag } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';

const CouponsPage = () => {
  const router = useRouter();
  const [messageApi, messageHolder] = message.useMessage();
  const [formInstance] = Form.useForm();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const { page = '1', limit = '10', ...rest } = Toolbox.parseQueryParams<ICouponsFilter>(router.asPath);

  const couponsQuery = CouponsHooks.useFind({
    options: {
      ...rest,
      page,
      limit,
      search_field: 'code',
    },
  });

  const couponCreateFn = CouponsHooks.useCreate({
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
        title="Coupons"
        subTitle={<BaseSearch />}
        tags={[<Tag key={1}>Total: {couponsQuery.data?.meta?.total || 0}</Tag>]}
        extra={
          <Authorization allowedPermissions={['coupons:write']}>
            <Button type="primary" onClick={() => setDrawerOpen(true)}>
              Create
            </Button>
          </Authorization>
        }
      />
      <CouponsFilter
        initialValues={Toolbox.toCleanObject(router.query)}
        onChange={(values) => {
          router.push({
            query: Toolbox.toCleanObject({ ...router.query, ...values }),
          });
        }}
      />
      <CouponsList
        isLoading={couponsQuery.isLoading}
        data={couponsQuery.data?.data}
        pagination={{
          current: +page,
          pageSize: +limit,
          total: couponsQuery.data?.meta?.total,
          onChange: (page, limit) =>
            router.push({
              query: Toolbox.toCleanObject({ ...router.query, page, limit }),
            }),
        }}
      />
      <Drawer width={640} title="Create a new coupon" open={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
        <CouponsForm
          form={formInstance}
          initialValues={{
            type: ENUM_COUPON_TYPES.FIXED,
            min_purchase_amount: 0,
            max_redeemable_amount: 0,
            usage_limit: 0,
            is_active: 'true',
          }}
          isLoading={couponCreateFn.isPending}
          onFinish={(values) => couponCreateFn.mutate(values)}
        />
      </Drawer>
    </PageWrapper>
  );
};

export default WithAuthorization(CouponsPage, { allowedPermissions: ['coupons:read'] });
