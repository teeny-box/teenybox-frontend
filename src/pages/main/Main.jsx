import React from "react";
import "./Main.scss";
import MainBanner from "../../components/main/MainBanner";
import MainBest from "../../components/main/MainBest";
import MainPreferredRegion from "../../components/main/MainPreferredRegion";
import MainChild from "../../components/main/MainChild";
import MainPublicity from "../../components/main/MainPublicity";
import MainReview from "../../components/main/MainReview";
import { UpButton } from "../../components/common/button/UpButton";

//Main
const Main = () => {
  return (
    <div className="main-container">
      <div
        className="banner-container"
        style={{
          backgroundImage: `url('/block.jpeg'`,
        }}
      >
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
      <div className="publicity-container">
        <MainPublicity />
      </div>
      <UpButton />
    </div>
  );
};

export default Main;
