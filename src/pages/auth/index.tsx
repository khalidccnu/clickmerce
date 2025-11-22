import PageWrapper from '@base/container/PageWrapper';
import { IBasePageProps } from '@base/interfaces';
import LoginSection from '@modules/auth/components/LoginSection';
import { SettingsServices } from '@modules/settings/lib/services';
import { GetServerSideProps, NextPage } from 'next';

interface IProps extends IBasePageProps {}

const AuthPage: NextPage<IProps> = ({ settingsIdentity }) => {
  return (
    <PageWrapper
      title="Log In"
      baseTitle={settingsIdentity?.name}
      description={settingsIdentity?.description}
      icon={settingsIdentity?.icon_url}
      image={settingsIdentity?.social_image_url}
    >
      <LoginSection settingsIdentity={settingsIdentity} />
    </PageWrapper>
  );
};

export default AuthPage;

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
        settingsTrackingCodes: settings?.tracking_codes ?? null,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
