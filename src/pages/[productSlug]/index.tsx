import PageWrapper from '@base/container/PageWrapper';
import { IBasePageProps, TId } from '@base/interfaces';
import ProductViewSection from '@components/ProductViewSection';
import { pageTypes } from '@modules/pages/lib/enums';
import { PagesServices } from '@modules/pages/lib/services';
import { IProduct } from '@modules/products/lib/interfaces';
import { ProductsWebServices } from '@modules/products/lib/webServices';
import { SettingsServices } from '@modules/settings/lib/services';
import { GetServerSideProps, NextPage } from 'next';

interface IProps extends IBasePageProps {
  product: IProduct;
}

const ProductPage: NextPage<IProps> = ({ settingsIdentity, product }) => {
  return (
    <PageWrapper
      title={product?.name}
      baseTitle={settingsIdentity?.name}
      description={settingsIdentity?.description}
      icon={settingsIdentity?.icon_url}
      image={settingsIdentity?.social_image_url}
    >
      <ProductViewSection product={product} className="py-8 md:py-16" />
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

    if (!settingsSuccess || !pagesSuccess || !product) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        settingsIdentity: settings?.identity ?? null,
        pages: pages ?? [],
        product: product ?? null,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
