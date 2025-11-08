import { cn } from '@lib/utils/cn';
import { IPage } from '@modules/pages/lib/interfaces';
import React from 'react';

interface IProps {
  className?: string;
  refundPolicyPage: IPage;
}

const RefundPolicySection: React.FC<IProps> = ({ className, refundPolicyPage }) => {
  return (
    <section className={cn('refund_policy_section', className)}>
      <div className="container">
        <div className="prose" dangerouslySetInnerHTML={{ __html: refundPolicyPage.content }} />
      </div>
    </section>
  );
};

export default RefundPolicySection;
