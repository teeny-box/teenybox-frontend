import "./PromotionBanner.scss";
import { Children, useEffect, useState } from "react";
import { ArrowBackIosRounded, ArrowForwardIosRounded, SmsOutlined, ThumbUpOutlined, VisibilityOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { Skeleton } from "@mui/material";
import getBestPromotionPlay from "../../utils/getBestPromotionPlay";
import TimeFormat from "../../components/common/time/TimeFormat";
import numberFormat from "../../utils/numberFormat";

export function PromotionBanner() {
  const [bannerList, setBannerList] = useState([]);
  const [bannerIndex, setBannerIndex] = useState(0);

  const getBannerList = async () => {
    const newList = await getBestPromotionPlay();
    setBannerList(newList.slice(0, 5));
  };

  const handleClickLeftArrow = () => {
    if (bannerIndex <= 0) {
      setBannerIndex(bannerList.length - 1);
    } else {
      setBannerIndex((cur) => cur - 1);
    }
  };

  const handleClickRightArrow = () => {
    if (bannerIndex >= bannerList.length - 1) {
      setBannerIndex(0);
    } else {
      setBannerIndex((cur) => cur + 1);
    }
  };

  useEffect(() => {
    getBannerList();
  }, []);

  return (
    <>
      {bannerList.length ? (
        <div className="promotion-banner-container">
          <img
            className={`bg-img`}
            src={bannerList[bannerIndex]?.image_url[0]} // "https://elice-5th.s3.amazonaws.com/promotions%252F1707380134216_teeny-box-icon.png"}
          />
          <div className="bg-mask">
            {Children.toArray(
              bannerList.map((post, idx) => (
                <div className={`absolute ${bannerIndex === idx && "visible"}`}>
                  <div className={"contents-container"}>
                    <Link className="poster" to={`/promotion/${post.promotion_number}`}>
                      <img src={post.image_url[0]} />
                    </Link>
                    <div className="right-box">
                      <div className="sub-title p1">인기 소규모 연극</div>
                      <h2 className="post-play-title">
                        <Link to={`/promotion/${post.promotion_number}`}>{post.play_title}</Link>
                      </h2>
                      <div className="post-title h2">
                        <Link to={`/promotion/${post.promotion_number}`}>{post.title}</Link>
                      </div>

                      <div className="content p1">
                        {post.start_date && post.end_date && (
                          <div className="date">
                            <span className="lable">공연기간</span>
                            <span className="line">|</span>
                            {post.start_date && <TimeFormat time={post.start_date} />}
                            {" ~ "}
                            {post.end_date && <TimeFormat time={post.end_date} />}
                          </div>
                        )}
                        {post.location && (
                          <div>
                            <span className="lable">장소</span>
                            <span className="line">|</span>
                            {post.location}
                          </div>
                        )}
                        {post.host && (
                          <div>
                            <span className="lable">주최</span>
                            <span className="line">|</span>
                            {post.host}
                          </div>
                        )}
                        {!post.runtime || (
                          <div>
                            <span className="lable">런타임</span>
                            <span className="line">|</span>
                            {post.runtime} 분
                          </div>
                        )}
                      </div>
                      <div className="footer">
                        <VisibilityOutlined />
                        <span>{numberFormat(post.views || 0)}</span>
                        <ThumbUpOutlined />
                        <span>{numberFormat(post.likes || 0)}</span>
                        <SmsOutlined />
                        <span>{numberFormat(post.commentsCount || 0)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )),
            )}
            {bannerList.length > 0 && (
              <>
                <ArrowBackIosRounded className="arrow-left pointer" onClick={handleClickLeftArrow} />
                <ArrowForwardIosRounded className="arrow-right pointer" onClick={handleClickRightArrow} />
              </>
            )}
          </div>
        </div>
      ) : (
        <Skeleton className="best-box" variant="rectangular" sx={{ borderRadius: "15px", marginBottom: "60px", marginTop: "30px" }} />
      )}
    </>
  );
}
