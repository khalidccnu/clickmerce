import BaseHeroWrapper from '@base/components/BaseHeroWrapper';
import PageWrapper from '@base/container/PageWrapper';
import { IBasePageProps } from '@base/interfaces';
import AboutSection from '@components/AboutSection';
import { Paths } from '@lib/constant/paths';
import { ENUM_PAGE_TYPES, pageTypes } from '@modules/pages/lib/enums';
import { IPage } from '@modules/pages/lib/interfaces';
import { PagesServices } from '@modules/pages/lib/services';
import { SettingsServices } from '@modules/settings/lib/services';
import { GetServerSideProps, NextPage } from 'next';

interface IProps extends IBasePageProps {
  aboutPage: IPage;
}

const AboutPage: NextPage<IProps> = ({ settingsIdentity, aboutPage }) => {
  return (
    <PageWrapper
      title="About"
      baseTitle={settingsIdentity?.name}
      description={settingsIdentity?.description}
      icon={settingsIdentity?.icon_url}
      image={settingsIdentity?.social_image_url}
    >
      <BaseHeroWrapper title="About" breadcrumb={[{ name: 'about', slug: Paths.about }]} />
      <AboutSection className="py-10 md:py-16" aboutPage={aboutPage} />
    </PageWrapper>
  );
};

export default AboutPage;

export const getServerSideProps: GetServerSideProps<IProps> = async () => {
  try {
    const { success: settingsSuccess, data: settings } = await SettingsServices.find();

    const { success: pagesSuccess, data: pages } = await PagesServices.find({
      page: '1',
      limit: pageTypes.length.toString(),
    });

    const aboutPage = pages?.find((page) => page.type === ENUM_PAGE_TYPES.ABOUT);

    if (!settingsSuccess || !pagesSuccess || !aboutPage?.is_active) {
      return {
        notFound: true,
      };
    }

    if (!aboutPage?.content) {
      return {
        redirect: {
          destination: Paths.underConstruction,
          permanent: false,
        },
      };
    }

    return {
      props: {
        settingsIdentity: settings?.identity ?? null,
        settingsTrackingCodes: settings?.tracking_codes ?? null,
        pages: pages ?? [],
        aboutPage: aboutPage ?? null,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
