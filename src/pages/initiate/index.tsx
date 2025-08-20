import BrandLogo from '@base/components/BrandLogo';
import PageWrapper from '@base/container/PageWrapper';
import { Paths } from '@lib/constant/paths';
import { ENUM_INITIATE_TYPE } from '@modules/initiate/lib/enums';
import { InitiateHook } from '@modules/initiate/lib/hooks';
import UsersForm from '@modules/users/components/UsersForm';
import { Form, message } from 'antd';

const InitiatePage = () => {
  const [messageApi, messageHolder] = message.useMessage();
  const [form] = Form.useForm();

  const initiateFn = InitiateHook.useCreate({
    config: {
      onSuccess: (res) => {
        if (!res.success) {
          messageApi.error(res.message);
          return;
        }

        messageApi.loading(res.message, 1).then(() => window.location.replace(Paths.root));
      },
    },
  });

  return (
    <PageWrapper title="Initiate">
      <section className="py-16">
        {messageHolder}
        <div className="container">
          <BrandLogo className="mx-auto" width={280} />
          <div className="max-w-2xl mx-auto mt-8 space-y-12">
            <UsersForm
              isInitiate
              form={form}
              isLoading={initiateFn.isPending}
              onFinish={(values) => initiateFn.mutate({ type: ENUM_INITIATE_TYPE.MANUAL, user: values })}
            />
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};

export default InitiatePage;
