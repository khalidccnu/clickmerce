import { cn } from '@lib/utils/cn';
import React from 'react';

interface IProps {
  className?: string;
  subtitleClassName?: string;
  titleWrapperClassName?: string;
  titlePrefixClassName?: string;
  titleSuffixClassName?: string;
  titleClassName?: string;
  subtitle?: React.ReactNode;
  titlePrefix?: React.ReactNode;
  titleSuffix?: React.ReactNode;
  title: React.ReactNode;
}

const SectionIntro: React.FC<IProps> = ({
  className,
  subtitleClassName,
  titleWrapperClassName,
  titlePrefixClassName,
  titleSuffixClassName,
  titleClassName,
  subtitle,
  titlePrefix,
  titleSuffix,
  title,
}) => {
  return (
    <div className={cn('section_intro', className)}>
      <div className="intro_wrapper">
        {subtitle && <p className={cn('intro_subtitle', subtitleClassName)}>{subtitle}</p>}
        <h2 className={cn('intro_title_wrapper space-x-2.5', titleWrapperClassName)}>
          {titlePrefix && (
            <span
              className={cn(
                'intro_title_prefix text-2xl md:text-3xl xl:text-4xl font-semibold text-transparent [-webkit-text-stroke-width:_1px] [-webkit-text-stroke-color:_#111]',
                titlePrefixClassName,
              )}
            >
              {titlePrefix}
            </span>
          )}
          <span
            className={cn(
              'intro_title text-3xl md:text-4xl xl:text-5xl font-semibold relative before:content-[""] before:absolute before:-inset-1 before:-skew-y-3 before:bg-red-500/20 text-[var(--color-primary)]',
              titleClassName,
            )}
          >
            {title}
          </span>
          {titleSuffix && (
            <span
              className={cn(
                'intro_title_prefix text-2xl md:text-3xl xl:text-4xl font-semibold text-transparent [-webkit-text-stroke-width:_1px] [-webkit-text-stroke-color:_#111]',
                titleSuffixClassName,
              )}
            >
              {titleSuffix}
            </span>
          )}
        </h2>
      </div>
    </div>
  );
};

export default SectionIntro;
