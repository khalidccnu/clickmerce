import PageWrapper from '@base/container/PageWrapper';
import { ImagePaths } from '@lib/constant/imagePaths';
import Image from 'next/image';

const UnderConstructionPage = () => {
  return (
    <PageWrapper title="Under Construction" baseTitle={null}>
      <section>
        <div className="container">
          <div className="flex flex-col md:grid md:grid-cols-2 gap-8 justify-center md:items-center max-w-4xl min-h-screen py-16 mx-auto">
            <div className="space-y-2">
              <span className="font-medium text-sm text-[var(--color-primary)]">Under Construction</span>
              <p className="font-semibold text-3xl dark:text-white">This page is under construction</p>
              <p className="text-gray-700 dark:text-gray-300">
                We're working hard to bring you this page soon. Please check back later.
              </p>
            </div>
            <figure className="order-first md:order-none">
              <Image
                src={ImagePaths.underConstruction}
                alt="under construction"
                width="0"
                height="0"
                sizes="100vw"
                className="w-full h-auto"
              />
            </figure>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};

export default UnderConstructionPage;
