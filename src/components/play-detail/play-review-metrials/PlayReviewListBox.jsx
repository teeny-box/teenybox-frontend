import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PlayReviewListBox.scss";
import "../../common/themes/theme";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import Rating from "@mui/material/Rating";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PlayReviewContentBox from "./PlayReviewContentBox";
import { AlertCustom } from "../../common/alert/Alerts";
import Backdrop from "@mui/material/Backdrop";
import { reviewUrl } from "../../../apis/apiURLs";

export default function PlayReviewListBox({
  reviewInfo,
  setIsReviewFormOpened,
  review_id,
  scrollRef,
  getReviews,
  getUserReview,
  getPlayDetailInfo,
}) {
  const {
    isAuthorLogined,
    author,
    date,
    title,
    isContentExsist,
    isPhotoExsist,
    rating,
    photo,
    content,
  } = reviewInfo;

  const navigate = useNavigate();

  const [expended, setExpended] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleDeleteBtnClick = () => {
    setAlert({
      title: `tennybox.com 내용:`,
      content: `리뷰를 정말 삭제하시겠습니까?`,
      open: true,
      onclose: () => setAlert(null),
      onclick: () => {
        setAlert(null);
        deleteReview(review_id);
        setIsReviewFormOpened(false);
      },
      severity: "warning",
      checkBtn: "확인",
      closeBtn: "취소",
    });
  };

  const deleteReview = (review_id) => {
    fetch(`${reviewUrl}/${review_id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          setAlert({
            title: `tennybox.com 내용:`,
            content: `리뷰 삭제에 성공하였습니다.`,
            open: true,
            onclose: () => {
              setAlert(null);
              getPlayDetailInfo();
              getReviews();
              getUserReview();
            },
            onclick: () => {
              setAlert(null);
              getPlayDetailInfo();
              getReviews();
              getUserReview();
            },
            severity: "success",
            checkBtn: "확인",
            btnCloseHidden: true,
          });
          // 알림이 열린 후 1000ms(1초) 후에 닫히도록 설정
          setTimeout(() => {
            setAlert(null);
            getPlayDetailInfo();
            getReviews();
            getUserReview();
          }, 1000);
        } else if (res.status === 401 || res.status === 403) {
          setAlert({
            title: "tennybox.com 내용:",
            content: "로그인이 필요한 서비스입니다. 로그인 하시겠습니까?",
            open: true,
            onclose: () => setAlert(null),
            onclick: () =>
              navigate("/signup-in", {
                state: { from: `${location.pathname}${location.search}` },
              }),
            severity: "info",
            checkBtn: "확인",
            closeBtn: "취소",
          });
        } else {
          setAlert({
            title: `tennybox.com 내용:`,
            content: `리뷰 삭제에 실패하였습니다.`,
            open: true,
            onclose: () => setAlert(null),
            severity: "error",
          });
        }
      })
      .catch((err) => {
        setAlert({
          title: `tennybox.com 내용:`,
          content: `리뷰 삭제에 실패하였습니다.`,
          open: true,
          onclose: () => setAlert(null),
          severity: "error",
        });
      });
  };

  return (
    <>
      {alert && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
          onClick={() => setAlert(null)}
        >
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
        <div className="review-author-and-date">
          <p>
            {isAuthorLogined ? "(MY)" : ""}
            {author}
          </p>
          <p>{date}</p>
        </div>
        <div
          className="play-review-title"
          onClick={() => {
            setExpended(!expended);
          }}
        >
          {isPhotoExsist ? <CameraAltIcon /> : ""} {title}
        </div>
        <div className="play-review-accordion">
          {(isContentExsist || isPhotoExsist) && !expended && (
            <KeyboardArrowDownIcon
              className="play-review-detail-arrow"
              color="ourGray"
              fontSize="large"
              onClick={() => {
                setExpended(!expended);
              }}
            />
          )}
          {(isContentExsist || isPhotoExsist) && expended && (
            <KeyboardArrowUpIcon
              className="play-review-detail-arrow"
              color="ourGray"
              fontSize="large"
              onClick={() => {
                setExpended(!expended);
              }}
            />
          )}
        </div>
        <div className="play-review-rating">
          <Rating name="read-only" value={rating} precision={0.5} readOnly />
        </div>
        <div className="play-review-remove">
          {isAuthorLogined ? (
            <DeleteIcon
              className="play-review-delete-icon"
              color="ourGray"
              onClick={() => handleDeleteBtnClick()}
            />
          ) : null}
        </div>
      </div>
      {(isContentExsist || isPhotoExsist) && expended ? (
        <PlayReviewContentBox
          reviewContentInfo={{
            photoSrc: photo,
            content: content,
            isAuthorLogined,
          }}
          setIsReviewFormOpened={setIsReviewFormOpened}
          scrollRef={scrollRef}
        />
      ) : null}
    </>
  );
}
