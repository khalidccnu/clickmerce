import CustomLink from '@base/components/CustomLink';
import { Paths } from '@lib/constant/paths';
import { AuthHooks } from '@modules/auth/lib/hooks';
import { useAuthSession } from '@modules/auth/lib/utils/client';
import { Menu } from 'antd';
import { AiOutlineLogout } from 'react-icons/ai';
import { GrShieldSecurity } from 'react-icons/gr';
import { LiaCartArrowDownSolid } from 'react-icons/lia';
import { MdDashboard, MdEdit, MdHome, MdLock } from 'react-icons/md';

interface IProps {
  className?: string;
  selectedKeys: string[];
  openKeys: string[];
  onOpenChange: (openKeys: string[]) => void;
}

const logoutFn = AuthHooks.useLogout;

const UserMenu: React.FC<IProps> = ({ className, selectedKeys, openKeys, onOpenChange }) => {
  const { user } = useAuthSession();

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
          key: Paths.root,
          icon: <MdHome />,
          label: <CustomLink href={Paths.root}>Home</CustomLink>,
        },
        ...(user?.is_admin
          ? [
              {
                key: Paths.admin.aRoot,
                icon: <GrShieldSecurity />,
                label: <CustomLink href={Paths.admin.aRoot}>Admin Panel</CustomLink>,
              },
            ]
          : []),
        {
          key: Paths.user.uRoot,
          icon: <MdDashboard />,
          label: <CustomLink href={Paths.user.uRoot}>Dashboard</CustomLink>,
        },
        {
          key: Paths.user.editProfile,
          icon: <MdEdit />,
          label: <CustomLink href={Paths.user.editProfile}>Edit Profile</CustomLink>,
        },
        {
          key: Paths.user.changePassword,
          icon: <MdLock />,
          label: <CustomLink href={Paths.user.changePassword}>Change Password</CustomLink>,
        },
        {
          key: Paths.user.orders.root,
          icon: <LiaCartArrowDownSolid />,
          label: <CustomLink href={Paths.user.orders.root}>Orders</CustomLink>,
        },
        {
          key: 'Logout',
          icon: <AiOutlineLogout />,
          label: 'Log Out',
          onClick: logoutFn,
        },
      ]}
    />
  );
};

export default UserMenu;
