import { cn } from '@lib/utils/cn';
import { IPage } from '@modules/pages/lib/interfaces';
import React from 'react';

interface IProps {
  className?: string;
  privacyPolicyPage: IPage;
}

const PrivacyPolicySection: React.FC<IProps> = ({ className, privacyPolicyPage }) => {
  return (
    <section className={cn('privacy_policy_section', className)}>
      <div className="container">
        <div className="prose" dangerouslySetInnerHTML={{ __html: privacyPolicyPage.content }} />
      </div>
    </section>
  );
};

export default PrivacyPolicySection;
