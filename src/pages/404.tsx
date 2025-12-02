import PageWrapper from '@base/container/PageWrapper';
import { ImagePaths } from '@lib/constant/imagePaths';
import { Paths } from '@lib/constant/paths';
import { Button } from 'antd';
import { useRouter } from 'next/router';

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <PageWrapper title="404" baseTitle={null}>
      <section>
        <div className="container">
          <div className="flex flex-col md:grid md:grid-cols-2 gap-8 justify-center md:items-center max-w-4xl min-h-screen py-16 mx-auto">
            <div className="space-y-2">
              <span className="font-medium text-sm text-[var(--color-primary)]">404</span>
              <p className="font-semibold text-3xl dark:text-white">Page not found</p>
              <p className="text-gray-700 dark:text-gray-300">Sorry, the page you are looking for does not exist.</p>
              <div className="flex gap-x-2">
                <Button type="primary" onClick={router.back}>
                  Go Back
                </Button>
                <Button type="primary" onClick={() => router.push(Paths.root)} ghost>
                  Home
                </Button>
              </div>
            </div>
            <figure className="order-first md:order-none">
              <img src={ImagePaths[404]} alt="404" className="w-full h-auto" />
            </figure>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};

export default NotFoundPage;
