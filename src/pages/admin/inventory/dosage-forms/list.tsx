import BaseSearch from '@base/components/BaseSearch';
import PageHeader from '@base/components/PageHeader';
import PageWrapper from '@base/container/PageWrapper';
import { Toolbox } from '@lib/utils/toolbox';
import Authorization from '@modules/auth/components/Authorization';
import WithAuthorization from '@modules/auth/components/WithAuthorization';
import DosageFormsFilter from '@modules/dosage-forms/components/DosageFormsFilter';
import DosageFormsForm from '@modules/dosage-forms/components/DosageFormsForm';
import DosageFormsList from '@modules/dosage-forms/components/DosageFormsList';
import { DosageFormsHooks } from '@modules/dosage-forms/lib/hooks';
import { IDosageFormsFilter } from '@modules/dosage-forms/lib/interfaces';
import { Button, Drawer, Form, message, Tag } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';

const DosageFormsPage = () => {
  const router = useRouter();
  const [messageApi, messageHolder] = message.useMessage();
  const [formInstance] = Form.useForm();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const { page = '1', limit = '10', ...rest } = Toolbox.parseQueryParams<IDosageFormsFilter>(router.asPath);

  const dosageFormsQuery = DosageFormsHooks.useFind({
    options: {
      ...rest,
      page,
      limit,
      search_field: 'name',
    },
  });

  const dosageFormCreateFn = DosageFormsHooks.useCreate({
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
        title="Dosage Forms"
        subTitle={<BaseSearch />}
        tags={[<Tag key={1}>Total: {dosageFormsQuery.data?.meta?.total || 0}</Tag>]}
        extra={
          <Authorization allowedPermissions={['dosage_forms:write']}>
            <Button type="primary" onClick={() => setDrawerOpen(true)}>
              Create
            </Button>
          </Authorization>
        }
      />
      <DosageFormsFilter
        initialValues={Toolbox.toCleanObject(router.query)}
        onChange={(values) => {
          router.push({
            query: Toolbox.toCleanObject({ ...router.query, ...values }),
          });
        }}
      />
      <DosageFormsList
        isLoading={dosageFormsQuery.isLoading}
        data={dosageFormsQuery.data?.data}
        pagination={{
          current: +page,
          pageSize: +limit,
          total: dosageFormsQuery.data?.meta?.total,
          onChange: (page, limit) =>
            router.push({
              query: Toolbox.toCleanObject({ ...router.query, page, limit }),
            }),
        }}
      />
      <Drawer width={640} title="Create a new dosage form" open={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
        <DosageFormsForm
          form={formInstance}
          initialValues={{ is_active: 'true' }}
          isLoading={dosageFormCreateFn.isPending}
          onFinish={(values) => dosageFormCreateFn.mutate(values)}
        />
      </Drawer>
    </PageWrapper>
  );
};

export default WithAuthorization(DosageFormsPage, { allowedPermissions: ['dosage_forms:read'] });
