import SectionIntro from '@base/components/SectionIntro';
import { cn } from '@lib/utils/cn';
import { IProduct } from '@modules/products/lib/interfaces';
import React from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import RecommendedProductCard from './RecommendedProductCard';

interface IProps {
  className?: string;
  products: IProduct[];
}

const RecommendedProductsSection: React.FC<IProps> = ({ className, products }) => {
  return (
    <section className={cn('recommended_products_section', className)}>
      <div className="container">
        <SectionIntro
          title={
            <>
              <span>Recommended</span> Products
            </>
          }
          description="Explore our recommended products curated just for you"
          className="mb-8 lg:mb-16 text-center"
        />
        <div className="slider_wrapper">
          <div className="slider_content">
            <Swiper
              loop
              spaceBetween={25}
              slidesPerView={1}
              modules={[Navigation, Pagination]}
              navigation={{
                enabled: true,
                prevEl: '.rp_slider_prev_btn',
                nextEl: '.rp_slider_next_btn',
                disabledClass: 'rp_slider_disabled_btn',
              }}
              pagination={{ el: '.rp_slider_pagination', clickable: true }}
              breakpoints={{
                640: {
                  slidesPerView: products.length > 1 ? 1.2 : 1,
                },
              }}
            >
              {products.map((product) => (
                <SwiperSlide key={product.id} className="group" style={{ height: 'auto' }}>
                  <RecommendedProductCard
                    product={product}
                    className="group-[.swiper-slide-active]:bg-gray-300/50 h-full rounded-lg overflow-hidden"
                    wrapperClassName="bg-gray-50 max-w-xs h-full px-10 py-12 group-[.swiper-slide-active]:mx-auto group-[.swiper-slide-active]:bg-white"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="slider_controller">
            <div className="rp_slider_prev_btn">
              <IoIosArrowBack size={18} />
            </div>
            <div className="rp_slider_pagination" />
            <div className="rp_slider_next_btn">
              <IoIosArrowForward size={18} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecommendedProductsSection;
