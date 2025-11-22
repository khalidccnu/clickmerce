import CustomLink from '@base/components/CustomLink';
import { ENUM_SORT_ORDER_TYPES } from '@base/enums';
import { Paths } from '@lib/constant/paths';
import { Toolbox } from '@lib/utils/toolbox';
import { getMenuItemsAccess } from '@modules/auth/lib/utils/client';
import { Menu } from 'antd';
import { AiOutlineBook } from 'react-icons/ai';
import { BiCategory, BiCollection } from 'react-icons/bi';
import { BsBoxSeam } from 'react-icons/bs';
import { FaTools, FaUsers, FaUserShield, FaUserTag, FaWallet } from 'react-icons/fa';
import { FiShoppingCart } from 'react-icons/fi';
import { GiMedicines } from 'react-icons/gi';
import { GrGallery, GrUserAdmin } from 'react-icons/gr';
import { IoCubeOutline, IoReceiptSharp, IoReturnUpBack } from 'react-icons/io5';
import { LiaCartArrowDownSolid } from 'react-icons/lia';
import {
  MdArticle,
  MdDashboard,
  MdDashboardCustomize,
  MdExtension,
  MdLocalOffer,
  MdOutlineCategory,
  MdOutlineInventory2,
  MdOutlineMap,
  MdOutlineViewCarousel,
  MdRateReview,
  MdSpaceDashboard,
  MdSwapHoriz,
} from 'react-icons/md';
import { RiUserStarFill } from 'react-icons/ri';
import { TbTruckDelivery } from 'react-icons/tb';

interface IProps {
  className?: string;
  selectedKeys: string[];
  openKeys: string[];
  onOpenChange: (openKeys: string[]) => void;
}

