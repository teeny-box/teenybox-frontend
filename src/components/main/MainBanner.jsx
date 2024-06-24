import "./MainBanner.scss";
import React, { useState, useEffect } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";
// import required modules
import { Autoplay, Pagination, EffectFade, Navigation } from "swiper/modules";

export default function App() {
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);

  // 화면 너비 조절 이벤트를 듣도록 하기
  useEffect(() => {
    const resizeListener = () => {
      setInnerWidth(window.innerWidth);
    };
    window.addEventListener("resize", resizeListener);
  });

  return (
    <div className="banner-layout-container">
      {innerWidth > 768 ? (
        <Swiper
          spaceBetween={30}
          effect={"fade"}
          centeredSlides={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          loop={true}
          pagination={{
            type: "bullets", // 버튼 모양 결정 "bullets", "fraction"
            clickable: true,
          }}
          modules={[Autoplay, Pagination, EffectFade, Navigation]}
          className="swiper"
        >
          <SwiperSlide>
            <img src={`${process.env.PUBLIC_URL}/banner.svg`} alt="banner-image"></img>
          </SwiperSlide>
          <SwiperSlide>
            <img src={`${process.env.PUBLIC_URL}/banner2.svg`} alt="banner-image"></img>
          </SwiperSlide>
          <SwiperSlide>
            <img src={`${process.env.PUBLIC_URL}/banner3.svg`} alt="banner-image"></img>
          </SwiperSlide>
        </Swiper>
      ) : innerWidth > 480 ? (
        <Swiper
          loop={true}
          spaceBetween={0}
          effect={"fade"}
          centeredSlides={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{
            type: "bullets", // 버튼 모양 결정 "bullets", "fraction"
            clickable: true,
          }}
          modules={[Autoplay, Pagination, EffectFade]}
        >
          <SwiperSlide>
            <img src={`${process.env.PUBLIC_URL}/tabletBanner1.svg`} alt="banner-image"></img>
          </SwiperSlide>
          <SwiperSlide>
            <img src={`${process.env.PUBLIC_URL}/tabletBanner2.svg`} alt="banner-image"></img>
          </SwiperSlide>
          <SwiperSlide>
            <img src={`${process.env.PUBLIC_URL}/tabletBanner3.svg`} alt="banner-image"></img>
          </SwiperSlide>
        </Swiper>
      ) : (
        <Swiper
          loop={true}
          spaceBetween={0}
          effect={"fade"}
          centeredSlides={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{
            type: "bullets", // 버튼 모양 결정 "bullets", "fraction"
            clickable: true,
          }}
          modules={[Autoplay, Pagination, EffectFade]}
        >
          <SwiperSlide>
            <img src={`${process.env.PUBLIC_URL}/mobileBanner1.svg`} alt="banner-image"></img>
          </SwiperSlide>
          <SwiperSlide>
            <img src={`${process.env.PUBLIC_URL}/mobileBanner2.svg`} alt="banner-image"></img>
          </SwiperSlide>
          <SwiperSlide>
            <img src={`${process.env.PUBLIC_URL}/mobileBanner3.svg`} alt="banner-image"></img>
          </SwiperSlide>
        </Swiper>
      )}
    </div>
  );
}
