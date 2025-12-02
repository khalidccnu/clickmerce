import { cn } from '@lib/utils/cn';
import { IFeature } from '@modules/features/lib/interfaces';
import React from 'react';

interface IProps {
  className?: string;
  feature: IFeature;
}

const WhyShopWithUsCard: React.FC<IProps> = ({ className, feature }) => {
  return (
    <div
      className={cn(
        'why_shop_with_us_card group bg-white dark:bg-[var(--color-rich-black)] p-4 rounded-xl border border-gray-100 dark:border-[var(--color-dark-gray)] text-center',
        className,
      )}
    >
      <div className="p-2 rounded-full bg-gray-50 group-hover:bg-gray-300/70 dark:bg-[var(--color-dark-gray)] dark:group-hover:bg-black/10 transition-[background-color] w-32 h-32 flex justify-center items-center mx-auto duration-500">
        <img src={feature.image} alt={feature.title} width={75} height={75} />
      </div>
      <p className="text-lg font-semibold mb-2 mt-4 text-[--color-primary]">{feature.title}</p>
      <p className="text-gray-500 dark:text-gray-300 text-sm md:text-base leading-relaxed">{feature.description}</p>
    </div>
  );
};

export default WhyShopWithUsCard;
