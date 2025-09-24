import PageWrapper from '@base/container/PageWrapper';
import WithAuthorization from '@modules/auth/components/WithAuthorization';
import ProductCatalog from '@modules/pos/components/ProductCatalog';

const PosPage = () => {
  return (
    <PageWrapper>
      <ProductCatalog />
    </PageWrapper>
  );
};

export default WithAuthorization(PosPage, { allowedPermissions: ['pos:read'] });
