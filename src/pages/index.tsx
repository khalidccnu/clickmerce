import BrandLogo from '@base/components/BrandLogo';
import PageWrapper from '@base/container/PageWrapper';
import { Paths } from '@lib/constant/paths';
import { useAuthSession } from '@modules/auth/lib/utils/client';
import { Button } from 'antd';
import { useRouter } from 'next/router';

const HomePage = () => {
  const router = useRouter();
  const { isLoading, isAuthenticate } = useAuthSession();

  return (
    <PageWrapper title="Home">
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
