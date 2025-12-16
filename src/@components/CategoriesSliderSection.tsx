import SectionIntro from '@base/components/SectionIntro';
import { IMetaResponse } from '@base/interfaces';
import { cn } from '@lib/utils/cn';
import { ICategory } from '@modules/categories/lib/interfaces';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import CategoryCard from './CategoryCard';

interface IProps {
  className?: string;
  categories: ICategory[];
  categoriesMeta: IMetaResponse;
}

const CategoriesSliderSection: React.FC<IProps> = ({ className, categories, categoriesMeta }) => {
  return (
    <section className={cn('categories_slider_section', className)}>
      <div className="container">
        <SectionIntro
          title={
            <>
              Categories of <span>Products</span>
            </>
          }
          description="Explore our diverse range of product categories to find exactly what you need"
          className="mb-8 lg:mb-16 text-center"
        />
        <div className="slider_wrapper">
          <div className="slider_content">
            <Swiper
              loop
              spaceBetween={24}
              slidesPerView={1.2}
              breakpoints={{
                640: {
                  slidesPerView: 1.2,
                },
                768: {
                  slidesPerView: 2.2,
                },
                1024: {
                  slidesPerView: 3.2,
                },
                1280: {
                  slidesPerView: 5.2,
                },
              }}
            >
              {categories.map((category) => {
                return (
                  <SwiperSlide key={category?.id}>
                    <CategoryCard category={category} />
                  </SwiperSlide>
                );
              })}
              {categoriesMeta.total > categoriesMeta.limit && (
                <SwiperSlide key="placeholder">
                  <CategoryCard isPlaceholder category={null} />
                </SwiperSlide>
              )}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSliderSection;
