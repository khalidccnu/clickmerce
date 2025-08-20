import CustomLink from '@base/components/CustomLink';
import { Paths } from '@lib/constant/paths';
import { Toolbox } from '@lib/utils/toolbox';
import { getContentAccess } from '@modules/auth/lib/utils';
import { Menu } from 'antd';
import { FaUsers, FaUserShield, FaUserTag } from 'react-icons/fa';
import { GrUserAdmin } from 'react-icons/gr';
import { MdDashboard } from 'react-icons/md';
import { RiUserStarFill } from 'react-icons/ri';

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
      items={[
        {
          key: Paths.admin.root,
          icon: <MdDashboard />,
          label: <CustomLink href={Paths.admin.root}>Dashboard</CustomLink>,
        },
        getContentAccess({
          content: {
            key: Paths.admin.users.list,
            icon: <FaUsers />,
            label: <CustomLink href={Toolbox.appendPagination(Paths.admin.users.list)}>Users</CustomLink>,
          },
          allowedAccess: ['users:read'],
        }),
        getContentAccess({
          content: {
            key: Paths.admin.roleManager.root,
            icon: <FaUserShield />,
            label: 'Role Manager',
            children: [
              getContentAccess({
                content: {
                  key: Paths.admin.roleManager.permissionTypes.list,
                  icon: <RiUserStarFill />,
                  label: (
                    <CustomLink href={Toolbox.appendPagination(Paths.admin.roleManager.permissionTypes.list)}>
                      Permission Types
                    </CustomLink>
                  ),
                },
                allowedAccess: ['permission_types:read'],
              }),
              getContentAccess({
                content: {
                  key: Paths.admin.roleManager.permissions.list,
                  icon: <FaUserTag />,
                  label: (
                    <CustomLink href={Toolbox.appendPagination(Paths.admin.roleManager.permissions.list)}>
                      Permissions
                    </CustomLink>
                  ),
                },
                allowedAccess: ['permissions:read'],
              }),
              getContentAccess({
                content: {
                  key: Paths.admin.roleManager.roles.list,
                  icon: <GrUserAdmin />,
                  label: (
                    <CustomLink href={Toolbox.appendPagination(Paths.admin.roleManager.roles.list)}>Roles</CustomLink>
                  ),
                },
                allowedAccess: ['roles:read'],
              }),
            ],
          },
          allowedAccess: ['permission_types:read', 'permissions:read', 'roles:read'],
        }),
      ]}
    />
  );
};

export default AdminMenu;
