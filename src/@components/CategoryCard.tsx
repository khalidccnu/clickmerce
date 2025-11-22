import CustomLink from '@base/components/CustomLink';
import { Paths } from '@lib/constant/paths';
import { cn } from '@lib/utils/cn';
import { Toolbox } from '@lib/utils/toolbox';
import { ICategory } from '@modules/categories/lib/interfaces';
import Image from 'next/image';
import React from 'react';

interface IProps {
  className?: string;
  category: ICategory;
}

const CategoryCard: React.FC<IProps> = ({ className, category }) => {
  return (
    <div className={cn('category_card relative pl-2', className)}>
      <CustomLink
        type="hoverable"
        title={category?.name}
        href={{ pathname: Paths.products.root, query: { category_id: category?.id } }}
      />
      <div className="image_wrapper relative">
        <div className="absolute w-full h-full bg-[var(--color-primary)] rounded-full top-2 -left-2" />
        <div className="bg-gray-200 dark:bg-gray-200/70 rounded-full relative">
          <Image
            width={300}
            height={300}
            quality={100}
            src={category?.image || Toolbox.generateCharacterSvg({ character: category?.name, type: 'url' })}
            alt={category?.name}
            className="w-full h-auto aspect-square rounded-full"
          />
        </div>
      </div>
      <p className="text-lg font-semibold capitalize text-center mt-4 dark:text-white">{category?.name}</p>
    </div>
  );
};

export default CategoryCard;
