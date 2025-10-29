import BaseSearch from '@base/components/BaseSearch';
import PageHeader from '@base/components/PageHeader';
import PageWrapper from '@base/container/PageWrapper';
import { Toolbox } from '@lib/utils/toolbox';
import Authorization from '@modules/auth/components/Authorization';
import WithAuthorization from '@modules/auth/components/WithAuthorization';
import TransactionsFilter from '@modules/transactions/components/TransactionsFilter';
import TransactionsForm from '@modules/transactions/components/TransactionsForm';
import TransactionsList from '@modules/transactions/components/TransactionsList';
import { TransactionsHooks } from '@modules/transactions/lib/hooks';
import { ITransactionsFilter } from '@modules/transactions/lib/interfaces';
import { Button, Drawer, Form, message, Tag } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';

const TransactionsPage = () => {
  const router = useRouter();
  const [messageApi, messageHolder] = message.useMessage();
  const [formInstance] = Form.useForm();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const { page = '1', limit = '10', ...rest } = Toolbox.parseQueryParams<ITransactionsFilter>(router.asPath);

  const transactionsQuery = TransactionsHooks.useFind({
    options: {
      ...rest,
      page,
      limit,
      search_field: 'code',
    },
  });

  const transactionCreateFn = TransactionsHooks.useCreate({
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
        title="Transactions"
        subTitle={<BaseSearch />}
        tags={[<Tag key={1}>Total: {transactionsQuery.data?.meta?.total || 0}</Tag>]}
        extra={
          <Authorization allowedPermissions={['transactions:write']}>
            <Button type="primary" onClick={() => setDrawerOpen(true)}>
              Create
            </Button>
          </Authorization>
        }
      />
      <TransactionsFilter
        initialValues={Toolbox.toCleanObject(router.query)}
        onChange={(values) => {
          router.push({
            query: Toolbox.toCleanObject({ ...router.query, ...values }),
          });
        }}
      />
      <TransactionsList
        isLoading={transactionsQuery.isLoading}
        data={transactionsQuery.data?.data}
        pagination={{
          current: +page,
          pageSize: +limit,
          total: transactionsQuery.data?.meta?.total,
          onChange: (page, limit) =>
            router.push({
              query: Toolbox.toCleanObject({ ...router.query, page, limit }),
            }),
        }}
      />
      <Drawer width={640} title="Create a new transaction" open={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
        <TransactionsForm
          form={formInstance}
          isLoading={transactionCreateFn.isPending}
          onFinish={(values) => transactionCreateFn.mutate(values)}
        />
      </Drawer>
    </PageWrapper>
  );
};

export default WithAuthorization(TransactionsPage, { allowedPermissions: ['transactions:read'] });
