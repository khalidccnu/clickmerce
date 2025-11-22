import { ENUM_SORT_ORDER_TYPES } from '@base/enums';
import { IMetaResponse, TId } from '@base/interfaces';
import { cn } from '@lib/utils/cn';
import { Toolbox } from '@lib/utils/toolbox';
import { ReviewsHooks } from '@modules/reviews/lib/hooks';
import { IReview } from '@modules/reviews/lib/interfaces';
import { Alert, Pagination, Skeleton } from 'antd';
import React, { useMemo, useState } from 'react';
import ReviewCard from './ReviewCard';

interface IProps {
  className?: string;
  productId: TId;
  reviews: IReview[];
  reviewsMeta: IMetaResponse;
}

const ProductViewReviews: React.FC<IProps> = ({ className, productId, reviews, reviewsMeta }) => {
  const [initialCSR, setInitialCSR] = useState(false);
  const [reviewsOptions, setReviewsOptions] = useState({
    page: reviewsMeta?.page?.toString(),
    limit: reviewsMeta?.limit?.toString(),
  });

  const reviewsQuery = ReviewsHooks.useFindQuick({
    config: {
      queryKey: [],
      enabled: initialCSR,
    },
    options: {
      page: reviewsOptions.page,
      limit: reviewsOptions.limit,
      product_id: productId,
      sort_order: ENUM_SORT_ORDER_TYPES.DESC,
    },
  });

  const renderReviews = useMemo(() => {
    const isLoading = initialCSR && reviewsQuery.isLoading;
    const list = initialCSR ? reviewsQuery.data?.data : reviews;

    if (isLoading) {
      return [...Array(3)].map((_, idx) => <Skeleton key={idx} active paragraph={{ rows: 3 }} />);
    }

    if (Toolbox.isEmpty(list)) {
      return <Alert type="info" message="No reviews available" showIcon style={{ gridColumn: '1 / -1' }} />;
    }

    return list.map((review) => (
      <ReviewCard key={review.id} review={review} className="bg-white dark:bg-[var(--color-rich-black)]" />
    ));
  }, [initialCSR, reviewsQuery.isLoading, reviewsQuery.data?.data, reviews]);

  return (
    <div className={cn('product_view_reviews_section', className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{renderReviews}</div>
      {reviewsMeta?.total > +reviewsOptions.limit && (
        <Pagination
          style={{
            width: 'fit-content',
            marginInline: 'auto',
            marginTop: 16,
          }}
          defaultCurrent={+reviewsOptions?.page}
          total={reviewsMeta?.total}
          pageSize={+reviewsOptions?.limit}
          onChange={(page, limit) => {
            setInitialCSR(true);
            setReviewsOptions({ ...reviewsOptions, page: page.toString(), limit: limit.toString() });
          }}
        />
      )}
    </div>
  );
};

export default ProductViewReviews;
