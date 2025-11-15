import CustomLink from '@base/components/CustomLink';
import { cn } from '@lib/utils/cn';
import { Toolbox } from '@lib/utils/toolbox';
import { IBanner } from '@modules/banners/lib/interfaces';
import { Grid } from 'antd';
import Image from 'next/image';
import React from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { Autoplay, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

interface IProps {
  className?: string;
  banners: IBanner[];
}

const BannerSection: React.FC<IProps> = ({ className, banners }) => {
  const screens = Grid.useBreakpoint();

  return (
    <section className={cn('banner_section', className)}>
      <div className="slider_wrapper">
        <div className="slider_controller">
          <div className="slider_prev_btn">
            <IoIosArrowBack size={screens.md ? 32 : 24} />
          </div>
          {/* <div className="slider_pagination" /> */}
          <div className="slider_next_btn">
            <IoIosArrowForward size={screens.md ? 32 : 24} />
          </div>
        </div>
        <div className="slider_content">
          <Swiper
            loop
            autoplay={{ delay: 5000, pauseOnMouseEnter: true }}
            spaceBetween={25}
            modules={[
              Autoplay,
              Navigation,
              // Pagination
            ]}
            navigation={{
              enabled: true,
              prevEl: '.slider_prev_btn',
              nextEl: '.slider_next_btn',
              disabledClass: 'slider_disabled_btn',
            }}
            // pagination={{ el: '.slider_pagination' }}
            slidesPerView={1}
          >
            {banners.map((banner) => {
              const isAbsoluteUrl = Toolbox.isAbsoluteUrl(banner?.url);

              return (
                <SwiperSlide key={banner?.id} className="relative">
                  {!banner?.url || (
                    <CustomLink
                      type="hoverable"
                      target={isAbsoluteUrl ? '_blank' : '_self'}
                      href={banner?.url}
                      title={banner?.name}
                    />
                  )}
                  <Image
                    src={banner?.image}
                    alt={banner?.name}
                    width={0}
                    height={0}
                    quality={100}
                    sizes="50vw"
                    className="w-full h-auto aspect-[932_/_357]"
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default BannerSection;
