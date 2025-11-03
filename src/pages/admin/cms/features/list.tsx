import BaseSearch from '@base/components/BaseSearch';
import PageHeader from '@base/components/PageHeader';
import PageWrapper from '@base/container/PageWrapper';
import { Toolbox } from '@lib/utils/toolbox';
import Authorization from '@modules/auth/components/Authorization';
import WithAuthorization from '@modules/auth/components/WithAuthorization';
import FeaturesFilter from '@modules/features/components/FeaturesFilter';
import FeaturesForm from '@modules/features/components/FeaturesForm';
import FeaturesList from '@modules/features/components/FeaturesList';
import { FeaturesHooks } from '@modules/features/lib/hooks';
import { IFeaturesFilter } from '@modules/features/lib/interfaces';
import { ISettingsIdentity } from '@modules/settings/lib/interfaces';
import { SettingsServices } from '@modules/settings/lib/services';
import { Button, Drawer, Form, message, Tag } from 'antd';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';

interface IProps {
  settingsIdentity: ISettingsIdentity;
}

const FeaturesPage: NextPage<IProps> = ({ settingsIdentity }) => {
  const router = useRouter();
  const [messageApi, messageHolder] = message.useMessage();
  const [formInstance] = Form.useForm();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const { page = '1', limit = '10', ...rest } = Toolbox.parseQueryParams<IFeaturesFilter>(router.asPath);

  const featuresQuery = FeaturesHooks.useFind({
    options: {
      ...rest,
      page,
      limit,
      search_field: 'title',
    },
  });

  const featureCreateFn = FeaturesHooks.useCreate({
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
      title="Features"
      baseTitle={settingsIdentity?.name}
      description={settingsIdentity?.description}
      icon={settingsIdentity?.icon_url}
      image={settingsIdentity?.social_image_url}
    >
      {messageHolder}
      <PageHeader
        title="Features"
        subTitle={<BaseSearch />}
        tags={[<Tag key={1}>Total: {featuresQuery.data?.meta?.total || 0}</Tag>]}
        extra={
          <Authorization allowedPermissions={['features:write']}>
            <Button type="primary" onClick={() => setDrawerOpen(true)}>
              Create
            </Button>
          </Authorization>
        }
      />
      <FeaturesFilter
        initialValues={Toolbox.toCleanObject(router.query)}
        onChange={(values) => {
          router.push({
            query: Toolbox.toCleanObject({ ...router.query, ...values }),
          });
        }}
      />
      <FeaturesList
        isLoading={featuresQuery.isLoading}
        data={featuresQuery.data?.data}
        pagination={{
          current: +page,
          pageSize: +limit,
          total: featuresQuery.data?.meta?.total,
          onChange: (page, limit) =>
            router.push({
              query: Toolbox.toCleanObject({ ...router.query, page, limit }),
            }),
        }}
      />
      <Drawer width={640} title="Create a new feature" open={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
        <FeaturesForm
          form={formInstance}
          initialValues={{ is_active: 'true' }}
          isLoading={featureCreateFn.isPending}
          onFinish={(values) => featureCreateFn.mutate(values)}
        />
      </Drawer>
    </PageWrapper>
  );
};

export default WithAuthorization(FeaturesPage, { allowedPermissions: ['features:read'] });

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
