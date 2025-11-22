import BaseHeroWrapper from '@base/components/BaseHeroWrapper';
import PageWrapper from '@base/container/PageWrapper';
import { IBasePageProps } from '@base/interfaces';
import PrivacyPolicySection from '@components/PrivacyPolicySection';
import { Paths } from '@lib/constant/paths';
import { ENUM_PAGE_TYPES, pageTypes } from '@modules/pages/lib/enums';
import { IPage } from '@modules/pages/lib/interfaces';
import { PagesServices } from '@modules/pages/lib/services';
import { SettingsServices } from '@modules/settings/lib/services';
import { GetServerSideProps, NextPage } from 'next';

interface IProps extends IBasePageProps {
  privacyPolicyPage: IPage;
}

const PrivacyPolicyPage: NextPage<IProps> = ({ settingsIdentity, privacyPolicyPage }) => {
  return (
    <PageWrapper
      title="Privacy Policy"
      baseTitle={settingsIdentity?.name}
      description={settingsIdentity?.description}
      icon={settingsIdentity?.icon_url}
      image={settingsIdentity?.social_image_url}
    >
      <BaseHeroWrapper title="Privacy Policy" breadcrumb={[{ name: 'privacy policy', slug: Paths.privacyPolicy }]} />
      <PrivacyPolicySection className="py-10 md:py-16" privacyPolicyPage={privacyPolicyPage} />
    </PageWrapper>
  );
};

export default PrivacyPolicyPage;

export const getServerSideProps: GetServerSideProps<IProps> = async () => {
  try {
    const { success: settingsSuccess, data: settings } = await SettingsServices.find();

    const { success: pagesSuccess, data: pages } = await PagesServices.find({
      page: '1',
      limit: pageTypes.length.toString(),
    });

    const privacyPolicyPage = pages?.find((page) => page.type === ENUM_PAGE_TYPES.PRIVACY_POLICY);

    if (!settingsSuccess || !pagesSuccess || !privacyPolicyPage?.is_active) {
      return {
        notFound: true,
      };
    }

    if (!privacyPolicyPage?.content) {
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
        privacyPolicyPage: privacyPolicyPage ?? null,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
