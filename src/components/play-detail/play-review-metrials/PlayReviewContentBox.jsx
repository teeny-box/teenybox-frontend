import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // 추가
import "./PlayReviewContentBox.scss";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageExpandModal from "../../../components/common/modal/ImageExpandModal";
import { reviewUrl } from "../../../apis/apiURLs";

export default function PlayReviewContentBox({
  reviewContentInfo,
  setIsReviewFormOpened,
  scrollRef,
  review_id,
  getPlayDetailInfo,
  getReviews,
  getUserReview,
  setAlert,
}) {
  const { photoSrc, title, content, isAuthorLogined } = reviewContentInfo;
  const navigate = useNavigate(); // 추가
  const location = useLocation(); // 추가

  const [clickedPhoto, setClickedPhoto] = useState(null);

  const handleModifyBtnClick = () => {
    setIsReviewFormOpened(true);

    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleReviewPhotoClick = (src) => {
    setClickedPhoto(src);
  };

  const deleteReview = (id) => {
    fetch(`${reviewUrl}/${id}`, {
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
      .catch(() => {
        setAlert({
          title: `tennybox.com 내용:`,
          content: `리뷰 삭제에 실패하였습니다.`,
          open: true,
          onclose: () => setAlert(null),
          severity: "",
        });
      });
  };

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

  return (
    <>
      <div className="play-review-content-container">
        {clickedPhoto && <ImageExpandModal imgSrc={clickedPhoto} setClickedPhoto={setClickedPhoto} />}
        <div className="play-review-virtual"></div> {/* 가상 영역 추가 */}
        <div className="play-review-content">
          <h4>{title}</h4>
          <div className="content-text">{!content || content === "null" ? "" : content}</div>
          <div className="review-photos">
            {photoSrc.length
              ? photoSrc.map((src, idx) => <img src={src} className="play-review-photo" key={idx} onClick={() => handleReviewPhotoClick(src)} />)
              : null}
          </div>
        </div>
        {isAuthorLogined ? (
          <div className="play-review-modify-container">
            <div className="modify-button" onClick={handleModifyBtnClick}>
              수정
            </div>
            <div className="remove-button" onClick={handleDeleteBtnClick}>
              삭제 <DeleteIcon className="play-review-delete-icon" color="ourGray" />
            </div>
          </div>
        ) : (
          <div className="play-review-virtual"></div>
        )}
      </div>
    </>
  );
}
