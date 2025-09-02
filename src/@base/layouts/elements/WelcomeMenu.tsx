import { Env } from '.environments';
import BaseModalWithoutClicker from '@base/components/BaseModalWithoutClicker';
import ThemeToggler from '@base/components/ThemeToggler';
import { AuthHooks } from '@modules/auth/lib/hooks';
import { useAuthSession } from '@modules/auth/lib/utils/client';
import ProfileCard from '@modules/ProfileCard';
import { Button, Dropdown } from 'antd';
import React, { useState } from 'react';
import { AiOutlineLogout, AiOutlineUser } from 'react-icons/ai';
import { FaUser } from 'react-icons/fa';

const signOutFn = AuthHooks.useSignOut;

interface IProps {
  className?: string;
}

const WelcomeMenu: React.FC<IProps> = ({ className }) => {
  const { isAuthenticate } = useAuthSession();
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);

  const profileQuery = AuthHooks.useProfile({
    config: {
      queryKey: [],
      enabled: isAuthenticate,
    },
  });

  const items = [
    {
      key: 'Profile',
      icon: <AiOutlineUser />,
      label: 'Profile',
      onClick: () => setProfileModalOpen(true),
    },
    {
      key: 'Signout',
      icon: <AiOutlineLogout />,
      label: 'Sign out',
      onClick: signOutFn,
    },
  ];

  return (
    <React.Fragment>
      <Dropdown
        className={className}
        popupRender={() => {
          return (
            <div className="bg-[var(--color-white)] dark:bg-[var(--color-rich-black)] p-4 border border-[var(--color-gray-100)] rounded-lg shadow-sm">
              <p className="font-medium text-xs text-[var(--color-gray-500)]">Welcome to {Env.webTitle}</p>
              <p className="font-semibold">{profileQuery.data?.data?.name}</p>
              <ul className="flex flex-col gap-2 border-t border-t-[var(--color-gray-100)] pt-4 mt-4">
                {items.map((item) => (
                  <li
                    key={item.key}
                    className="flex items-center gap-2 select-none hover:text-[var(--color-primary)] transition-colors duration-500 cursor-pointer"
                    onClick={item.onClick}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-center border-t border-t-[var(--color-gray-100)] pt-4 mt-4">
                <ThemeToggler />
              </div>
            </div>
          );
        }}
      >
        <Button className="rounded-full">
          <FaUser />
        </Button>
      </Dropdown>
      <BaseModalWithoutClicker
        destroyOnHidden
        footer={null}
        width={580}
        open={isProfileModalOpen}
        onCancel={() => setProfileModalOpen(false)}
        classNames={{ content: '!bg-transparent !shadow-none' }}
      >
        <ProfileCard user={profileQuery.data?.data} />
      </BaseModalWithoutClicker>
    </React.Fragment>
  );
};

export default WelcomeMenu;
