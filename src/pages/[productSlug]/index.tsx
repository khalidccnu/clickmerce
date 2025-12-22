import PageWrapper from '@base/container/PageWrapper';
import { ENUM_SORT_ORDER_TYPES } from '@base/enums';
import { IBasePageProps, IMetaResponse, TId } from '@base/interfaces';
import ProductViewSection from '@components/ProductViewSection';
import RelatedProductsSection from '@components/RelatedProductsSection';
import { useAnalyticEvent } from '@lib/hooks/useAnalyticEvent';
import { pageTypes } from '@modules/pages/lib/enums';
import { PagesServices } from '@modules/pages/lib/services';
import { IProduct } from '@modules/products/lib/interfaces';
import { ProductsWebServices } from '@modules/products/lib/webServices';
import { IReview } from '@modules/reviews/lib/interfaces';
import { ReviewsServices } from '@modules/reviews/lib/services';
import { SettingsServices } from '@modules/settings/lib/services';
import { GetServerSideProps, NextPage } from 'next';
import { useEffect } from 'react';

interface IProps extends IBasePageProps {
  product: IProduct;
  reviews: IReview[];
  reviewsMeta: IMetaResponse;
}

const ProductPage: NextPage<IProps> = ({ settingsIdentity, product, reviews, reviewsMeta }) => {
  const { sendEventFn } = useAnalyticEvent();

  const featuredImage = product?.images?.find((image) => image?.is_featured) || product?.images?.[0];

  useEffect(() => {
    sendEventFn({
      name: 'view_item',
      data: { product_id: product.id, product_name: product.name },
    });
  }, [sendEventFn, product]);

  return (
    <PageWrapper
      title={product?.name}
      baseTitle={settingsIdentity?.name}
      description={settingsIdentity?.description}
      icon={settingsIdentity?.icon_url}
      image={featuredImage?.url || settingsIdentity?.social_image_url}
    >
      <ProductViewSection product={product} reviews={reviews} reviewsMeta={reviewsMeta} className="py-8 md:py-16" />
      <RelatedProductsSection
        productId={product?.id}
        categoryIds={product?.categories?.map((c) => c?.category?.id)}
        className="pb-8 md:pb-16"
      />
    </PageWrapper>
  );
};

export default ProductPage;

export const getServerSideProps: GetServerSideProps<IProps> = async ({ params }) => {
  const { productSlug } = params as { productSlug: TId };

  try {
    const { success: settingsSuccess, data: settings } = await SettingsServices.find();

    const { success: pagesSuccess, data: pages } = await PagesServices.find({
      page: '1',
      limit: pageTypes.length.toString(),
    });

    const { data: product } = await ProductsWebServices.findBySlug(productSlug);

    if (!settingsSuccess || !pagesSuccess || !product || !product?.is_active) {
      return {
        notFound: true,
      };
    }

    const { data: reviews, meta: reviewsMeta } = await ReviewsServices.findQuick({
      page: '1',
      limit: '12',
      product_id: product.id,
      sort_order: ENUM_SORT_ORDER_TYPES.DESC,
    });

    return {
      props: {
        settingsIdentity: settings?.identity ?? null,
        settingsTrackingCodes: settings?.tracking_codes ?? null,
        pages: pages ?? [],
        product: product ?? null,
        reviews: reviews ?? [],
        reviewsMeta: reviewsMeta ?? null,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
