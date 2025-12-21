import PageWrapper from '@base/container/PageWrapper';
import { ENUM_SORT_ORDER_TYPES } from '@base/enums';
import { IBasePageProps, IMetaResponse } from '@base/interfaces';
import BannerSection from '@components/BannerSection';
import CategoriesSliderSection from '@components/CategoriesSliderSection';
import ProductsSearchForm from '@components/ProductsSearchForm';
import ProductsSection from '@components/ProductsSection';
import RecommendedProductsSection from '@components/RecommendedProductsSection';
import ReviewsSection from '@components/ReviewsSection';
import WhyShopWithUsSection from '@components/WhyShopWithUsSection';
import { Toolbox } from '@lib/utils/toolbox';
import { IBanner } from '@modules/banners/lib/interfaces';
import { BannersServices } from '@modules/banners/lib/services';
import { ICategory } from '@modules/categories/lib/interfaces';
import { CategoriesServices } from '@modules/categories/lib/services';
import { IFeature } from '@modules/features/lib/interfaces';
import { FeaturesServices } from '@modules/features/lib/services';
import { pageTypes } from '@modules/pages/lib/enums';
import { PagesServices } from '@modules/pages/lib/services';
import { IProduct } from '@modules/products/lib/interfaces';
import { ProductsWebServices } from '@modules/products/lib/webServices';
import { IReview } from '@modules/reviews/lib/interfaces';
import { ReviewsServices } from '@modules/reviews/lib/services';
import { SettingsServices } from '@modules/settings/lib/services';
import { Grid } from 'antd';
import { GetStaticProps, NextPage } from 'next';

interface IProps extends IBasePageProps {
  banners: IBanner[];
  categories: ICategory[];
  categoriesMeta: IMetaResponse;
  products: IProduct[];
  recommendProducts: IProduct[];
  features: IFeature[];
  reviews: IReview[];
}

const HomePage: NextPage<IProps> = ({
  settingsIdentity,
  banners,
  categories,
  categoriesMeta,
  products,
  recommendProducts,
  features,
  reviews,
}) => {
  const screens = Grid.useBreakpoint();

  return (
    <PageWrapper
      baseTitle={settingsIdentity?.name}
      description={settingsIdentity?.description}
      icon={settingsIdentity?.icon_url}
      image={settingsIdentity?.social_image_url}
    >
      {screens.lg || <ProductsSearchForm className="container my-4" formProps={{ size: 'large' }} />}
      {Toolbox.isEmpty(banners) || <BannerSection banners={banners} />}
      {Toolbox.isEmpty(products) || <ProductsSection products={products} className="py-8 md:py-16" />}
      {Toolbox.isEmpty(recommendProducts) || (
        <RecommendedProductsSection
          products={recommendProducts}
          className="py-8 md:py-16 bg-white dark:bg-[var(--color-rich-black)]"
        />
      )}
      {Toolbox.isEmpty(features) || <WhyShopWithUsSection features={features} className="py-8 md:py-16" />}
      {Toolbox.isEmpty(reviews) || (
        <ReviewsSection reviews={reviews} className="py-8 md:py-16 bg-white dark:bg-[var(--color-rich-black)]" />
      )}
      {Toolbox.isEmpty(categories) || (
        <CategoriesSliderSection categories={categories} categoriesMeta={categoriesMeta} className="py-8 md:py-16" />
      )}
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
      is_active: 'true',
      sort_order: ENUM_SORT_ORDER_TYPES.DESC,
    });

    const categoriesPromise = CategoriesServices.find({
      page: '1',
      limit: '12',
      is_active: 'true',
    });

    const productsPromise = ProductsWebServices.find({
      page: '1',
      limit: '12',
      is_active: 'true',
    });

    const recommendProductsPromise = ProductsWebServices.find({
      page: '1',
      limit: '12',
      is_recommend: 'true',
      is_active: 'true',
    });

    const featuresPromise = FeaturesServices.find({
      page: '1',
      limit: '12',
      is_active: 'true',
    });

    const reviewsPromise = ReviewsServices.findQuick({
      page: '1',
      limit: '12',
      sort_order: ENUM_SORT_ORDER_TYPES.DESC,
    });

    const [bannersQuery, categoriesQuery, productsQuery, recommendProductsQuery, featuresQuery, reviewsQuery] =
      await Promise.all([
        bannersPromise,
        categoriesPromise,
        productsPromise,
        recommendProductsPromise,
        featuresPromise,
        reviewsPromise,
      ]);

    const { data: banners } = bannersQuery;
    const { data: categories, meta: categoriesMeta } = categoriesQuery;
    const { data: products } = productsQuery;
    const { data: recommendProducts } = recommendProductsQuery;
    const { data: features } = featuresQuery;
    const { data: reviews } = reviewsQuery;

    return {
      props: {
        settingsIdentity: settings?.identity ?? null,
        settingsTrackingCodes: settings?.tracking_codes ?? null,
        pages: pages ?? [],
        banners: banners ?? [],
        categories: categories ?? [],
        categoriesMeta: categoriesMeta ?? null,
        products: products ?? [],
        recommendProducts: recommendProducts ?? [],
        features: features ?? [],
        reviews: reviews ?? [],
      },
      revalidate: 60,
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
