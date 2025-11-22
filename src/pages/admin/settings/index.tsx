import PageWrapper from '@base/container/PageWrapper';
import WithAuthorization from '@modules/auth/components/WithAuthorization';
import SettingsEmailForm from '@modules/settings/components/SettingsEmailForm';
import SettingsIdentityForm from '@modules/settings/components/SettingsIdentityForm';
import SettingsS3Form from '@modules/settings/components/SettingsS3Form';
import SettingsSmsForm from '@modules/settings/components/SettingsSmsForm';
import SettingsTaxForm from '@modules/settings/components/SettingsTaxForm';
import SettingsTrackingCodesForm from '@modules/settings/components/SettingsTrackingCodesForm';
import SettingsVatForm from '@modules/settings/components/SettingsVatForm';
import { SettingsHooks } from '@modules/settings/lib/hooks';
import { ISettingsIdentity } from '@modules/settings/lib/interfaces';
import { SettingsServices } from '@modules/settings/lib/services';
import { Form, message, Spin, Tabs, TabsProps } from 'antd';
import { GetServerSideProps, NextPage } from 'next';

interface IProps {
  settingsIdentity: ISettingsIdentity;
}

const SettingsPage: NextPage<IProps> = ({ settingsIdentity }) => {
  const [messageApi, messageHolder] = message.useMessage();
  const [identityFormInstance] = Form.useForm();
  const [s3FormInstance] = Form.useForm();
  const [vatFormInstance] = Form.useForm();
  const [taxFormInstance] = Form.useForm();
  const [emailFormInstance] = Form.useForm();
  const [smsFormInstance] = Form.useForm();
  const [trackingCodesFormInstance] = Form.useForm();

  const settingsQuery = SettingsHooks.useFind();

  const settingsUpdateFn = SettingsHooks.useUpdate({
    config: {
      onSuccess: (res) => {
        if (!res.success) {
          messageApi.error(res.message);
          return;
        }

        messageApi.success(res.message);
      },
    },
  });

  const items: TabsProps['items'] = [
    {
      key: 'identity',
      label: 'Identity',
      children: (
        <SettingsIdentityForm
          formType="update"
          form={identityFormInstance}
          isLoading={settingsQuery.isLoading}
          initialValues={settingsQuery.data?.data?.identity}
          onFinish={(values) =>
            settingsUpdateFn.mutate({
              id: settingsQuery.data?.data?.id,
              data: {
                identity: values,
              },
            })
          }
        />
      ),
    },
    {
      key: 's3',
      label: 'S3',
      children: (
        <SettingsS3Form
          formType="update"
          form={s3FormInstance}
          isLoading={settingsQuery.isLoading}
          initialValues={settingsQuery.data?.data?.s3}
          onFinish={(values) =>
            settingsUpdateFn.mutate({
              id: settingsQuery.data?.data?.id,
              data: {
                s3: values,
              },
            })
          }
        />
      ),
    },
    {
      key: 'vat',
      label: 'Vat',
      children: (
        <SettingsVatForm
          formType="update"
          form={vatFormInstance}
          isLoading={settingsQuery.isLoading}
          initialValues={settingsQuery.data?.data?.vat}
          onFinish={(values) =>
            settingsUpdateFn.mutate({
              id: settingsQuery.data?.data?.id,
              data: {
                vat: values,
              },
            })
          }
        />
      ),
    },
    {
      key: 'tax',
      label: 'Tax',
      children: (
        <SettingsTaxForm
          formType="update"
          form={taxFormInstance}
          isLoading={settingsQuery.isLoading}
          initialValues={settingsQuery.data?.data?.tax}
          onFinish={(values) =>
            settingsUpdateFn.mutate({
              id: settingsQuery.data?.data?.id,
              data: {
                tax: values,
              },
            })
          }
        />
      ),
    },
    {
      key: 'email',
      label: 'Email',
      children: (
        <SettingsEmailForm
          formType="update"
          form={emailFormInstance}
          isLoading={settingsQuery.isLoading}
          initialValues={settingsQuery.data?.data?.email}
          onFinish={(values) =>
            settingsUpdateFn.mutate({
              id: settingsQuery.data?.data?.id,
              data: {
                email: values,
              },
            })
          }
        />
      ),
    },
    {
      key: 'sms',
      label: 'Sms',
      children: (
        <SettingsSmsForm
          formType="update"
          form={smsFormInstance}
          isLoading={settingsQuery.isLoading}
          initialValues={settingsQuery.data?.data?.sms}
          onFinish={(values) =>
            settingsUpdateFn.mutate({
              id: settingsQuery.data?.data?.id,
              data: {
                sms: values,
              },
            })
          }
        />
      ),
    },
    {
      key: 'tracking-codes',
      label: 'Tracking Codes',
      children: (
        <SettingsTrackingCodesForm
          formType="update"
          form={trackingCodesFormInstance}
          isLoading={settingsQuery.isLoading}
          initialValues={settingsQuery.data?.data?.tracking_codes}
          onFinish={(values) =>
            settingsUpdateFn.mutate({
              id: settingsQuery.data?.data?.id,
              data: {
                tracking_codes: values,
              },
            })
          }
        />
      ),
    },
  ];

  return (
    <PageWrapper
      title="Settings"
      baseTitle={settingsIdentity?.name}
      description={settingsIdentity?.description}
      icon={settingsIdentity?.icon_url}
      image={settingsIdentity?.social_image_url}
    >
      {messageHolder}
      {settingsQuery.isLoading ? <Spin /> : <Tabs defaultActiveKey={items[0].key} items={items} />}
    </PageWrapper>
  );
};

export default WithAuthorization(SettingsPage, { allowedPermissions: ['settings:read'] });

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
