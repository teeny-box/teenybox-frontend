import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
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
  const { isAuthorLogined, author, date, title, isContentExsist, isPhotoExsist, rating, photo, content } = reviewInfo;

  const [expended, setExpended] = useState(false);
  const [alert, setAlert] = useState(null);

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
      <div className="play-review-list-box">
        <div className="play-review-rating">
          <Rating name="read-only" value={rating} precision={0.5} readOnly />
        </div>
        <div
          className="play-review-title"
          onClick={() => {
            setExpended(!expended);
          }}
        >
          {title} {isPhotoExsist ? <CameraAltIcon /> : ""}
        </div>
        <div className="play-review-accordion">
          {(isContentExsist || isPhotoExsist) && !expended && (
            <KeyboardArrowDownIcon
              className="play-review-detail-arrow"
              fontSize="large"
              onClick={() => {
                setExpended(!expended);
              }}
              sx={{ color: "#ffb400" }}
            />
          )}
          {(isContentExsist || isPhotoExsist) && expended && (
            <KeyboardArrowUpIcon
              className="play-review-detail-arrow"
              fontSize="large"
              onClick={() => {
                setExpended(!expended);
              }}
              sx={{ color: "#ffb400" }}
            />
          )}
        </div>
        <div className="review-author-and-date">
          <p>
            {isAuthorLogined}
            {author}
          </p>
          <p>{date}</p>
        </div>
      </div>
      {(isContentExsist || isPhotoExsist) && expended ? (
        <PlayReviewContentBox
          reviewContentInfo={{
            photoSrc: photo,
            title,
            content,
            isAuthorLogined,
          }}
          setIsReviewFormOpened={setIsReviewFormOpened}
          scrollRef={scrollRef}
          review_id={review_id}
          getPlayDetailInfo={getPlayDetailInfo}
          getReviews={getReviews}
          getUserReview={getUserReview}
          setAlert={setAlert}
        />
      ) : null}
    </>
  );
}
