import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./ReviewForm.scss";
import { AlertCustom } from "../../common/alert/Alerts";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import ReviewErrorBox from "./ReviewErrorBox";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import IconButton from "@mui/material/IconButton";
import Backdrop from "@mui/material/Backdrop";
import { reviewUrl, presignedUrl } from "../../../apis/apiURLs";

export default function ReviewForm({
  purpose,
  review_id,
  review_title,
  review_author,
  review_content,
  review_rate,
  review_image_urls,
  setIsReviewFormOpened,
  showId,
  getReviews,
  getUserReview,
  getPlayDetailInfo,
}) {
  const navigate = useNavigate();
  const [title, setTitle] = useState(review_title || "");
  const [content, setContent] = useState(
    review_content === "null" ? "" : review_content ? review_content : ""
  );
  const [ratingValue, setRatingValue] = useState(review_rate || 0);
  const [photo, setPhoto] = useState(
    review_image_urls?.length ? review_image_urls : []
  );
  const [deletedPhoto, setDeletedPhoto] = useState([]);
  // fixed된 알림을 띄우기 위한 상태
  const [alert, setAlert] = useState(null);
  // 리뷰 에러 box에 담을 에러 문구
  const [reviewErrorText, setReviewErrorText] = useState("");

  const fileInput = useRef(null);

  const getPresignedUrl = async (file) => {
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    if (file?.size > maxSizeInBytes) {
      setReviewErrorText("사진은 장당 5MB 이하로만 등록이 가능합니다.");
      return;
    }

    try {
      const presignRes = await fetch(`${presignedUrl}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key: file.name }),
      });

      if (presignRes.ok) {
        const data = await presignRes.json();
        const { presigned_url, public_url } = data;
        const uploadRes = await fetch(presigned_url, {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        });

        if (uploadRes.ok) {
          setPhoto((prev) => [...prev, public_url]);
          if (
            reviewErrorText ===
              "사진 등록에 실패하였습니다. 다시 시도해 주세요." ||
            reviewErrorText === "사진은 장당 5MB 이하로만 등록이 가능합니다."
          ) {
            setReviewErrorText(null);
          }
          document.getElementById("fileInput").value = "";
        } else {
          setReviewErrorText("사진 등록에 실패하였습니다. 다시 시도해 주세요.");
        }
      } else {
        setReviewErrorText("사진 등록에 실패하였습니다. 다시 시도해 주세요.");
      }
    } catch (err) {
      setReviewErrorText("사진 등록에 실패하였습니다. 다시 시도해 주세요.");
    }
  };

  const handleImgUploadBtnClick = () => {
    fileInput.current.click();
  };

  const handleCancelBtnClick = () => {
    setAlert({
      title: `tennybox.com 내용:`,
      content: `리뷰 ${purpose}을 취소하시겠습니까? ${purpose}한 글 내용은 저장되지 않습니다.`,
      open: true,
      onclose: () => setAlert(null),
      onclick: () => {
        setIsReviewFormOpened(false);
        setAlert(null);
      },
      severity: "warning",
      checkBtn: "확인",
      closeBtn: "취소",
    });
  };

  const handleDeletePhoto = (itemIdx) => {
    setDeletedPhoto((prev) => [...prev, photo[itemIdx]]);
    setPhoto((prev) => {
      const newArray = [...prev];
      newArray.splice(itemIdx, 1);
      return newArray;
    });
    // 파일 인풋 초기화
    document.getElementById("fileInput").value = "";
  };

  const handleImageSelect = (image) => {
    if (photo.length === 3) {
      setReviewErrorText("사진은 최대 3장만 업로드 가능합니다.");
    } else if (!image) {
      return;
    } else {
      getPresignedUrl(image);
    }
  };

  // 리뷰 작성 or 수정 완료 후 제출 시
  const handleCompelteBtnClick = () => {
    if (!title || !ratingValue || !content) {
      // setReviewValidation(false);
      setReviewErrorText(
        "제목, 별점, 내용은 필수 입력값입니다. 입력 후 다시 제출해 주세요."
      );
      return;
    }
    const body = {
      title,
      content,
      rate: ratingValue,
      imageUrls: photo,
      imageUrlsToDelete: deletedPhoto,
    };

    if (purpose === "작성") postReview(body);
    else if (purpose === "수정") patchReview(body);
  };

  // 리뷰 '작성' 시의 fetch
  const postReview = (body) => {
    fetch(`${reviewUrl}/${showId}`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (res.ok) {
          setAlert({
            title: `tennybox.com 내용:`,
            content: `리뷰 ${purpose}이 완료되었습니다.`,
            open: true,
            onclose: () => {
              setAlert(null);
              setIsReviewFormOpened(false);
              getPlayDetailInfo();
              getReviews();
              getUserReview();
            },
            onclick: () => {
              setAlert(null);
              setIsReviewFormOpened(false);
              getPlayDetailInfo();
              getReviews();
              getUserReview();
            },
            severity: "success",
            checkBtn: "확인",
            btnCloseHidden: true,
            time: 1000,
          });
        } else if (res.status === 401 || res.status === 403) {
          setAlert({
            title: "tennybox.com 내용:",
            content: "로그인이 필요한 서비스입니다. 로그인 하시겠습니까?",
            open: true,
            onclose: () => setAlert(null),
            onclick: () => {
              navigate("/signup-in", {
                state: { from: `${location.pathname}${location.search}` },
              });
            },
            severity: "info",
            checkBtn: "확인",
            closeBtn: "취소",
          });
        } else if (res.status === 413) {
          setAlert({
            title: "tennybox.com 내용:",
            content:
              "파일 크기가 제한을 초과하였습니다. 파일 용량을 확인해 주세요.",
            open: true,
            onclose: () => setAlert(null),
            severity: "error",
          });
        } else {
          setAlert({
            title: "tennybox.com 내용:",
            content: "리뷰 업로드에 실패하였습니다.",
            open: true,
            onclose: () => setAlert(null),
            severity: "error",
          });
        }
      })
      .catch((err) => {
        setAlert({
          title: "tennybox.com 내용:",
          content: "리뷰 업로드에 실패하였습니다.",
          open: true,
          onclose: () => setAlert(null),
          severity: "error",
        });
      });
  };

  // 리뷰 '수정' 시의 fetch
  const patchReview = (body) => {
    fetch(`${reviewUrl}/${review_id}`, {
      credentials: "include",
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (res.ok) {
          setAlert({
            title: `tennybox.com 내용:`,
            content: `리뷰 ${purpose}이 완료되었습니다.`,
            open: true,
            onclose: () => {
              setAlert(null);
              setIsReviewFormOpened(false);
              getPlayDetailInfo();
              getReviews();
              getUserReview();
            },
            onclick: () => {
              setAlert(null);
              setIsReviewFormOpened(false);
              getPlayDetailInfo();
              getReviews();
              getUserReview();
            },
            severity: "success",
            checkBtn: "확인",
            btnCloseHidden: true,
            time: 1000,
          });
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
        } else if (res.status === 413) {
          setAlert({
            title: "tennybox.com 내용:",
            content:
              "파일 크기가 제한을 초과하였습니다. 파일 용량을 확인해 주세요.",
            open: true,
            onclose: () => setAlert(null),
            severity: "error",
          });
        } else {
          setAlert({
            title: "tennybox.com 내용:",
            content: "리뷰 업로드에 실패하였습니다.",
            open: true,
            onclose: () => setAlert(null),
            severity: "error",
          });
        }
      })
      .catch((err) => {
        setAlert({
          title: "tennybox.com 내용:",
          content: "리뷰 업로드에 실패하였습니다.",
          open: true,
          onclose: () => setAlert(null),
          severity: "error",
        });
      });
  };

  return (
    <>
      {alert &&
        (alert.content ===
          "로그인이 필요한 서비스입니다. 로그인 하시겠습니까?" ||
        alert.content ===
          `리뷰 ${purpose}을 취소하시겠습니까? ${purpose}한 글 내용은 저장되지 않습니다.` ? (
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
              time={alert.time}
            />
          </Backdrop>
        ) : (
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
            time={alert.time}
          />
        ))}
      <form className="review-form-container">
        <h2>관람 후기 {purpose}</h2>
        <div className="review-author-box">
          <h3>작성자</h3>
          <p>{review_author}</p>
        </div>
        <div className="review-title-box">
          <h3>* 제목</h3>
          <TextField
            variant="standard"
            minRows="false"
            maxRows="true"
            rows="8"
            InputProps={{ placeholder: "제목을 입력해주세요." }}
            sx={{ width: 550 }}
            inputProps={{ maxLength: 30 }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            helperText="제목은 1자 이상 30자 이하로 작성 가능합니다."
          />
        </div>
        <div className="review-content-box">
          <h3>* 후기 내용</h3>
          <TextField
            variant="outlined"
            multiline
            rows={10}
            InputProps={{ placeholder: "내용을 입력해주세요." }}
            sx={{ width: 1000, height: 280 }}
            inputProps={{ maxLength: 500 }}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            helperText="내용은 1자 이상 500자 이하로 작성 가능합니다."
          />
        </div>
        <div className="review-rating-box">
          <h3>* 별점</h3>
          <Rating
            name="simple-controlled"
            value={ratingValue}
            onChange={(event, newValue) => {
              setRatingValue(newValue);
            }}
            precision={0.5}
          />
        </div>
        <div className="reivew-photo-upload-box">
          <h3>사진 첨부</h3>
          <Button
            className="file-upload-btn"
            color="darkGray"
            variant="outlined"
            size="small"
            startIcon={<DriveFolderUploadIcon />}
            onClick={() => handleImgUploadBtnClick()}
          >
            <label htmlFor="image">파일 찾기</label>
          </Button>
          <input
            type="file"
            className="file-input"
            ref={fileInput}
            onChange={(e) => handleImageSelect(e.target.files[0])}
            accept=".png, .jpg, .jpeg"
            id="fileInput"
          />
        </div>
        <div style={{ display: "flex" }}>
          {photo.length
            ? photo.map((item, idx) => (
                <div key={idx}>
                  <img
                    src={
                      typeof item === "string"
                        ? item
                        : URL.createObjectURL(item)
                    }
                    alt="리뷰 첨부 이미지"
                  />
                  <IconButton
                    sx={{
                      position: "relative",
                      bottom: "125px",
                      right: "36px",
                      padding: 0,
                    }}
                    onClick={() => handleDeletePhoto(idx)}
                  >
                    <HighlightOffIcon
                      color="ourGray"
                      sx={{
                        width: "27px",
                        height: "27px",
                      }}
                    />
                  </IconButton>
                </div>
              ))
            : null}
        </div>
        <div className="review-guide-text">
          <p>- * 표시가 되어 있는 항목은 필수 기재 항목입니다.</p>
          <p>- 사진은 3장까지 업로드 가능합니다. (최대 5MB)</p>
        </div>
        {reviewErrorText && <ReviewErrorBox errorText={reviewErrorText} />}
        <div className="play-review-btn">
          <Button
            variant="contained"
            className="play-review-btn"
            onClick={() => handleCompelteBtnClick()}
          >
            {purpose} 완료
          </Button>
          <Button
            variant="outlined"
            color="error"
            className="play-review-btn"
            onClick={() => handleCancelBtnClick()}
          >
            {purpose} 취소
          </Button>
        </div>
      </form>
    </>
  );
}
