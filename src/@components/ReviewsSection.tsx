import SectionIntro from '@base/components/SectionIntro';
import { ENUM_SORT_ORDER_TYPES } from '@base/enums';
import { cn } from '@lib/utils/cn';
import { Toolbox } from '@lib/utils/toolbox';
import { ReviewsHooks } from '@modules/reviews/lib/hooks';
import React from 'react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import ReviewCard from './ReviewCard';

interface IProps {
  className?: string;
}

const ReviewsSection: React.FC<IProps> = ({ className }) => {
  const { isLoading, data: reviews } = ReviewsHooks.useFindQuick({
    options: { page: '1', limit: '12', sort_order: ENUM_SORT_ORDER_TYPES.DESC },
  });

  if (isLoading || Toolbox.isEmpty(reviews?.data)) {
    return;
  }

  return (
    <section className={cn('reviews_section', className)}>
      <div className="container">
        <SectionIntro
          title={
            <>
              Reviews From Our <span>Customers</span>
            </>
          }
          description="Hear what our satisfied customers have to say about their experiences"
          className="mb-8 lg:mb-16 text-center"
        />
        <div className="slider_wrapper">
          <div className="slider_content">
            <Swiper
              loop
              autoplay={{ delay: 5000, pauseOnMouseEnter: true }}
              modules={[Autoplay, Pagination]}
              pagination={{ el: '.rv_slider_pagination', clickable: true }}
              spaceBetween={24}
              slidesPerView={1}
              breakpoints={{
                640: {
                  slidesPerView: 1,
                },
                768: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
                1280: {
                  slidesPerView: 4,
                },
              }}
            >
              {reviews?.data?.map((review) => {
                return (
                  <SwiperSlide key={review?.id}>
                    <ReviewCard review={review} />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
          <div className="slider_controller">
            <div className="rv_slider_pagination" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
