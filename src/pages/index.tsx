import PageWrapper from '@base/container/PageWrapper';
import { IBasePageProps } from '@base/interfaces';
import BannerSection from '@components/BannerSection';
import ProductsSection from '@components/ProductsSection';
import RecommendedProductsSection from '@components/RecommendedProductsSection';
import WhyShopWithUsSection from '@components/WhyShopWithUsSection';
import { Toolbox } from '@lib/utils/toolbox';
import { IBanner } from '@modules/banners/lib/interfaces';
import { BannersServices } from '@modules/banners/lib/services';
import { IFeature } from '@modules/features/lib/interfaces';
import { FeaturesServices } from '@modules/features/lib/services';
import { pageTypes } from '@modules/pages/lib/enums';
import { PagesServices } from '@modules/pages/lib/services';
import { IProduct } from '@modules/products/lib/interfaces';
import { ProductsWebServices } from '@modules/products/lib/webServices';
import { SettingsServices } from '@modules/settings/lib/services';
import { GetServerSideProps, NextPage } from 'next';

interface IProps extends IBasePageProps {
  banners: IBanner[];
  products: IProduct[];
  features: IFeature[];
}

const HomePage: NextPage<IProps> = ({ settingsIdentity, banners, products, features }) => {
  return (
    <PageWrapper
      title="Home"
      baseTitle={settingsIdentity?.name}
      description={settingsIdentity?.description}
      icon={settingsIdentity?.icon_url}
      image={settingsIdentity?.social_image_url}
    >
      {Toolbox.isEmpty(banners) || <BannerSection banners={banners} />}
      {Toolbox.isEmpty(products) || <ProductsSection products={products} className="py-8 md:py-16" />}
      {Toolbox.isEmpty(products) || (
        <RecommendedProductsSection products={products} className="py-8 md:py-16 bg-white" />
      )}
      {Toolbox.isEmpty(features) || <WhyShopWithUsSection features={features} className="py-8 md:py-16" />}
    </PageWrapper>
  );
};

export default HomePage;

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

    const { data: banners } = await BannersServices.find({
      page: '1',
      limit: '50',
      is_active: 'true',
      sort_order: 'DESC',
    });

    const { data: products } = await ProductsWebServices.find({
      page: '1',
      limit: '12',
      is_active: 'true',
    });

    const { data: features } = await FeaturesServices.find({
      page: '1',
      limit: '50',
      is_active: 'true',
    });

    return {
      props: {
        settingsIdentity: settings?.identity ?? null,
        pages: pages ?? [],
        banners: banners ?? [],
        products: products ?? [],
        features: features ?? [],
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
