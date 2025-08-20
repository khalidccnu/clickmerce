import PageWrapper from '@base/container/PageWrapper';
import SignInSection from '@modules/auth/components/SignInSection';

const AuthPage = () => {
  return (
    <PageWrapper title="Sign In">
      <SignInSection />
    </PageWrapper>
  );
};

export default AuthPage;
