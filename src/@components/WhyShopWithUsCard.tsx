import { cn } from '@lib/utils/cn';
import { IFeature } from '@modules/features/lib/interfaces';
import Image from 'next/image';
import React from 'react';

interface IProps {
  className?: string;
  feature: IFeature;
}

const WhyShopWithUsCard: React.FC<IProps> = ({ className, feature }) => {
  return (
    <div
      className={cn(
        'why_shop_with_us_card group bg-white p-4 rounded-xl border border-gray-100 text-center',
        className,
      )}
    >
      <div className="p-2 rounded-full bg-gray-50 group-hover:bg-gray-100 transition w-32 h-32 flex justify-center items-center mx-auto">
        <Image src={feature.image} alt={feature.title} width={75} height={75} />
      </div>
      <p className="text-lg font-semibold mb-2 mt-4 text-[--color-primary]">{feature.title}</p>
      <p className="text-gray-500 text-sm md:text-base leading-relaxed">{feature.description}</p>
    </div>
  );
};

export default WhyShopWithUsCard;
