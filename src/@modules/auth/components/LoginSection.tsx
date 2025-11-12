import { Env } from '.environments';
import BaseModalWithoutClicker from '@base/components/BaseModalWithoutClicker';
import BrandLogo from '@base/components/BrandLogo';
import CustomLink from '@base/components/CustomLink';
import InputPhone from '@base/components/InputPhone';
import OtpVerificationForm from '@base/components/OtpVerificationForm';
import ThemeToggler from '@base/components/ThemeToggler';
import { Messages } from '@lib/constant/messages';
import { Paths } from '@lib/constant/paths';
import { Storage } from '@lib/utils/storage';
import { ISettingsIdentity } from '@modules/settings/lib/interfaces';
import { Button, Flex, Form, Input, message, Spin } from 'antd';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CURRENCY_KEY, HASH_KEY, IDENTIFIER_KEY, PC_KEY, REDIRECT_PREFIX } from '../lib/constant';
import { AuthHooks } from '../lib/hooks';
import { setAuthSession } from '../lib/utils/client';
import RecoverPasswordForm from './RecoverPasswordForm';
import RegisterForm from './RegisterForm';

const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false,
  loading: () => <Spin />,
});

interface IProps {
  settingsIdentity: ISettingsIdentity;
}

const LoginSection: React.FC<IProps> = ({ settingsIdentity }) => {
  const router = useRouter();
  const [messageApi, messageHolder] = message.useMessage();
  const redirectUrl = router.query?.[REDIRECT_PREFIX]?.toString();
  const [anmLogin, setAnmLogin] = useState(null);
  const [registerForm] = Form.useForm();
  const [passwordResetRequestForm] = Form.useForm();
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isOtpVerifyModalOpen, setOtpVerifyModalOpen] = useState(false);
  const [isPRRModalOpen, setPRRModalOpen] = useState(false);
  const [isPRModalOpen, setPRModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState<string>(null);

  const loginFn = AuthHooks.useLogin({
    config: {
      onSuccess(data) {
        if (!data.success) {
          messageApi.error(data.message);
          return;
        }

        setAuthSession(data.data);

        messageApi.loading(Messages.login(settingsIdentity?.name), 1).then(async () => {
          Storage.setData(PC_KEY, settingsIdentity?.phone_code || Env.webPhoneCode);
          Storage.setData(CURRENCY_KEY, settingsIdentity?.currency?.split('_')?.[1] || Env.webCurrency);

          window.location.replace(redirectUrl || Paths.admin.root);
        });
      },
    },
  });

  const registerFn = AuthHooks.useRegister({
    config: {
      onSuccess(data) {
        if (!data.success) {
          messageApi.error(data.message);
          return;
        }

        setRegisterModalOpen(false);
        Storage.setData(HASH_KEY, data.data?.hash);
        Storage.setData(IDENTIFIER_KEY, data.data?.phone);
        messageApi.loading(data.message, 1).then(() => setOtpVerifyModalOpen(true));
      },
    },
  });

  const profileVerifyRequestFn = AuthHooks.useProfileVerifyRequest({
    config: {
      onSuccess(data) {
        if (!data.success) {
          messageApi.error(data.message);
          return;
        }

        Storage.setData(HASH_KEY, data.data?.hash);
        Storage.setData(IDENTIFIER_KEY, data.data?.phone);
        messageApi.loading(data.message, 1).then(() => setOtpVerifyModalOpen(true));
      },
    },
  });

  const profileVerifyFn = AuthHooks.useProfileVerify({
    config: {
      onSuccess(data) {
        if (!data.success) {
          messageApi.error(data.message);
          return;
        }

        Storage.removeData(HASH_KEY);
        Storage.removeData(IDENTIFIER_KEY);
        messageApi.loading(data.message, 1).then(() => setOtpVerifyModalOpen(false));
      },
    },
  });

  const passwordResetRequestFn = AuthHooks.usePasswordResetRequest({
    config: {
      onSuccess(data) {
        if (!data.success) {
          messageApi.error(data.message);
          return;
        }

        setPRRModalOpen(false);
        Storage.setData(HASH_KEY, data.data?.hash);
        Storage.setData(IDENTIFIER_KEY, data.data?.phone);
        messageApi.loading(data.message, 1).then(() => setPRModalOpen(true));
      },
    },
  });

  const passwordResetFn = AuthHooks.usePasswordReset({
    config: {
      onSuccess(data) {
        if (!data.success) {
          messageApi.error(data.message);
          return;
        }

        Storage.removeData(HASH_KEY);
        Storage.removeData(IDENTIFIER_KEY);
        setNewPassword(null);
        messageApi.loading(data.message, 1).then(() => setPRModalOpen(false));
      },
    },
  });

  useEffect(() => {
    import('@lib/assets/anm_login.json').then((response) => setAnmLogin(response.default));
  }, []);

  return (
    <section>
      {messageHolder}
      <div className="container">
        <div className="flex justify-center items-center min-h-screen pb-8 pt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center w-full max-w-[850px] bg-white dark:bg-black/20 p-4 rounded-2xl md:p-8">
            <div className="hidden md:block text-center">
              {anmLogin && <Lottie className="w-full max-w-96" animationData={anmLogin} loop={true} />}
            </div>
            <div className="space-y-4">
              <div className="flex flex-col items-center md:items-start gap-2">
                <ThemeToggler className="absolute top-4 right-4" />
                <CustomLink href={Paths.root}>
                  <BrandLogo width={220} />
                </CustomLink>
                <h3 className="text-xl font-medium md:text-2xl dark:text-white">Sign in to your account</h3>
              </div>
              <Form autoComplete="off" size="large" layout="vertical" onFinish={loginFn.mutate}>
                <Form.Item
                  name="phone"
                  rules={[
                    {
                      required: true,
                      message: 'Phone is required!',
                    },
                  ]}
                >
                  <InputPhone size="large" />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: 'Password is required!',
                    },
                    {
                      min: 8,
                      message: 'Password must be at least 8 characters long!',
                    },
                  ]}
                >
                  <Input.Password placeholder="Password" />
                </Form.Item>
                <Form.Item className="!mb-0">
                  <Button type="primary" htmlType="submit" loading={loginFn.isPending} className="w-full">
                    Sign In
                  </Button>
                </Form.Item>
              </Form>
              <Flex justify={settingsIdentity?.is_user_registration_acceptance ? 'space-between' : 'center'}>
                <Button type="text" onClick={() => setPRRModalOpen(true)}>
                  Forgot password?
                </Button>
                {settingsIdentity?.is_user_registration_acceptance && (
                  <Button type="text" onClick={() => setRegisterModalOpen(true)}>
                    New Account?
                  </Button>
                )}
              </Flex>
            </div>
          </div>
        </div>
      </div>
      <BaseModalWithoutClicker
        destroyOnHidden
        width={540}
        open={isRegisterModalOpen}
        onCancel={() => setRegisterModalOpen(false)}
        title="Create New Account"
        footer={null}
      >
        <RegisterForm form={registerForm} isLoading={registerFn.isPending} onFinish={registerFn.mutate} />
      </BaseModalWithoutClicker>
      <BaseModalWithoutClicker
        destroyOnHidden
        width={540}
        open={isOtpVerifyModalOpen}
        onCancel={() => {
          Storage.removeData(HASH_KEY);
          Storage.removeData(IDENTIFIER_KEY);
          setOtpVerifyModalOpen(false);
        }}
        footer={null}
      >
        <OtpVerificationForm
          staticTimer={{ minute: 5, second: 0 }}
          onRetry={() => {
            profileVerifyRequestFn.mutate({ phone: Storage.getData(IDENTIFIER_KEY) });
          }}
          onFinish={(otp) => {
            profileVerifyFn.mutate({
              phone: Storage.getData(IDENTIFIER_KEY),
              hash: Storage.getData(HASH_KEY),
              otp: +otp,
            });
          }}
        />
      </BaseModalWithoutClicker>
      <BaseModalWithoutClicker
        destroyOnHidden
        width={450}
        open={isPRRModalOpen}
        onCancel={() => setPRRModalOpen(false)}
        title="Recover Password"
        footer={null}
      >
        <RecoverPasswordForm
          form={passwordResetRequestForm}
          isLoading={passwordResetRequestFn.isPending}
          onFinish={(values) => {
            const { phone, password } = values;

            setNewPassword(password);
            passwordResetRequestFn.mutate({ phone });
          }}
        />
      </BaseModalWithoutClicker>
      <BaseModalWithoutClicker
        destroyOnHidden
        width={540}
        open={isPRModalOpen}
        onCancel={() => {
          Storage.removeData(HASH_KEY);
          Storage.removeData(IDENTIFIER_KEY);
          setPRModalOpen(false);
        }}
        footer={null}
      >
        <OtpVerificationForm
          staticTimer={{ minute: 5, second: 0 }}
          onRetry={() => passwordResetRequestFn.mutate({ phone: Storage.getData(IDENTIFIER_KEY) })}
          onFinish={(otp) => {
            passwordResetFn.mutate({
              phone: Storage.getData(IDENTIFIER_KEY),
              hash: Storage.getData(HASH_KEY),
              otp: +otp,
              newPassword,
            });
          }}
        />
      </BaseModalWithoutClicker>
    </section>
  );
};

export default LoginSection;