const AdminMenu: React.FC<IProps> = ({ className, selectedKeys, openKeys, onOpenChange }) => {
  return (
    <Menu
      className={className}
      mode="inline"
      theme="light"
      selectedKeys={selectedKeys}
      openKeys={openKeys}
      onOpenChange={onOpenChange}
      items={getMenuItemsAccess([
        {
          key: Paths.admin.root,
          icon: <MdDashboard />,
          label: <CustomLink href={Paths.admin.root}>Dashboard</CustomLink>,
        },
        {
          key: Paths.admin.galleries,
          icon: <GrGallery />,
          label: <CustomLink href={Toolbox.appendPagination(Paths.admin.galleries, 1, 12)}>Galleries</CustomLink>,
          allowedPermissions: ['galleries:read'],
        },
        {
          key: Paths.admin.users.list,
          icon: <FaUsers />,
          label: <CustomLink href={Toolbox.appendPagination(Paths.admin.users.list)}>Users</CustomLink>,
          allowedPermissions: ['users:read'],
        },
        {
          key: Paths.admin.roleManager.root,
          icon: <FaUserShield />,
          label: 'Role Manager',
          allowedPermissions: ['permission_types:read', 'permissions:read', 'roles:read'],
          children: [
            {
              key: Paths.admin.roleManager.permissionTypes.list,
              icon: <RiUserStarFill />,
              label: (
                <CustomLink href={Toolbox.appendPagination(Paths.admin.roleManager.permissionTypes.list)}>
                  Permission Types
                </CustomLink>
              ),
              allowedPermissions: ['permission_types:read'],
            },
            {
              key: Paths.admin.roleManager.permissions.list,
              icon: <FaUserTag />,
              label: (
                <CustomLink href={Toolbox.appendPagination(Paths.admin.roleManager.permissions.list)}>
                  Permissions
                </CustomLink>
              ),
              allowedPermissions: ['permissions:read'],
            },
            {
              key: Paths.admin.roleManager.roles.list,
              icon: <GrUserAdmin />,
              label: <CustomLink href={Toolbox.appendPagination(Paths.admin.roleManager.roles.list)}>Roles</CustomLink>,
              allowedPermissions: ['roles:read'],
            },
          ],
        },
        {
          key: Paths.admin.inventory.root,
          icon: <MdOutlineInventory2 />,
          label: 'Inventory',
          allowedPermissions: [
            'products:read',
            'categories:read',
            'dosage_forms:read',
            'generics:read',
            'suppliers:read',
          ],
          children: [
            {
              key: Paths.admin.inventory.products.list,
              icon: <IoCubeOutline />,
              label: (
                <CustomLink href={Toolbox.appendPagination(Paths.admin.inventory.products.list)}>Products</CustomLink>
              ),
              allowedPermissions: ['products:read'],
            },
            {
              key: Paths.admin.inventory.categories.list,
              icon: <BiCategory />,
              label: (
                <CustomLink href={Toolbox.appendPagination(Paths.admin.inventory.categories.list)}>
                  Categories
                </CustomLink>
              ),
              allowedPermissions: ['categories:read'],
            },
            {
              key: Paths.admin.inventory.dosageForms.list,
              icon: <GiMedicines />,
              label: (
                <CustomLink href={Toolbox.appendPagination(Paths.admin.inventory.dosageForms.list)}>
                  Dosage Forms
                </CustomLink>
              ),
              allowedPermissions: ['dosage_forms:read'],
            },
            {
              key: Paths.admin.inventory.generics.list,
              icon: <BiCollection />,
              label: (
                <CustomLink href={Toolbox.appendPagination(Paths.admin.inventory.generics.list)}>Generics</CustomLink>
              ),
              allowedPermissions: ['generics:read'],
            },
            {
              key: Paths.admin.inventory.suppliers.list,
              icon: <TbTruckDelivery />,
              label: (
                <CustomLink href={Toolbox.appendPagination(Paths.admin.inventory.suppliers.list)}>Suppliers</CustomLink>
              ),
              allowedPermissions: ['suppliers:read'],
            },
          ],
        },
        {
          key: Paths.admin.sale.root,
          icon: <FiShoppingCart />,
          label: 'Sale',
          allowedPermissions: ['orders:read', 'order_returns:read', 'order_payment_requests:read'],
          children: [
            {
              key: Paths.admin.sale.orders.list,
              icon: <LiaCartArrowDownSolid />,
              label: (
                <CustomLink
                  href={{
                    pathname: Paths.admin.sale.orders.list,
                    query: {
                      page: 1,
                      limit: 10,
                      sort_order: ENUM_SORT_ORDER_TYPES.DESC,
                    },
                  }}
                >
                  Orders
                </CustomLink>
              ),
              allowedPermissions: ['orders:read'],
            },
            {
              key: Paths.admin.sale.orderReturns.list,
              icon: <IoReturnUpBack />,
              label: (
                <CustomLink
                  href={{
                    pathname: Paths.admin.sale.orderReturns.list,
                    query: {
                      page: 1,
                      limit: 10,
                      sort_order: ENUM_SORT_ORDER_TYPES.DESC,
                    },
                  }}
                >
                  Order Returns
                </CustomLink>
              ),
              allowedPermissions: ['order_returns:read'],
            },
            {
              key: Paths.admin.sale.orderPaymentRequests.list,
              icon: <IoReceiptSharp />,
              label: (
                <CustomLink
                  href={{
                    pathname: Paths.admin.sale.orderPaymentRequests.list,
                    query: {
                      page: 1,
                      limit: 10,
                      sort_order: ENUM_SORT_ORDER_TYPES.DESC,
                    },
                  }}
                >
                  Order Payment Requests
                </CustomLink>
              ),
              allowedPermissions: ['order_payment_requests:read'],
            },
          ],
        },
        {
          key: Paths.admin.delivery.root,
          icon: <BsBoxSeam />,
          label: 'Delivery',
          allowedPermissions: ['delivery_service_types:read', 'delivery_zones:read'],
          children: [
            {
              key: Paths.admin.delivery.serviceTypes.list,
              icon: <MdOutlineCategory />,
              label: (
                <CustomLink href={Toolbox.appendPagination(Paths.admin.delivery.serviceTypes.list)}>
                  Service Types
                </CustomLink>
              ),
              allowedPermissions: ['delivery_service_types:read'],
            },
            {
              key: Paths.admin.delivery.zones.list,
              icon: <MdOutlineMap />,
              label: <CustomLink href={Toolbox.appendPagination(Paths.admin.delivery.zones.list)}>Zones</CustomLink>,
              allowedPermissions: ['delivery_zones:read'],
            },
          ],
        },
        {
          key: Paths.admin.coupons.list,
          icon: <MdLocalOffer />,
          label: <CustomLink href={Toolbox.appendPagination(Paths.admin.coupons.list)}>Coupons</CustomLink>,
          allowedPermissions: ['coupons:read'],
        },
        {
          key: Paths.admin.paymentMethods.list,
          icon: <FaWallet />,
          label: (
            <CustomLink href={Toolbox.appendPagination(Paths.admin.paymentMethods.list)}>Payment Methods</CustomLink>
          ),
          allowedPermissions: ['payment_methods:read'],
        },
        {
          key: Paths.admin.tallyKhata.root,
          icon: <AiOutlineBook />,
          label: 'Tally Khata',
          allowedPermissions: ['tally_khata_dashboard:read', 'transactions:read'],
          children: [
            {
              key: Paths.admin.tallyKhata.dashboard.root,
              icon: <MdSpaceDashboard />,
              label: <CustomLink href={Paths.admin.tallyKhata.dashboard.root}>Dashboard</CustomLink>,
              allowedPermissions: ['tally_khata_dashboard:read'],
            },
            {
              key: Paths.admin.tallyKhata.transactions.list,
              icon: <MdSwapHoriz />,
              label: (
                <CustomLink
                  href={{
                    pathname: Paths.admin.tallyKhata.transactions.list,
                    query: {
                      page: 1,
                      limit: 10,
                      sort_order: ENUM_SORT_ORDER_TYPES.DESC,
                    },
                  }}
                >
                  Transactions
                </CustomLink>
              ),
              allowedPermissions: ['transactions:read'],
            },
          ],
        },
        {
          key: Paths.admin.cms.root,
          icon: <MdDashboardCustomize />,
          label: 'CMS',
          allowedPermissions: ['banners:read', 'features:read', 'reviews:read', 'pages:read'],
          children: [
            {
              key: Paths.admin.cms.banners.list,
              icon: <MdOutlineViewCarousel />,
              label: <CustomLink href={Toolbox.appendPagination(Paths.admin.cms.banners.list)}>Banners</CustomLink>,
              allowedPermissions: ['banners:read'],
            },
            {
              key: Paths.admin.cms.features.list,
              icon: <MdExtension />,
              label: <CustomLink href={Toolbox.appendPagination(Paths.admin.cms.features.list)}>Features</CustomLink>,
              allowedPermissions: ['features:read'],
            },
            {
              key: Paths.admin.cms.reviews.list,
              icon: <MdRateReview />,
              label: (
                <CustomLink
                  href={{
                    pathname: Paths.admin.cms.reviews.list,
                    query: {
                      page: 1,
                      limit: 10,
                      sort_order: ENUM_SORT_ORDER_TYPES.DESC,
                    },
                  }}
                >
                  Reviews
                </CustomLink>
              ),
              allowedPermissions: ['reviews:read'],
            },
            {
              key: Paths.admin.cms.pages.list,
              icon: <MdArticle />,
              label: <CustomLink href={Toolbox.appendPagination(Paths.admin.cms.pages.list)}>Pages</CustomLink>,
              allowedPermissions: ['pages:read'],
            },
          ],
        },
        {
          key: Paths.admin.settings.root,
          icon: <FaTools />,
          label: <CustomLink href={Paths.admin.settings.root}>Settings</CustomLink>,
          allowedPermissions: ['settings:read'],
        },
      ])}
    />
  );
};

export default AdminMenu;
