import { Env } from '.environments';
import BrandLogo from '@base/components/BrandLogo';
import CustomLink from '@base/components/CustomLink';
import InputPhone from '@base/components/InputPhone';
import ThemeToggler from '@base/components/ThemeToggler';
import { Messages } from '@lib/constant/messages';
import { Paths } from '@lib/constant/paths';
import { Storage } from '@lib/utils/storage';
import { Button, Form, Input, message, Spin } from 'antd';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CURRENCY_KEY, PC_KEY, REDIRECT_PREFIX } from '../lib/constant';
import { AuthHooks } from '../lib/hooks';
import { setAuthSession } from '../lib/utils/client';

const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false,
  loading: () => <Spin />,
});

const SignInSection = () => {
  const router = useRouter();
  const [messageApi, messageHolder] = message.useMessage();
  const redirectUrl = router.query?.[REDIRECT_PREFIX]?.toString();
  const [anmSignIn, setAnmSignIn] = useState(null);

  const signInFn = AuthHooks.useSignIn({
    config: {
      onSuccess(data) {
        if (!data.success) {
          messageApi.error(data.message);
          return;
        }

        setAuthSession(data.data);

        messageApi.loading(Messages.signIn(), 1).then(async () => {
          Storage.setData(PC_KEY, Env.webPhoneCode);
          Storage.setData(CURRENCY_KEY, Env.webCurrency);

          window.location.replace(redirectUrl || Paths.admin.root);
        });
      },
    },
  });

  useEffect(() => {
    import('@lib/assets/anm_signin.json').then((response) => setAnmSignIn(response.default));
  }, []);

  return (
    <section>
      {messageHolder}
      <div className="container">
        <div className="flex justify-center items-center min-h-screen pb-8 pt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center w-full max-w-[850px] bg-white dark:bg-black/20 p-4 rounded-2xl md:p-8">
            <div className="hidden md:block text-center">
              {anmSignIn && <Lottie className="w-full max-w-96" animationData={anmSignIn} loop={true} />}
            </div>
            <div>
              <div className="flex flex-col items-center md:items-start gap-2 mb-4">
                <ThemeToggler className="absolute top-4 right-4" />
                <CustomLink href={Paths.root}>
                  <BrandLogo width={220} />
                </CustomLink>
                <h3 className="text-xl font-medium md:text-2xl dark:text-white">Sign in to your account</h3>
              </div>
              <Form autoComplete="off" size="large" onFinish={signInFn.mutate}>
                <Form.Item
                  name="phone"
                  rules={[
                    {
                      required: true,
                      message: 'Phone is required!',
                    },
                    {
                      validator: (_, value) => {
                        if (!value) return Promise.resolve();

                        if (!/^\d+$/.test(value)) {
                          return Promise.reject(new Error('Phone must contain only numbers!'));
                        }

                        return Promise.resolve();
                      },
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
                  <Button type="primary" htmlType="submit" loading={signInFn.isPending} className="w-full">
                    Sign In
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignInSection;
