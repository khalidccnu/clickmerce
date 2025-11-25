import BaseHeroWrapper from '@base/components/BaseHeroWrapper';
import PageWrapper from '@base/container/PageWrapper';
import { IBasePageProps, IMetaResponse } from '@base/interfaces';
import CategoriesSection from '@components/CategoriesSection';
import { Paths } from '@lib/constant/paths';
import { ICategoriesFilter, ICategory } from '@modules/categories/lib/interfaces';
import { CategoriesServices } from '@modules/categories/lib/services';
import { pageTypes } from '@modules/pages/lib/enums';
import { PagesServices } from '@modules/pages/lib/services';
import { SettingsServices } from '@modules/settings/lib/services';
import { GetServerSideProps, NextPage } from 'next';

interface IProps extends IBasePageProps {
  categories: ICategory[];
  categoriesMeta: IMetaResponse;
}

const CategoriesPage: NextPage<IProps> = ({ settingsIdentity, categories, categoriesMeta }) => {
  return (
    <PageWrapper
      title="Categories"
      baseTitle={settingsIdentity?.name}
      description={settingsIdentity?.description}
      icon={settingsIdentity?.icon_url}
      image={settingsIdentity?.social_image_url}
    >
      <BaseHeroWrapper title="Categories" breadcrumb={[{ name: 'categories', slug: Paths.categories }]} />
      <CategoriesSection className="py-8 md:py-16" categories={categories} meta={categoriesMeta} />
    </PageWrapper>
  );
};

export default CategoriesPage;

export const getServerSideProps: GetServerSideProps<IProps> = async ({ query }) => {
  const { page = '1', limit = '12' }: ICategoriesFilter = query;

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

    const { data: categories, meta: categoriesMeta } = await CategoriesServices.find({
      page,
      limit,
      is_active: 'true',
    });

    return {
      props: {
        settingsIdentity: settings?.identity ?? null,
        settingsTrackingCodes: settings?.tracking_codes ?? null,
        pages: pages ?? [],
        categories: categories ?? [],
        categoriesMeta: categoriesMeta ?? null,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
