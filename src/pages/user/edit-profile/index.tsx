import { HomeOutlined } from '@ant-design/icons';
import PageWrapper from '@base/container/PageWrapper';
import { Paths } from '@lib/constant/paths';
import { ISettingsIdentity } from '@modules/settings/lib/interfaces';
import { SettingsServices } from '@modules/settings/lib/services';
import { Breadcrumb } from 'antd';
import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';

const EditProfileForm = dynamic(() => import('@components/EditProfileForm'), { ssr: false });

interface IProps {
  settingsIdentity: ISettingsIdentity;
}

const EditProfilePage: NextPage<IProps> = ({ settingsIdentity }) => {
  return (
    <PageWrapper
      title="Edit Profile"
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
            title: 'Edit Profile',
          },
        ]}
      />
      <EditProfileForm className="mt-8" />
    </PageWrapper>
  );
};

export default EditProfilePage;

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
