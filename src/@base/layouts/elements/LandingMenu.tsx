import { Paths } from '@lib/constant/paths';
import { cn } from '@lib/utils/cn';
import { Button } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { BiCategory } from 'react-icons/bi';
import { FaHome, FaShoppingBag, FaTimes } from 'react-icons/fa';

const menuItems = [
  {
    name: 'Home',
    path: Paths.root,
    icon: <FaHome size={16} />,
  },
  {
    name: 'Categories',
    path: Paths.categories,
    icon: <BiCategory size={16} />,
  },
  {
    name: 'Products',
    path: Paths.products.root,
    icon: <FaShoppingBag size={16} />,
  },
];

interface IProps {
  isOpen: boolean;
  onChangeOpen: () => void;
}

const LandingMenu: React.FC<IProps> = ({ isOpen, onChangeOpen }) => {
  const pathname = usePathname();

  return (
    <div
      className={cn('fixed inset-0 z-[499] flex justify-end', isOpen ? 'pointer-events-auto' : 'pointer-events-none')}
    >
      <div
        onClick={onChangeOpen}
        className={cn(
          'absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0',
        )}
      />
      <div
        className={cn(
          'relative h-full max-w-72 w-full bg-white/60 dark:bg-black/60 backdrop-blur-xl shadow-2xl border-l border-white/20 transition-transform duration-300 ease-out overflow-y-auto overscroll-contain',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="absolute top-4 right-4">
          <Button onClick={onChangeOpen}>
            <FaTimes size={14} />
          </Button>
        </div>
        <div className="pt-16 px-8">
          <ul className="space-y-1 text-md font-medium">
            {menuItems.map(({ name, path, icon }, idx) => {
              const isActive = pathname === path;

              return (
                <li key={idx}>
                  <Link
                    href={path}
                    onClick={onChangeOpen}
                    className={cn(
                      'flex items-center gap-2 transition-colors duration-300 dark:text-white',
                      'hover:text-[var(--color-primary-active)] dark:hover:text-[var(--color-primary-active)]',
                      isActive && 'text-[var(--color-primary-active)] dark:text-[var(--color-primary-active)]',
                    )}
                  >
                    {icon}
                    {name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LandingMenu;
