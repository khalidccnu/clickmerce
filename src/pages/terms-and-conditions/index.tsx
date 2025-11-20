import BaseHeroWrapper from '@base/components/BaseHeroWrapper';
import PageWrapper from '@base/container/PageWrapper';
import TermsAndConditionsSection from '@components/TermsAndConditionsSection';
import { Paths } from '@lib/constant/paths';
import { ENUM_PAGE_TYPES, pageTypes } from '@modules/pages/lib/enums';
import { IPage } from '@modules/pages/lib/interfaces';
import { PagesServices } from '@modules/pages/lib/services';
import { ISettingsIdentity } from '@modules/settings/lib/interfaces';
import { SettingsServices } from '@modules/settings/lib/services';
import { GetServerSideProps, NextPage } from 'next';

interface IProps {
  settingsIdentity: ISettingsIdentity;
  pages: IPage[];
  termsAndConditionsPage: IPage;
}

const TermsAndConditionsPage: NextPage<IProps> = ({ settingsIdentity, termsAndConditionsPage }) => {
  return (
    <PageWrapper
      title="Terms And Conditions"
      baseTitle={settingsIdentity?.name}
      description={settingsIdentity?.description}
      icon={settingsIdentity?.icon_url}
      image={settingsIdentity?.social_image_url}
    >
      <BaseHeroWrapper
        title="Terms And Conditions"
        breadcrumb={[{ name: 'terms and conditions', slug: Paths.termsAndConditions }]}
      />
      <TermsAndConditionsSection className="py-10 md:py-16" termsAndConditionsPage={termsAndConditionsPage} />
    </PageWrapper>
  );
};

export default TermsAndConditionsPage;

export const getServerSideProps: GetServerSideProps<IProps> = async () => {
  try {
    const { success: settingsSuccess, data: settings } = await SettingsServices.find();

    const { success: pagesSuccess, data: pages } = await PagesServices.find({
      page: '1',
      limit: pageTypes.length.toString(),
    });

    const termsAndConditionsPage = pages?.find((page) => page.type === ENUM_PAGE_TYPES.TERMS_AND_CONDITIONS);

    if (!settingsSuccess || !pagesSuccess || !termsAndConditionsPage?.is_active) {
      return {
        notFound: true,
      };
    }

    if (!termsAndConditionsPage?.content) {
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
        pages: pages ?? [],
        termsAndConditionsPage: termsAndConditionsPage ?? null,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
