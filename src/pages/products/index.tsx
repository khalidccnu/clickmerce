import PageWrapper from '@base/container/PageWrapper';
import { IBasePageProps } from '@base/interfaces';
import ProductsSection from '@components/ProductsSection';
import { pageTypes } from '@modules/pages/lib/enums';
import { PagesServices } from '@modules/pages/lib/services';
import { IProduct } from '@modules/products/lib/interfaces';
import { ProductsWebServices } from '@modules/products/lib/webServices';
import { SettingsServices } from '@modules/settings/lib/services';
import { GetServerSideProps, NextPage } from 'next';

interface IProps extends IBasePageProps {
  products: IProduct[];
}

const ProductsPage: NextPage<IProps> = ({ settingsIdentity, products }) => {
  return (
    <PageWrapper
      title="Products"
      baseTitle={settingsIdentity?.name}
      description={settingsIdentity?.description}
      icon={settingsIdentity?.icon_url}
      image={settingsIdentity?.social_image_url}
    >
      <ProductsSection showForProductsPage products={products} className="py-8 md:py-16" />
    </PageWrapper>
  );
};

export default ProductsPage;

export const getServerSideProps: GetServerSideProps<IProps> = async ({ query }) => {
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

    const { data: products } = await ProductsWebServices.find({
      page: query?.page ? query?.page?.toString() : '1',
      limit: query?.limit ? query?.limit?.toString() : '12',
      is_active: 'true',
    });

    return {
      props: {
        settingsIdentity: settings?.identity ?? null,
        pages: pages ?? [],
        products: products ?? [],
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
