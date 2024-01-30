import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./AverageRatingBox.scss";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { AlertCustom } from "../../common/alert/Alerts";
import Tooltip from "@mui/material/Tooltip";

export default function AverageRatingBox({
  isLoggedIn,
  setIsReviewFormOpened,
  count,
  averageRate,
  state,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  // 로그인 필요 알람
  const [needLoginAlert, setNeedLoginAlert] = useState(null);

  const handleReviewBtnClick = () => {
    // 로그인이 되어 있지 않은 경우 로그인 페이지로 이동 알람
    if (!isLoggedIn) {
      setNeedLoginAlert(
        "로그인이 필요한 기능입니다. 로그인 페이지로 이동하시겠습니까?"
      );
    } else {
      // 로그인이 되어 있을 경우 리뷰 작성창이 열림
      setIsReviewFormOpened(true);
    }
  };
  return (
    <>
      {needLoginAlert && (
        <AlertCustom
          title={"로그인 필요"}
          content={needLoginAlert}
          open={Boolean(needLoginAlert)}
          onclose={() => setNeedLoginAlert(null)}
          onclick={() =>
            navigate("/signup-in", {
              state: { from: `${location.pathname}${location.search}` },
            })
          }
          severity={"warning"}
          checkBtn={"확인"}
          closeBtn={"취소"}
        />
      )}
      <div className="average-rating-box">
        <div className="star-and-rating">
          <h2>평균 평점</h2>
          <Rating
            value={count ? averageRate : 0}
            readOnly
            size="large"
            precision={0.5}
          />
          <span className="rating">
            {count ? `${averageRate.toFixed(1)} ` : "0.0 "}/ 5
          </span>
          <p className="rating-addtional-text">
            * 아래의 관람 후기들을 바탕으로 한 평균 평점입니다.
          </p>
        </div>
        {state === "공연예정" ? (
          <Tooltip
            title="공연 예정인 연극에는 리뷰를 작성할 수 없습니다."
            arrow
          >
            <div className="review-button">
              <Button
                color="inherit"
                state="focused"
                variant="outlined"
                size="large"
                disabled
              >
                <Typography
                  fontFamily="Nanum Gothic, sans-serif"
                  className="review-button-text"
                >
                  관람 후기 작성하기
                </Typography>
              </Button>
            </div>
          </Tooltip>
        ) : (
          <div className="review-button">
            <Button
              color="inherit"
              state="focused"
              variant="outlined"
              size="large"
              onClick={handleReviewBtnClick}
            >
              <Typography
                fontFamily="Nanum Gothic, sans-serif"
                className="review-button-text"
              >
                관람 후기 작성하기
              </Typography>
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
