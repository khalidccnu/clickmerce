import BaseSearch from '@base/components/BaseSearch';
import PageHeader from '@base/components/PageHeader';
import PageWrapper from '@base/container/PageWrapper';
import { Toolbox } from '@lib/utils/toolbox';
import Authorization from '@modules/auth/components/Authorization';
import WithAuthorization from '@modules/auth/components/WithAuthorization';
import CategoriesFilter from '@modules/categories/components/CategoriesFilter';
import CategoriesForm from '@modules/categories/components/CategoriesForm';
import CategoriesList from '@modules/categories/components/CategoriesList';
import { CategoriesHooks } from '@modules/categories/lib/hooks';
import { ICategoriesFilter } from '@modules/categories/lib/interfaces';
import { ISettingsIdentity } from '@modules/settings/lib/interfaces';
import { SettingsServices } from '@modules/settings/lib/services';
import { Button, Drawer, Form, message, Tag } from 'antd';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';

interface IProps {
  settingsIdentity: ISettingsIdentity;
}

const CategoriesPage: NextPage<IProps> = ({ settingsIdentity }) => {
  const router = useRouter();
  const [messageApi, messageHolder] = message.useMessage();
  const [formInstance] = Form.useForm();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const { page = '1', limit = '10', ...rest } = Toolbox.parseQueryParams<ICategoriesFilter>(router.asPath);

  const categoriesQuery = CategoriesHooks.useFind({
    options: {
      ...rest,
      page,
      limit,
      search_field: 'name',
    },
  });

  const categoryCreateFn = CategoriesHooks.useCreate({
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
      title="Categories"
      baseTitle={settingsIdentity?.name}
      description={settingsIdentity?.description}
      icon={settingsIdentity?.icon_url}
      image={settingsIdentity?.social_image_url}
    >
      {messageHolder}
      <PageHeader
        title="Categories"
        subTitle={<BaseSearch />}
        tags={[<Tag key={1}>Total: {categoriesQuery.data?.meta?.total || 0}</Tag>]}
        extra={
          <Authorization allowedPermissions={['categories:write']}>
            <Button type="primary" onClick={() => setDrawerOpen(true)}>
              Create
            </Button>
          </Authorization>
        }
      />
      <CategoriesFilter
        initialValues={Toolbox.toCleanObject(router.query)}
        onChange={(values) => {
          router.push({
            query: Toolbox.toCleanObject({ ...router.query, ...values }),
          });
        }}
      />
      <CategoriesList
        isLoading={categoriesQuery.isLoading}
        data={categoriesQuery.data?.data}
        pagination={{
          current: +page,
          pageSize: +limit,
          total: categoriesQuery.data?.meta?.total,
          onChange: (page, limit) =>
            router.push({
              query: Toolbox.toCleanObject({ ...router.query, page, limit }),
            }),
        }}
      />
      <Drawer width={640} title="Create a new category" open={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
        <CategoriesForm
          form={formInstance}
          initialValues={{ is_active: 'true' }}
          isLoading={categoryCreateFn.isPending}
          onFinish={(values) => categoryCreateFn.mutate(values)}
        />
      </Drawer>
    </PageWrapper>
  );
};

export default WithAuthorization(CategoriesPage, { allowedPermissions: ['categories:read'] });

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
