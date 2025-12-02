import CustomLink from '@base/components/CustomLink';
import { Paths } from '@lib/constant/paths';
import { cn } from '@lib/utils/cn';
import { Toolbox } from '@lib/utils/toolbox';
import { ICategory } from '@modules/categories/lib/interfaces';
import React from 'react';

interface IProps {
  className?: string;
  isPlaceholder?: boolean;
  category: ICategory;
}

const CategoryCard: React.FC<IProps> = ({ className, isPlaceholder = false, category }) => {
  const name = category?.name ?? '';
  const imageSrc = category?.image || Toolbox.generateCharacterSvg({ character: name, type: 'url' });

  return (
    <div className={cn('category_card group relative pl-2', className)}>
      {isPlaceholder ? (
        <React.Fragment>
          <CustomLink type="hoverable" title="More Categories" href={Paths.categories} />
          <div className="image_wrapper relative">
            <div className="absolute w-full h-full bg-[var(--color-primary)] rounded-full top-2 -left-2" />
            <div className="bg-gray-200 dark:bg-gray-200/70 rounded-full relative">
              <img
                src="/images/dots_horizontal.svg"
                alt="More Categories"
                className="w-full h-auto aspect-square rounded-full"
              />
            </div>
          </div>
          <p className="text-lg font-semibold capitalize text-center mt-4 dark:text-white">More</p>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <CustomLink
            type="hoverable"
            title={name}
            href={{
              pathname: Paths.products.root,
              query: { category_id: category?.id },
            }}
          />
          <div className="image_wrapper relative">
            <div className="absolute w-full h-full bg-[var(--color-primary)] rounded-full top-2 -left-2" />
            <div className="bg-gray-200 dark:bg-gray-200/70 rounded-full relative overflow-hidden">
              <img
                src={imageSrc}
                alt={name}
                className="w-full h-auto aspect-square rounded-full group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>
          <p className="text-lg font-semibold capitalize text-center mt-4 dark:text-white group-hover:text-[var(--color-primary)] transition-[color] duration-500">
            {name}
          </p>
        </React.Fragment>
      )}
    </div>
  );
};

export default CategoryCard;
