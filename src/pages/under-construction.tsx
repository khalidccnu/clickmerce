import PageWrapper from '@base/container/PageWrapper';
import { IBasePageProps } from '@base/interfaces';
import { ImagePaths } from '@lib/constant/imagePaths';
import { pageTypes } from '@modules/pages/lib/enums';
import { PagesServices } from '@modules/pages/lib/services';
import { SettingsServices } from '@modules/settings/lib/services';
import { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';

interface IProps extends IBasePageProps {}

const UnderConstructionPage: NextPage<IProps> = () => {
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

export const getServerSideProps: GetServerSideProps<IProps> = async () => {
  try {
    const { success: settingsSuccess, data: settings } = await SettingsServices.find();

    const { success: pagesSuccess, data: pages } = await PagesServices.find({
      page: '1',
      limit: pageTypes.length.toString(),
    });

    if (!settingsSuccess || !pagesSuccess) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        settingsIdentity: settings?.identity ?? null,
        pages: pages ?? [],
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
