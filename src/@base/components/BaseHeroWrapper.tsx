import React from 'react';
import Breadcrumb, { IBreadcrumb } from './Breadcrumb';

interface IProps {
  title: string;
  breadcrumb: IBreadcrumb[];
}

const BaseHeroWrapper: React.FC<IProps> = ({ title, breadcrumb }) => {
  return (
    <div
      className="relative h-60 bg-cover bg-center bg-no-repeat before:content-[''] before:absolute before:left-0 before:top-0 before:w-full before:h-full before:bg-[#0a111f] before:z-[-1]"
      style={{ backgroundImage: 'url(/images/hero_wrapper_pattern.png)' }}
    >
      <div className="container h-full">
        <div className="flex flex-col justify-center items-center h-full">
          <h2 className="capitalize font-bold text-4xl text-[var(--color-white)]">{title}</h2>
          <Breadcrumb className="mt-4" items={breadcrumb} />
        </div>
      </div>
    </div>
  );
};

export default BaseHeroWrapper;
