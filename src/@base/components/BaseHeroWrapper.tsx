import React from 'react';
import Breadcrumb, { IBreadcrumb } from './Breadcrumb';

interface IProps {
  title: string;
  breadcrumb?: IBreadcrumb[];
}

const BaseHeroWrapper: React.FC<IProps> = ({ title, breadcrumb }) => {
  return (
    <div
      className="relative h-60 bg-cover bg-center bg-no-repeat before:content-[''] before:absolute before:left-0 before:top-0 before:w-full before:h-full dark:before:bg-[#202020] before:bg-[#f1f1f3] before:z-[-1]"
      style={{ background: 'url(/images/hero_wrapper_pattern.png) bottom center / cover no-repeat' }}
    >
      <div className="container h-full">
        <div className="flex flex-col justify-center items-center h-full">
          <h2 className="capitalize font-bold text-4xl dark:text-[var(--color-white)] text-[var(--color-dark-gray)]">
            {title}
          </h2>
          {breadcrumb && <Breadcrumb className="mt-4" items={breadcrumb} />}
        </div>
      </div>
    </div>
  );
};

export default BaseHeroWrapper;
