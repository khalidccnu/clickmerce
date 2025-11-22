import { cn } from '@lib/utils/cn';
import React from 'react';

interface IProps {
  className?: string;
  subtitleClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  subtitle?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
}

const SectionIntro: React.FC<IProps> = ({
  className,
  subtitleClassName,
  titleClassName,
  descriptionClassName,
  subtitle,
  title,
  description,
}) => {
  return (
    <div className={cn('section_intro', className)}>
      <div className="intro_wrapper">
        {subtitle && (
          <p className={cn('intro_subtitle mb-2 text-gray-700 dark:text-gray-300 text-base', subtitleClassName)}>
            {subtitle}
          </p>
        )}
        <h2
          className={cn(
            'intro_title text-3xl md:text-4xl font-semibold [&_span]:text-[var(--color-primary)] dark:text-white',
            titleClassName,
          )}
        >
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              'intro_description mt-4 text-base md:text-lg text-gray-500 dark:text-gray-300',
              descriptionClassName,
            )}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default SectionIntro;
