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
        <meta
          name="description"
          content="안녕하세요😊 개발자 취준생이 모여서 만든 연극 정보 사이트 “티니박스”를 소개합니다! 티니박스는 연극인들을 위한 활발한 커뮤니티를 만들자는 목적으로 제작되었으며, 연극을 사랑하는 사람들이 연극을 찾고 홍보할 수 있는 소규모 연극 커뮤니티 사이트입니다. 대학생 연극 동아리, 소규모 연극 동아리라면 티니박스를 이용해보세요! (현재 PC 버전으로 개발이 완료되었으며 앞으로 모바일 UI 및 기능을 추가할 예정입니다.)"
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="TeenyBox(티니박스) 홈페이지" />
        <meta
          property="og:description"
          content="안녕하세요😊 개발자 취준생이 모여서 만든 연극 정보 사이트 “티니박스”를 소개합니다! 티니박스는 연극인들을 위한 활발한 커뮤니티를 만들자는 목적으로 제작되었으며, 연극을 사랑하는 사람들이 연극을 찾고 홍보할 수 있는 소규모 연극 커뮤니티 사이트입니다. 대학생 연극 동아리, 소규모 연극 동아리라면 티니박스를 이용해보세요! (현재 PC 버전으로 개발이 완료되었으며 앞으로 모바일 UI 및 기능을 추가할 예정입니다.)"
        />
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
