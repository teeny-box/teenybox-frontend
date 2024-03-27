import React from "react";
import "./Main.scss";
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
      <div className="preferred-region-container">
        <MainPreferredRegion />
      </div>
      <div className="promotion-container">
        <MainPromotion />
      </div>
      <UpButton />
    </div>
  );
}
