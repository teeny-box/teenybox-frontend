import "./MainBanner.scss";
import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";
// import required modules
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

export default function App() {
  return (
    <>
      <Swiper
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
    </>
  );
}
