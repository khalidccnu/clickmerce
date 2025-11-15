import Breadcrumb from '@base/components/Breadcrumb';
import { Paths } from '@lib/constant/paths';
import { cn } from '@lib/utils/cn';
import { IProduct } from '@modules/products/lib/interfaces';
import { Col, Grid, Row } from 'antd';
import Image from 'next/image';
import React, { useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { Navigation, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

interface IProps {
  className?: string;
  product: IProduct;
}

const ProductViewSection: React.FC<IProps> = ({ className, product }) => {
  const screens = Grid.useBreakpoint();
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <section className={cn('product_view_section', className)}>
      <div className="container">
        <Breadcrumb items={[{ name: product?.name, slug: Paths.products.toSlug(product?.slug) }]} />
        <Row gutter={[16, 16]} className="mt-4">
          <Col xs={24} lg={12}>
            <div className="space-y-4">
              <div className="slider_wrapper border rounded-2xl">
                <div className="slider_controller">
                  <div className="slider_prev_btn">
                    <IoIosArrowBack size={screens.md ? 32 : 24} />
                  </div>
                  <div className="slider_next_btn">
                    <IoIosArrowForward size={screens.md ? 32 : 24} />
                  </div>
                </div>
                <Swiper
                  spaceBetween={10}
                  thumbs={{ swiper: thumbsSwiper }}
                  modules={[Navigation, Thumbs]}
                  navigation={{
                    enabled: true,
                    prevEl: '.slider_prev_btn',
                    nextEl: '.slider_next_btn',
                    disabledClass: 'slider_disabled_btn',
                  }}
                >
                  {product?.images?.map((image, idx) => (
                    <SwiperSlide key={idx}>
                      <Image
                        width={500}
                        height={500}
                        src={image.url}
                        alt={product.name}
                        className="w-full h-auto object-cover"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={4}
                watchSlidesProgress={true}
                modules={[Navigation, Thumbs]}
                className="[&_.swiper-slide]:opacity-70 [&_.swiper-slide.swiper-slide-thumb-active]:opacity-100 [&_.swiper-wrapper]:items-center"
              >
                {product?.images?.map((image, idx) => (
                  <SwiperSlide key={idx}>
                    <Image
                      width={500}
                      height={500}
                      src={image.url}
                      alt={product.name}
                      className="w-full h-auto object-cover border rounded-2xl cursor-pointer"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </Col>
          <Col xs={24} lg={12}></Col>
        </Row>
      </div>
    </section>
  );
};

export default ProductViewSection;
