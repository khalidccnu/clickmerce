import BaseHeroWrapper from '@base/components/BaseHeroWrapper';
import PageWrapper from '@base/container/PageWrapper';
import RefundPolicySection from '@components/RefundPolicySection';
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
  refundPolicyPage: IPage;
}

const RefundPolicyPage: NextPage<IProps> = ({ settingsIdentity, refundPolicyPage }) => {
  return (
    <PageWrapper
      title="Refund Policy"
      baseTitle={settingsIdentity?.name}
      description={settingsIdentity?.description}
      icon={settingsIdentity?.icon_url}
      image={settingsIdentity?.social_image_url}
    >
      <BaseHeroWrapper title="Refund Policy" breadcrumb={[{ name: 'refund policy', slug: Paths.refundPolicy }]} />
      <RefundPolicySection className="py-10 md:py-16" refundPolicyPage={refundPolicyPage} />
    </PageWrapper>
  );
};

export default RefundPolicyPage;

export const getServerSideProps: GetServerSideProps<IProps> = async () => {
  try {
    const { success: settingsSuccess, data: settings } = await SettingsServices.find();

    const { success: pagesSuccess, data: pages } = await PagesServices.find({
      page: '1',
      limit: pageTypes.length.toString(),
    });

    const refundPolicyPage = pages?.find((page) => page.type === ENUM_PAGE_TYPES.REFUND_POLICY);

    if (!settingsSuccess || !pagesSuccess || !refundPolicyPage?.is_active) {
      return {
        notFound: true,
      };
    }

    if (!refundPolicyPage?.content) {
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
        refundPolicyPage: refundPolicyPage ?? null,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
