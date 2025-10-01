import PageWrapper from '@base/container/PageWrapper';
import WithAuthorization from '@modules/auth/components/WithAuthorization';
import SettingsIdentityForm from '@modules/settings/components/SettingsIdentityForm';
import SettingsS3Form from '@modules/settings/components/SettingsS3Form';
import SettingsTaxForm from '@modules/settings/components/SettingsTaxForm';
import SettingsVatForm from '@modules/settings/components/SettingsVatForm';
import { SettingsHooks } from '@modules/settings/lib/hooks';
import { Form, message, Spin, Tabs, TabsProps } from 'antd';

const SettingsPage = () => {
  const [messageApi, messageHolder] = message.useMessage();
  const [identityFormInstance] = Form.useForm();
  const [s3FormInstance] = Form.useForm();
  const [vatFormInstance] = Form.useForm();
  const [taxFormInstance] = Form.useForm();

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
          initialValues={settingsQuery.data?.data}
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
  ];

  return (
    <PageWrapper>
      {messageHolder}
      {settingsQuery.isLoading ? <Spin /> : <Tabs defaultActiveKey={items[0].key} items={items} />}
    </PageWrapper>
  );
};

export default WithAuthorization(SettingsPage, { allowedPermissions: ['settings:read'] });
