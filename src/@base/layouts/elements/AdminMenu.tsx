import CustomLink from '@base/components/CustomLink';
import { Paths } from '@lib/constant/paths';
import { Toolbox } from '@lib/utils/toolbox';
import { getMenuItemsAccess } from '@modules/auth/lib/utils/client';
import { Menu } from 'antd';
import { BiCollection } from 'react-icons/bi';
import { FaTools, FaUsers, FaUserShield, FaUserTag } from 'react-icons/fa';
import { GiMedicines } from 'react-icons/gi';
import { GrUserAdmin } from 'react-icons/gr';
import { IoCubeOutline } from 'react-icons/io5';
import { MdDashboard, MdOutlineInventory2 } from 'react-icons/md';
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
          allowedPermissions: ['products:read', 'dosage_forms:read', 'generics:read', 'suppliers:read'],
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
