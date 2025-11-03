import BaseSearch from '@base/components/BaseSearch';
import PageHeader from '@base/components/PageHeader';
import PageWrapper from '@base/container/PageWrapper';
import { Toolbox } from '@lib/utils/toolbox';
import Authorization from '@modules/auth/components/Authorization';
import WithAuthorization from '@modules/auth/components/WithAuthorization';
import PaymentMethodsFilter from '@modules/payment-methods/components/PaymentMethodsFilter';
import PaymentMethodsForm from '@modules/payment-methods/components/PaymentMethodsForm';
import PaymentMethodsList from '@modules/payment-methods/components/PaymentMethodsList';
import { ENUM_PAYMENT_METHOD_TYPES } from '@modules/payment-methods/lib/enums';
import { PaymentMethodsHooks } from '@modules/payment-methods/lib/hooks';
import { IPaymentMethodsFilter } from '@modules/payment-methods/lib/interfaces';
import { ISettingsIdentity } from '@modules/settings/lib/interfaces';
import { SettingsServices } from '@modules/settings/lib/services';
import { Button, Drawer, Form, message, Tag } from 'antd';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';

interface IProps {
  settingsIdentity: ISettingsIdentity;
}

const PaymentMethodsPage: NextPage<IProps> = ({ settingsIdentity }) => {
  const router = useRouter();
  const [messageApi, messageHolder] = message.useMessage();
  const [formInstance] = Form.useForm();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const { page = '1', limit = '10', ...rest } = Toolbox.parseQueryParams<IPaymentMethodsFilter>(router.asPath);

  const paymentMethodsQuery = PaymentMethodsHooks.useFind({
    options: {
      ...rest,
      page,
      limit,
      search_field: 'name',
    },
  });

  const paymentMethodCreateFn = PaymentMethodsHooks.useCreate({
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
    <PageWrapper
      title="Payment Methods"
      baseTitle={settingsIdentity?.name}
      description={settingsIdentity?.description}
      icon={settingsIdentity?.icon_url}
      image={settingsIdentity?.social_image_url}
    >
      {messageHolder}
      <PageHeader
        title="Payment Methods"
        subTitle={<BaseSearch />}
        tags={[<Tag key={1}>Total: {paymentMethodsQuery.data?.meta?.total || 0}</Tag>]}
        extra={
          <Authorization allowedPermissions={['payment_methods:write']}>
            <Button type="primary" onClick={() => setDrawerOpen(true)}>
              Create
            </Button>
          </Authorization>
        }
      />
      <PaymentMethodsFilter
        initialValues={Toolbox.toCleanObject(router.query)}
        onChange={(values) => {
          router.push({
            query: Toolbox.toCleanObject({ ...router.query, ...values }),
          });
        }}
      />
      <PaymentMethodsList
        isLoading={paymentMethodsQuery.isLoading}
        data={paymentMethodsQuery.data?.data}
        pagination={{
          current: +page,
          pageSize: +limit,
          total: paymentMethodsQuery.data?.meta?.total,
          onChange: (page, limit) =>
            router.push({
              query: Toolbox.toCleanObject({ ...router.query, page, limit }),
            }),
        }}
      />
      <Drawer width={640} title="Create a new payment Method" open={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
        <PaymentMethodsForm
          form={formInstance}
          initialValues={{ type: ENUM_PAYMENT_METHOD_TYPES.AUTO, is_default: 'false', is_active: 'true' }}
          isLoading={paymentMethodCreateFn.isPending}
          onFinish={(values) => paymentMethodCreateFn.mutate(values)}
        />
      </Drawer>
    </PageWrapper>
  );
};

export default WithAuthorization(PaymentMethodsPage, { allowedPermissions: ['payment_methods:read'] });

export const getServerSideProps: GetServerSideProps<IProps> = async () => {
  try {
    const { success, data: settings } = await SettingsServices.find();

    if (!success) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        settingsIdentity: settings?.identity ?? null,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
