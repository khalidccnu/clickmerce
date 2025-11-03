import BrandLogo from '@base/components/BrandLogo';
import PageWrapper from '@base/container/PageWrapper';
import { Paths } from '@lib/constant/paths';
import { useAuthSession } from '@modules/auth/lib/utils/client';
import { ISettingsIdentity } from '@modules/settings/lib/interfaces';
import { SettingsServices } from '@modules/settings/lib/services';
import { Button } from 'antd';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';

interface IProps {
  settingsIdentity: ISettingsIdentity;
}

const HomePage: NextPage<IProps> = ({ settingsIdentity }) => {
  const router = useRouter();
  const { isLoading, isAuthenticate } = useAuthSession();

  return (
    <PageWrapper
      title="Home"
      baseTitle={settingsIdentity?.name}
      description={settingsIdentity?.description}
      icon={settingsIdentity?.icon_url}
      image={settingsIdentity?.social_image_url}
    >
      <section>
        <div className="container">
          <div className="flex flex-col justify-center items-center min-h-screen gap-3">
            <BrandLogo />
            {/* {Env.webDescription && <p className="text-center text-gray-500">{Env.webDescription}</p>} */}
            {isLoading ||
              (isAuthenticate ? (
                <Button type="primary" onClick={() => router.push(Paths.admin.root)}>
                  Go to Panel
                </Button>
              ) : (
                <Button type="primary" onClick={() => router.push(Paths.auth.signIn)}>
                  Sign In
                </Button>
              ))}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};

export default HomePage;

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
