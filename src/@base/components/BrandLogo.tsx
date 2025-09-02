import { Env } from '.environments';
import { ImagePaths } from '@lib/constant/imagePaths';
import { Toolbox } from '@lib/utils/toolbox';
import Image from 'next/image';
import React from 'react';

interface IProps {
  className?: string;
  width?: number;
  height?: number;
}

const BrandLogo: React.FC<IProps> = ({ className, width = 180, height = 50 }) => {
  const renderImageFn = (src: string) => {
    const altText = `${Env.webTitleInitial ? Toolbox.toLowerText(Env.webTitleInitial) + ' ' : ''}logo`;

    return <Image priority width={width} height={height} src={src} alt={altText} className={className} />;
  };

  return renderImageFn(ImagePaths.logo);
};

export default BrandLogo;
