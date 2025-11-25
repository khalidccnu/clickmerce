import BaseHeroWrapper from '@base/components/BaseHeroWrapper';
import PageWrapper from '@base/container/PageWrapper';
import { IBasePageProps, IMetaResponse, TId } from '@base/interfaces';
import ProductsFilter from '@components/ProductsFilter';
import ProductsSection from '@components/ProductsSection';
import { Paths } from '@lib/constant/paths';
import { States } from '@lib/constant/states';
import useSessionState from '@lib/hooks/useSessionState';
import { pageTypes } from '@modules/pages/lib/enums';
import { PagesServices } from '@modules/pages/lib/services';
import { IProduct, IProductsFilter } from '@modules/products/lib/interfaces';
import { ProductsWebServices } from '@modules/products/lib/webServices';
import { SettingsServices } from '@modules/settings/lib/services';
import { Col, Row } from 'antd';
import { GetServerSideProps, NextPage } from 'next';

interface IProps extends IBasePageProps {
  products: IProduct[];
  productsMeta: IMetaResponse;
}

const ProductsPage: NextPage<IProps> = ({ settingsIdentity, products, productsMeta }) => {
  const [headerHeight] = useSessionState(States.landingHeaderHeight);
  const [isLandingHeaderScrollingDown] = useSessionState(States.landingHeaderScrollingDown);

  return (
    <PageWrapper
      title="Products"
      baseTitle={settingsIdentity?.name}
      description={settingsIdentity?.description}
      icon={settingsIdentity?.icon_url}
      image={settingsIdentity?.social_image_url}
    >
      <BaseHeroWrapper title="Products" breadcrumb={[{ name: 'products', slug: Paths.products.root }]} />
      <div className="container py-8 md:py-16">
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={8} xl={6}>
            <ProductsFilter
              className="lg:sticky"
              style={{ top: (isLandingHeaderScrollingDown ? 0 : headerHeight) + 16 + 'px' }}
            />
          </Col>
          <Col xs={24} lg={16} xl={18}>
            <ProductsSection showForProductsPage isContainerClass={false} products={products} meta={productsMeta} />
          </Col>
        </Row>
      </div>
    </PageWrapper>
  );
};

export default ProductsPage;

export const getServerSideProps: GetServerSideProps<IProps> = async ({ query }) => {
  const { page = '1', limit = '12', category_id }: IProductsFilter & { category_id?: TId } = query;

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

    const { data: products, meta: productsMeta } = await ProductsWebServices.find({
      page: page?.toString(),
      limit: limit?.toString(),
      category_ids: category_id ? [category_id] : undefined,
      is_active: 'true',
    });

    return {
      props: {
        settingsIdentity: settings?.identity ?? null,
        settingsTrackingCodes: settings?.tracking_codes ?? null,
        pages: pages ?? [],
        products: products ?? [],
        productsMeta: productsMeta ?? null,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
