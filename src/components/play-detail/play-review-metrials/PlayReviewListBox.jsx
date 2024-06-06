import React, { useState, useEffect } from "react";
import Backdrop from "@mui/material/Backdrop";
import "./PlayReviewListBox.scss";
import "../../common/themes/theme";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import Rating from "@mui/material/Rating";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PlayReviewContentBox from "./PlayReviewContentBox";
import { AlertCustom } from "../../common/alert/Alerts";

export default function PlayReviewListBox({ reviewInfo, setIsReviewFormOpened, review_id, scrollRef, getReviews, getUserReview, getPlayDetailInfo }) {
  const [alert, setAlert] = useState(null);
  const [sortedReviewInfo, setSortedReviewInfo] = useState([]);

  useEffect(() => {
    // 로그인된 사용자의 리뷰를 최상단으로 정렬
    const sortedReviews = [reviewInfo].sort((a, b) => b.isAuthorLogined - a.isAuthorLogined);
    setSortedReviewInfo(sortedReviews);
  }, [reviewInfo]);

  const [expandedReviews, setExpandedReviews] = useState({});

  const handleExpandClick = (index) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <>
      {alert && (
        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true} onClick={() => setAlert(null)}>
          <AlertCustom
            title={alert.title}
            content={alert.content}
            open={alert.open}
            onclose={alert.onclose}
            onclick={alert.onclick}
            severity={alert.severity}
            checkBtn={alert.checkBtn}
            closeBtn={alert.closeBtn}
            btnCloseHidden={alert.btnCloseHidden}
          />
        </Backdrop>
      )}
      {sortedReviewInfo.map((review, index) => (
        <React.Fragment key={index}>
          <div className="play-review-list-box" style={{ backgroundColor: expandedReviews[index] ? "#FFF7E6" : "initial" }}>
            <div className="play-review-rating">
              <Rating name="read-only" value={review.rating} precision={0.5} readOnly />
            </div>
            <div className="play-review-title" onClick={() => handleExpandClick(index)}>
              {review.title} {review.isPhotoExsist ? <CameraAltIcon /> : ""}
            </div>
            <div className="play-review-accordion">
              {(review.isContentExsist || review.isPhotoExsist) && !expandedReviews[index] && (
                <KeyboardArrowDownIcon
                  className="play-review-detail-arrow"
                  fontSize="large"
                  onClick={() => handleExpandClick(index)}
                  sx={{ color: "#ffb400" }}
                />
              )}
              {(review.isContentExsist || review.isPhotoExsist) && expandedReviews[index] && (
                <KeyboardArrowUpIcon className="play-review-detail-arrow" fontSize="large" onClick={() => handleExpandClick(index)} sx={{ color: "#ffb400" }} />
              )}
            </div>
            <div className="review-author-and-date">
              <p>{review.author}</p>
              <p>{review.date}</p>
            </div>
          </div>
          {(review.isContentExsist || review.isPhotoExsist) && expandedReviews[index] && (
            <PlayReviewContentBox
              reviewContentInfo={{
                photoSrc: review.photo,
                title: review.title,
                content: review.content,
                isAuthorLogined: review.isAuthorLogined,
              }}
              setIsReviewFormOpened={setIsReviewFormOpened}
              scrollRef={scrollRef}
              review_id={review_id}
              getPlayDetailInfo={getPlayDetailInfo}
              getReviews={getReviews}
              getUserReview={getUserReview}
              setAlert={setAlert}
            />
          )}
        </React.Fragment>
      ))}
    </>
  );
}
