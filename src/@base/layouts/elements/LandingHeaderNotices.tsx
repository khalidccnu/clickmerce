import CustomLink from '@base/components/CustomLink';
import Marquee from '@base/components/Marquee';
import { ENUM_SORT_ORDER_TYPES } from '@base/enums';
import { cn } from '@lib/utils/cn';
import { Toolbox } from '@lib/utils/toolbox';
import { NoticesHooks } from '@modules/notices/lib/hooks';
import React from 'react';

interface IProps {
  className?: string;
}

const LandingHeaderNotices: React.FC<IProps> = ({ className }) => {
  const noticesQuery = NoticesHooks.useFind({
    options: {
      page: '1',
      limit: '25',
      is_active: 'true',
      sort_order: ENUM_SORT_ORDER_TYPES.DESC,
    },
  });

  return (
    noticesQuery.isLoading ||
    (Toolbox.isNotEmpty(noticesQuery.data?.data) && (
      <div className={cn('landing_header_notices', className)}>
        <Marquee speed={70}>
          {noticesQuery.data?.data?.map((notice) => {
            const isAbsoluteUrl = Toolbox.isAbsoluteUrl(notice?.url);

            return (
              <p key={notice?.id} className="relative text-gray-700 dark:text-gray-300">
                {!notice?.url || (
                  <CustomLink
                    type="hoverable"
                    target={isAbsoluteUrl ? '_blank' : '_self'}
                    href={notice?.url}
                    title={notice?.name}
                  />
                )}
                <span>{notice?.content}</span>
              </p>
            );
          })}
        </Marquee>
      </div>
    ))
  );
};

export default LandingHeaderNotices;
