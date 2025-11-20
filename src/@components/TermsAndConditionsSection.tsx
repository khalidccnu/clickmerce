import { cn } from '@lib/utils/cn';
import { IPage } from '@modules/pages/lib/interfaces';
import React from 'react';

interface IProps {
  className?: string;
  termsAndConditionsPage: IPage;
}

const TermsAndConditionsSection: React.FC<IProps> = ({ className, termsAndConditionsPage }) => {
  return (
    <section className={cn('terms_and_conditions_section', className)}>
      <div className="container">
        <div className="prose" dangerouslySetInnerHTML={{ __html: termsAndConditionsPage.content }} />
      </div>
    </section>
  );
};

export default TermsAndConditionsSection;
