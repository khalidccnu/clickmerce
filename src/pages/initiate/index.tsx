import { Env } from '.environments';
import BrandLogo from '@base/components/BrandLogo';
import MultiStepForm from '@base/components/MultiStepForm';
import PageWrapper from '@base/container/PageWrapper';
import { Paths } from '@lib/constant/paths';
import InitiateSettingsIdentityForm from '@modules/initiate/components/InitiateSettingsIdentityForm';
import InitiateSettingsS3Form from '@modules/initiate/components/InitiateSettingsS3Form';
import InitiateUsersForm from '@modules/initiate/components/InitiateUsersForm';
import { ENUM_INITIATE_TYPE } from '@modules/initiate/lib/enums';
import { InitiateHook } from '@modules/initiate/lib/hooks';
import { IInitiate } from '@modules/initiate/lib/interfaces';
import { Col, Form, message, Row } from 'antd';
import { useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import { IoSettingsOutline } from 'react-icons/io5';

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

  useEffect(() => {
    form.resetFields();
  }, [form]);

  return (
    <PageWrapper title="Initiate">
      <section className="py-16">
        {messageHolder}
        <div className="container">
          <BrandLogo className="mx-auto" width={280} />
          <div className="max-w-2xl mx-auto mt-8 space-y-12">
            <MultiStepForm<IInitiate>
              form={form}
              formProps={{ autoComplete: 'off' }}
              showStepCount={false}
              steps={[
                {
                  label: <FaUser className="inline-block" size={24} />,
                  content: <InitiateUsersForm form={form} />,
                },
                {
                  label: <IoSettingsOutline className="inline-block" size={24} />,
                  content: (
                    <Row gutter={[16, 16]}>
                      <Col xs={24}>
                        <div className="relative border border-dotted p-4 pt-8 rounded-lg dark:border-gray-700">
                          <p className="font-semibold absolute top-0 left-0 -translate-y-1/2 translate-x-4 bg-white py-1 px-2 text-sm rounded-lg dark:bg-[var(--color-rich-black)]">
                            Identity
                          </p>
                          <InitiateSettingsIdentityForm form={form} />
                        </div>
                      </Col>
                      <Col xs={24}>
                        <div className="relative border border-dotted p-4 pt-8 rounded-lg dark:border-gray-700">
                          <p className="font-semibold absolute top-0 left-0 -translate-y-1/2 translate-x-4 bg-white py-1 px-2 text-sm rounded-lg dark:bg-[var(--color-rich-black)]">
                            S3
                          </p>
                          <InitiateSettingsS3Form />
                        </div>
                      </Col>
                    </Row>
                  ),
                },
              ]}
              isLoading={initiateFn.isPending}
              initialValues={{ identity: { phone_code: Env.webPhoneCode, currency: Env.webCurrency } }}
              onSubmit={(values) => {
                {
                  const { user, identity, s3 } = values;

                  initiateFn.mutate({
                    type: ENUM_INITIATE_TYPE.MANUAL,
                    user,
                    settings: { identity, s3 },
                  });
                }
              }}
            />
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};

export default InitiatePage;
