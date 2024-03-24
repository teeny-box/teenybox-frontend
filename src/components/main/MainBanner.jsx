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
        className="mySwiper"
      >
        <SwiperSlide>
          <img className="footer-logo" src={`${process.env.PUBLIC_URL}/banner1.png`} alt="logo-image"></img>
        </SwiperSlide>
        <SwiperSlide>
          <img className="footer-logo" src={`${process.env.PUBLIC_URL}/banner2.png`} alt="logo-image"></img>
        </SwiperSlide>
        <SwiperSlide>
          <img className="footer-logo" src={`${process.env.PUBLIC_URL}/banner3.png`} alt="logo-image"></img>
        </SwiperSlide>
      </Swiper>
    </>
  );
}
