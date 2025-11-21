import SectionIntro from '@base/components/SectionIntro';
import { cn } from '@lib/utils/cn';
import { IReview } from '@modules/reviews/lib/interfaces';
import React from 'react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import ReviewCard from './ReviewCard';

interface IProps {
  className?: string;
  reviews: IReview[];
}

const ReviewsSection: React.FC<IProps> = ({ className, reviews }) => {
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
              spaceBetween={25}
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
              {reviews.map((review) => {
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
