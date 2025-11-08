import PageWrapper from '@base/container/PageWrapper';
import { ISettingsIdentity } from '@modules/settings/lib/interfaces';
import { SettingsServices } from '@modules/settings/lib/services';
import { GetServerSideProps, NextPage } from 'next';

interface IProps {
  settingsIdentity: ISettingsIdentity;
}

const HomePage: NextPage<IProps> = ({ settingsIdentity }) => {
  return (
    <PageWrapper
      title="Home"
      baseTitle={settingsIdentity?.name}
      description={settingsIdentity?.description}
      icon={settingsIdentity?.icon_url}
      image={settingsIdentity?.social_image_url}
    ></PageWrapper>
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
