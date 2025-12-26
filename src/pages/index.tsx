import PageWrapper from '@base/container/PageWrapper';
import { ENUM_SORT_ORDER_TYPES } from '@base/enums';
import { IBasePageProps } from '@base/interfaces';
import BannerSection from '@components/BannerSection';
import ProductsSearchForm from '@components/ProductsSearchForm';
import ProductsSection from '@components/ProductsSection';
import { Toolbox } from '@lib/utils/toolbox';
import { IBanner } from '@modules/banners/lib/interfaces';
import { BannersServices } from '@modules/banners/lib/services';
import { pageTypes } from '@modules/pages/lib/enums';
import { PagesServices } from '@modules/pages/lib/services';
import { IProduct } from '@modules/products/lib/interfaces';
import { ProductsWebServices } from '@modules/products/lib/webServices';
import { SettingsServices } from '@modules/settings/lib/services';
import { Grid } from 'antd';
import { GetStaticProps, NextPage } from 'next';
import dynamic from 'next/dynamic';

const RecommendedProductsSection = dynamic(() => import('@components/RecommendedProductsSection'), {
  ssr: false,
});

const WhyShopWithUsSection = dynamic(() => import('@components/WhyShopWithUsSection'), {
  ssr: false,
});

const ReviewsSection = dynamic(() => import('@components/ReviewsSection'), {
  ssr: false,
});

const CategoriesSliderSection = dynamic(() => import('@components/CategoriesSliderSection'), {
  ssr: false,
});

interface IProps extends IBasePageProps {
  banners: IBanner[];
  products: IProduct[];
}

const HomePage: NextPage<IProps> = ({ settingsIdentity, banners, products }) => {
  const screens = Grid.useBreakpoint();

  return (
    <PageWrapper
      baseTitle={settingsIdentity?.name}
      description={settingsIdentity?.description}
      icon={settingsIdentity?.icon_url}
      image={settingsIdentity?.social_image_url}
    >
      {Toolbox.isEmpty(screens) || screens.lg || (
        <ProductsSearchForm className="container my-4" formProps={{ size: 'large' }} />
      )}
      <BannerSection banners={banners} />
      <ProductsSection products={products} className="py-8 md:py-16" />
      <RecommendedProductsSection className="py-8 md:py-16 bg-white dark:bg-[var(--color-rich-black)]" />
      <WhyShopWithUsSection className="py-8 md:py-16" />
      <ReviewsSection className="py-8 md:py-16 bg-white dark:bg-[var(--color-rich-black)]" />
      <CategoriesSliderSection className="py-8 md:py-16" />
    </PageWrapper>
  );
};

export default HomePage;

export const getStaticProps: GetStaticProps<IProps> = async () => {
  try {
    const settingsPromise = SettingsServices.find();

    const pagesPromise = PagesServices.find({
      page: '1',
      limit: pageTypes.length.toString(),
    });

    const [settingsQuery, pagesQuery] = await Promise.all([settingsPromise, pagesPromise]);

    const { success: settingsSuccess, data: settings } = settingsQuery;

    const { success: pagesSuccess, data: pages } = pagesQuery;

    if (!settingsSuccess || !pagesSuccess) {
      return {
        notFound: true,
      };
    }

    const bannersPromise = BannersServices.find({
      page: '1',
      limit: '12',
      sort_order: ENUM_SORT_ORDER_TYPES.DESC,
      is_active: 'true',
    });

    const productsPromise = ProductsWebServices.find({
      page: '1',
      limit: '8',
      sort_order: ENUM_SORT_ORDER_TYPES.DESC,
      is_active: 'true',
    });

    const [bannersQuery, productsQuery] = await Promise.all([bannersPromise, productsPromise]);

    const { data: banners } = bannersQuery;
    const { data: products } = productsQuery;

    return {
      props: {
        settingsIdentity: settings?.identity ?? null,
        settingsTrackingCodes: settings?.tracking_codes ?? null,
        pages: pages ?? [],
        banners: banners ?? [],
        products: products ?? [],
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
