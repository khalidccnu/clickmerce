import BaseHeroWrapper from '@base/components/BaseHeroWrapper';
import PageWrapper from '@base/container/PageWrapper';
import { IBasePageProps } from '@base/interfaces';
import CartSection from '@components/CartSection';
import { Paths } from '@lib/constant/paths';
import { pageTypes } from '@modules/pages/lib/enums';
import { PagesServices } from '@modules/pages/lib/services';
import { SettingsServices } from '@modules/settings/lib/services';
import { GetServerSideProps, NextPage } from 'next';

interface IProps extends IBasePageProps {}

const CartPage: NextPage<IProps> = ({ settingsIdentity }) => {
  return (
    <PageWrapper
      title="Cart"
      baseTitle={settingsIdentity?.name}
      description={settingsIdentity?.description}
      icon={settingsIdentity?.icon_url}
      image={settingsIdentity?.social_image_url}
    >
      <BaseHeroWrapper title="Cart" breadcrumb={[{ name: 'cart', slug: Paths.cart }]} />
      <CartSection className="py-8 md:py-16" />
    </PageWrapper>
  );
};

export default CartPage;

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
