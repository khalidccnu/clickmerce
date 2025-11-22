import BaseHeroWrapper from '@base/components/BaseHeroWrapper';
import PageWrapper from '@base/container/PageWrapper';
import { IBasePageProps } from '@base/interfaces';
import CheckoutSection from '@components/CheckoutSection';
import { Paths } from '@lib/constant/paths';
import { useAnalyticEvent } from '@lib/hooks/useAnalyticEvent';
import { pageTypes } from '@modules/pages/lib/enums';
import { PagesServices } from '@modules/pages/lib/services';
import { ISettings } from '@modules/settings/lib/interfaces';
import { SettingsServices } from '@modules/settings/lib/services';
import { GetServerSideProps, NextPage } from 'next';
import { useEffect } from 'react';

interface IProps extends IBasePageProps {
  settingsVat?: ISettings['vat'];
  settingsTax?: ISettings['tax'];
}

const CheckoutPage: NextPage<IProps> = ({ settingsIdentity, settingsVat, settingsTax }) => {
  const { sendEventFn } = useAnalyticEvent();

  useEffect(() => {
    sendEventFn({
      name: 'initiate_checkout',
    });
  }, [sendEventFn]);

  return (
    <PageWrapper
      title="Checkout"
      baseTitle={settingsIdentity?.name}
      description={settingsIdentity?.description}
      icon={settingsIdentity?.icon_url}
      image={settingsIdentity?.social_image_url}
    >
      <BaseHeroWrapper title="Checkout" breadcrumb={[{ name: 'checkout', slug: Paths.checkout }]} />
      <CheckoutSection className="py-8 md:py-16" vat={settingsVat} tax={settingsTax} />
    </PageWrapper>
  );
};

export default CheckoutPage;

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
        settingsTrackingCodes: settings?.tracking_codes ?? null,
        settingsVat: settings?.vat ?? null,
        settingsTax: settings?.tax ?? null,
        pages: pages ?? [],
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
