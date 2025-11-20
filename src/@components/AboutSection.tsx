import { cn } from '@lib/utils/cn';
import { IPage } from '@modules/pages/lib/interfaces';
import React from 'react';

interface IProps {
  className?: string;
  aboutPage: IPage;
}

const AboutSection: React.FC<IProps> = ({ className, aboutPage }) => {
  return (
    <section className={cn('about_section', className)}>
      <div className="container">
        <div className="prose" dangerouslySetInnerHTML={{ __html: aboutPage.content }} />
      </div>
    </section>
  );
};

export default AboutSection;
