import { Env } from '.environments';
import { ImagePaths } from '@lib/constant/imagePaths';
import { Toolbox } from '@lib/utils/toolbox';
import { SettingsHooks } from '@modules/settings/lib/hooks';
import { Image } from '@unpic/react';
import React from 'react';

interface IProps {
  className?: string;
  isBrand?: boolean;
  width?: number;
  height?: number;
}

const BrandLogo: React.FC<IProps> = ({ className, isBrand = true, width = 180, height = 50 }) => {
  const settingsQuery = SettingsHooks.useFind({ config: { queryKey: [], enabled: isBrand } });

  if (settingsQuery.isLoading) {
    return null;
  }

  const renderImageFn = (src: string) => {
    const altText =
      (settingsQuery.data?.data?.identity?.initial_name ||
        (Env.webTitleInitial ? Toolbox.toLowerText(Env.webTitleInitial) : '')) + ' logo';

    return <Image priority width={width} height={height} src={src} alt={altText} className={className} />;
  };

  return renderImageFn(settingsQuery.data?.data?.identity?.logo_url || ImagePaths.logo);
};

export default BrandLogo;
