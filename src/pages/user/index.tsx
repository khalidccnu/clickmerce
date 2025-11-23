import { HomeOutlined } from '@ant-design/icons';
import PageWrapper from '@base/container/PageWrapper';
import { Paths } from '@lib/constant/paths';
import { ISettingsIdentity } from '@modules/settings/lib/interfaces';
import { SettingsServices } from '@modules/settings/lib/services';
import { Breadcrumb } from 'antd';
import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';

const StatisticsList = dynamic(() => import('@components/StatisticsList'), { ssr: false });

interface IProps {
  settingsIdentity: ISettingsIdentity;
}

const HomePage: NextPage<IProps> = ({ settingsIdentity }) => {
  return (
    <PageWrapper
      title="Dashboard"
      baseTitle={settingsIdentity?.name}
      description={settingsIdentity?.description}
      icon={settingsIdentity?.icon_url}
      image={settingsIdentity?.social_image_url}
    >
      <Breadcrumb
        items={[
          {
            href: Paths.root,
            title: <HomeOutlined />,
          },
          {
            title: 'Dashboard',
          },
        ]}
      />
      <StatisticsList className="mt-8" />
    </PageWrapper>
  );
};

export default HomePage;

export const getServerSideProps: GetServerSideProps<IProps> = async () => {
  try {
    const { success, data: settings } = await SettingsServices.find();

    if (!success) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        settingsIdentity: settings?.identity ?? null,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
