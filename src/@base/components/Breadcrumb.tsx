import { Paths } from '@lib/constant/paths';
import { cn } from '@lib/utils/cn';
import Link from 'next/link';
import React from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import { VscHome } from 'react-icons/vsc';

export interface IBreadcrumb {
  slug: string;
  name: string;
}

interface IProps {
  className?: string;
  items: IBreadcrumb[];
}

const Breadcrumb: React.FC<IProps> = ({ className, items }) => {
  return (
    <ul className={cn('flex items-center gap-2', className)}>
      <li className="breadcrumb_link">
        <Link href={Paths.root}>
          <VscHome size={24} className="text-gray-300" />
        </Link>
      </li>
      {items.map((item, idx) => (
        <React.Fragment key={item.name}>
          <li className="breadcrumb_separator text-gray-300">
            <IoIosArrowForward size={18} />
          </li>
          <li
            className={cn('breadcrumb_link text-gray-300 capitalize', {
              'active text-[var(--color-primary)] line-clamp-1': idx === items.length - 1,
            })}
          >
            <Link href={item.slug}>{item.name}</Link>
          </li>
        </React.Fragment>
      ))}
    </ul>
  );
};

export default Breadcrumb;
