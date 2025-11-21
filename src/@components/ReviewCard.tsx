import { cn } from '@lib/utils/cn';
import { IReview } from '@modules/reviews/lib/interfaces';
import { Avatar, Image, Rate } from 'antd';
import React, { useState } from 'react';
import { FaEye } from 'react-icons/fa';

interface IProps {
  className?: string;
  review: IReview;
}

const ReviewCard: React.FC<IProps> = ({ className, review }) => {
  const [previewImage, setPreviewImage] = useState<string>(null);

  return (
    <div
      className={cn(
        'review_card p-4 rounded-xl border relative border-gray-100',
        { 'pb-6': !!review?.image },
        className,
      )}
    >
      <Rate disabled allowHalf value={review?.rate} style={{ marginBottom: 8, color: 'var(--color-primary' }} />
      <p className="text-gray-500 text-sm md:text-base">{review?.comment}</p>
      <div className="flex items-center gap-2 mt-2">
        <Avatar size={24}>{review?.user?.name?.charAt(0)}</Avatar>
        <p className="text-base font-semibold text-[--color-primary]">{review?.user?.name}</p>
      </div>
      {!review?.image || (
        <div className="image_wrapper absolute bottom-0 right-0 bg-gray-100 px-2 py-1 rounded-tl-xl rounded-br-xl">
          {previewImage && (
            <Image
              wrapperStyle={{ display: 'none' }}
              preview={{
                visible: !!previewImage,
                onVisibleChange: (visible) => setPreviewImage(visible ? previewImage : null),
                afterOpenChange: (visible) => !visible && setPreviewImage(null),
              }}
              src={previewImage}
              alt="Preview"
            />
          )}
          <FaEye
            size={12}
            className="cursor-pointer hover:text-[--color-primary] transition-colors duration-500"
            onClick={() => setPreviewImage(review?.image)}
          />
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
