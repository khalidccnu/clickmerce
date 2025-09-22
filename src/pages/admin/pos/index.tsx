import PageWrapper from '@base/container/PageWrapper';
import WithAuthorization from '@modules/auth/components/WithAuthorization';

const PosPage = () => {
  return <PageWrapper></PageWrapper>;
};

export default WithAuthorization(PosPage, { allowedPermissions: ['pos:read'] });
