import { Messages } from '@lib/constant/messages';
import type { PaginationProps } from 'antd';
import { Empty, Pagination, Spin, message } from 'antd';
import React from 'react';
import { GalleriesHooks } from '../lib/hooks';
import { IGallery } from '../lib/interfaces';
import GalleriesCard from './GalleriesCard';

interface IProps {
  isLoading: boolean;
  data: IGallery[];
  pagination: PaginationProps;
}

const GalleriesList: React.FC<IProps> = ({ isLoading, data, pagination }) => {
  const [messageApi, messageHolder] = message.useMessage();

  const galleriesDeleteFn = GalleriesHooks.useDelete({
    config: {
      onSuccess(res) {
        if (!res.success) {
          messageApi.error(res.message);
          return;
        }

        messageApi.success(Messages.delete);
      },
    },
  });

  return (
    <React.Fragment>
      {messageHolder}
      {isLoading ? (
        <div className="text-center">
          <Spin />
        </div>
      ) : data?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 [&_>_.galleries\_card:not(:hover)]:has-[.galleries\_card:hover]:opacity-50 [&_>_.galleries\_card:not(:hover)]:has-[.galleries\_card:hover]:transition-opacity [&_>_.galleries\_card:not(:hover)]:has-[.galleries\_card:hover]:duration-500">
          {data.map((elem) => (
            <GalleriesCard key={elem?.id} gallery={elem} onDelete={galleriesDeleteFn.mutate} />
          ))}
        </div>
      ) : (
        <Empty description="No Files!" />
      )}
      <div className="flex justify-end mt-4 pagination">
        <Pagination {...pagination} />
      </div>
    </React.Fragment>
  );
};

export default GalleriesList;
