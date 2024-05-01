import React from "react";
import "./Main.scss";
import { Helmet } from "react-helmet-async";
import MainBanner from "../../components/main/MainBanner";
import MainBest from "../../components/main/MainBest";
import MainPreferredRegion from "../../components/main/MainPreferredRegion";
import MainChild from "../../components/main/MainChild";
import MainPromotion from "../../components/main/MainPromotion";
import MainReview from "../../components/main/MainReview";
import { UpButton } from "../../components/common/button/UpButton";

// Main
export function Main() {
  return (
    <div className="main-container">
      <Helmet>
        <meta name="description" content="티니박스는 연극을 사랑하는 사람들이 연극을 찾고 홍보할 수 있는 소규모 연극 커뮤니티 사이트입니다." />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="티니박스(TeenyBox) 홈페이지" />
        <meta property="og:description" content="티니박스는 연극을 사랑하는 사람들이 연극을 찾고 홍보할 수 있는 소규모 연극 커뮤니티 사이트입니다." />
      </Helmet>
      <div className="banner-container">
        <MainBanner />
      </div>
      <div className="best-container">
        <MainBest />
      </div>
      <div className="child-container">
        <MainChild />
      </div>
      <div className="review-container">
        <MainReview />
      </div>
      <div className="promotion-container">
        <MainPromotion />
      </div>
      <div className="preferred-region-container">
        <MainPreferredRegion />
      </div>
      <UpButton />
    </div>
  );
}
