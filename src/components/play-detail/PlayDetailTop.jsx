import React, { useContext, useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import IconButton from "@mui/material/IconButton";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Rating from "@mui/material/Rating";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import classNames from "classnames";
import { styled } from "@mui/material/styles";

// Icon 모음
import URL_Link from "../../assets/img/SNSIcon/URL_Link.svg";
import KaKao_Icon from "../../assets/img/SNSIcon/KaKao_Icon.svg";
import Twitter_Icon from "../../assets/img/SNSIcon/Twitter_Icon.svg";
import FaceBook_Icon from "../../assets/img/SNSIcon/FaceBook_Icon.svg";
import Yes24_button from "../../assets/img/SNSIcon/Yes24_button.svg";
import Interpark_button from "../../assets/img/SNSIcon/Interpark_button.svg";
import Naver_button from "../../assets/img/SNSIcon/Naver_button.svg";

import { AlertCustom } from "../common/alert/Alerts";
import { AlertContext } from "../../App";
import TimeFormat from "../common/time/TimeFormat";
import { dibsUrl } from "../../apis/apiURLs";
import "./PlayDetailTop.scss";

const CustomTooltip = styled(({ className, ...props }) => <Tooltip {...props} arrow classes={{ popper: className }} />)({
  [`& .${tooltipClasses.arrow}`]: {
    color: "#fff7e6",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#fff7e6",
    color: "black",
    padding: "10px", // 여기에서 패딩을 설정합니다.
  },
});

export default function PlayDetailTop({ showId, age, start_date, end_date, location, poster, price, runtime, state, title, isLoggedIn, averageRate }) {
  const [alert, setAlert] = useState(null);
  const [isDibbed, setIsDibbed] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(true);
  const { setOpenLoginAlert } = useContext(AlertContext);
  const [isShareBtnClicked, setIsShareBtnClicked] = useState(false);
  const [isKakaoInited, setIsKakaoInited] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      fetch(`${dibsUrl}/${showId}`, {
        credentials: "include",
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          return null;
        })
        .then((data) => {
          if (data?.isBookmarked) {
            setIsDibbed(data.isBookmarked);
          }
          setLoadingBtn(false);
        })
        .catch((err) => console.error(err));
    } else {
      setLoadingBtn(false);
    }
  }, [isLoggedIn, showId]);

  useEffect(() => {
    if (isShareBtnClicked && !isKakaoInited) {
      const { Kakao } = window;
      if (!Kakao.isInitialized()) {
        Kakao.init(process.env.REACT_APP_KAKAO_SHARE_API_KEY);
      }
      Kakao.Link.createDefaultButton({
        container: "#btnKakaoShare",
        objectType: "feed",
        content: {
          title: `[🎫TeenyBox] ${title} 정보 공유`,
          description: `${title} 정보 공유입니다 (from TeenyBox)`,
          imageUrl: window.location.href,
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
      });
    }
  }, [isShareBtnClicked, title, isKakaoInited]);

  const handleShareBtnClick = () => {
    setIsShareBtnClicked(true);
  };

  const handleShareCloseBtnClick = () => {
    setIsShareBtnClicked(false);
  };

  const handleLinkShareBtnClick = async (currentPath) => {
    try {
      await navigator.clipboard.writeText(currentPath);
      setAlert({
        title: "링크 복사 완료",
        content: "현재 페이지의 링크가 복사되었습니다.",
        open: true,
        onclose: () => setAlert(null),
        severity: "success",
      });
      setTimeout(() => setAlert(null), 1500);
    } catch (err) {
      setAlert({
        title: "링크 복사 실패",
        content: "현재 페이지 링크 복사에 실패하였습니다.",
        open: true,
        onclose: () => setAlert(null),
        severity: "error",
      });
    }
  };

  const shareKakao = () => {
    if (isShareBtnClicked && !isKakaoInited) {
      setIsKakaoInited(true);
    }
  };

  const shareFacebook = () => {
    const sendUrl = window.location.href;
    window.open(`http://www.facebook.com/sharer/sharer.php?u=${sendUrl}`);
  };

  const shareTwitter = () => {
    const sendText = `[🎫TeenyBox] ${title} 정보 공유`;
    const sendUrl = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text= ${sendText}  &url= ${sendUrl}`);
  };

  const handleDibBtnClick = () => {
    if (isLoggedIn) {
      if (isDibbed) {
        fetch(`${dibsUrl}/${showId}`, {
          method: "DELETE",
          credentials: "include",
        })
          .then((res) => {
            if (res.ok) {
              setIsDibbed(false);
            } else if (res.status === 401 || res.status === 403) {
              setOpenLoginAlert(true);
            } else {
              setAlert({
                title: "tennybox.com 내용:",
                content: "찜 취소에 실패하였습니다.",
                open: true,
                onclose: () => setAlert(null),
                severity: "error",
              });
            }
          })
          .catch(() => {
            setAlert({
              title: "tennybox.com 내용:",
              content: "찜 취소에 실패하였습니다.",
              open: true,
              onclose: () => setAlert(null),
              severity: "error",
            });
          });
      } else {
        fetch(`${dibsUrl}/${showId}`, {
          method: "POST",
          credentials: "include",
        })
          .then((res) => {
            if (res.ok) {
              setIsDibbed(true);
            } else if (res.status === 401 || res.status === 403) {
              setOpenLoginAlert(true);
            } else {
              setAlert({
                title: "tennybox.com 내용:",
                content: "찜하기에 실패하였습니다.",
                open: true,
                onclose: () => setAlert(null),
                severity: "error",
              });
            }
          })
          .catch(() =>
            setAlert({
              title: "tennybox.com 내용:",
              content: "찜하기에 실패하였습니다.",
              open: true,
              onclose: () => setAlert(null),
              severity: "error",
            }),
          );
      }
    } else {
      setOpenLoginAlert(true);
    }
  };

  return (
    <div className="play-detail-top-container">
      {alert && <AlertCustom title={alert.title} content={alert.content} open={alert.open} onclose={alert.onclose} severity={alert.severity} />}
      <div className="play-detail-top">
        <div className="play-poster">
          <div className="poster-box">
            {state === "공연완료" && (
              <div className="end-show-design">
                <img src="/banner.png" alt="공연 완료 이미지" />
                <span className="end-show-text">
                  연극 <br />
                  종료
                </span>
              </div>
            )}
            <img src={poster} alt={`${title} 포스터`} />
          </div>
        </div>
        <div className="play-info">
          <div className="title-container">
            <h1>연극 &lt;{title}&gt;</h1>
            <div className="title-button-container">
              <div className="dibs-btn">
                {loadingBtn ? (
                  <CircularProgress color="error" className="dib-btn-loading" />
                ) : (
                  <IconButton color="error" size="large" onClick={handleDibBtnClick}>
                    {isDibbed ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                )}
              </div>

              <div className="share-btn">
                <ShareOutlinedIcon
                  fontSize="medium"
                  onClick={() => handleShareBtnClick()}
                  sx={{
                    cursor: "pointer",
                    position: "relative",
                    bottom: "21px",
                  }}
                />

                {isShareBtnClicked ? (
                  <div className="share-options" style={{ top: title.length >= 31 ? "67px" : "10px" }}>
                    <div className="share-option">
                      <div className="SNS-img-box">
                        <img src={URL_Link} alt="URL_Link-icon" style={{ cursor: "pointer" }} onClick={() => handleLinkShareBtnClick(window.location.href)} />
                        <div>URL 복사</div>
                      </div>
                    </div>
                    <div className="share-option">
                      <div className="SNS-img-box">
                        <img id="btnKakaoShare" src={KaKao_Icon} alt="kakaoTalk-icon" style={{ cursor: "pointer" }} onClick={() => shareKakao()} />
                        <div>카카오톡</div>
                      </div>
                    </div>
                    <div className="share-option">
                      <div className="SNS-img-box">
                        <img src={Twitter_Icon} onClick={() => shareTwitter()} alt="X-icon" style={{ cursor: "pointer" }} />
                        <div>트위터</div>
                      </div>
                    </div>
                    <div className="share-option">
                      <div className="SNS-img-box">
                        <img src={FaceBook_Icon} onClick={() => shareFacebook()} alt="FaceBook_Icon" style={{ cursor: "pointer" }} />
                        <div>페이스북</div>
                      </div>
                    </div>
                    <div className="close-icon" onClick={() => handleShareCloseBtnClick()}>
                      <CloseIcon
                        fontSize="small"
                        sx={{
                          cursor: "pointer",
                          color: "#bcbcbc",
                          position: "relative",
                          bottom: "33px",
                        }}
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <hr style={{ borderTop: "1px solid #ffb400" }} />
          <div className="play-summary-info">
            <div>
              <h3>기간</h3>
              <CustomTooltip title={`${new Date(start_date).toLocaleDateString("ko-KR")} ~ ${new Date(end_date).toLocaleDateString("ko-KR")}`} arrow>
                <p>
                  {start_date && <TimeFormat time={start_date} />}
                  {" ~ "}
                  {end_date && <TimeFormat time={end_date} />}
                </p>
              </CustomTooltip>
            </div>
            <div>
              <h3>관람등급</h3>
              <CustomTooltip title={age} arrow>
                <p>{age}</p>
              </CustomTooltip>
            </div>
            <div>
              <h3>평점</h3>
              <CustomTooltip title={`${averageRate} 점`} arrow>
                <p style={{ position: "relative", bottom: "2px" }}>
                  <Rating value={averageRate} readOnly precision={0.5} />
                </p>
              </CustomTooltip>
            </div>
            {runtime && (
              <div>
                <h3>관람시간</h3>
                <CustomTooltip title={runtime} arrow>
                  <p>{runtime}</p>
                </CustomTooltip>
              </div>
            )}
            <div>
              <h3>장소</h3>
              <CustomTooltip title={location} arrow>
                <p>{location}</p>
              </CustomTooltip>
            </div>
            <div className={classNames({ price: price.length >= 60 })}>
              <h3>가격</h3>
              <CustomTooltip title={price} arrow>
                <p>{price}</p>
              </CustomTooltip>
            </div>
            <div
              style={{
                gridColumnStart: "1",
                gridColumnEnd: "3",
                borderTop: "1px solid #ffb400",
              }}
            ></div>
          </div>
          <div className="play-detail-buttons">
            {state !== "공연완료" ? (
              <div className="ticket-link-container">
                <a href={`https://tickets.interpark.com/contents/search?keyword=${title}&start=0&rows=20`} target="_blank" rel="noopener noreferrer">
                  <img src={Interpark_button} alt="Interpark" className="ticket-button-icon" />
                </a>
                <a href={`https://ticket.yes24.com/Search/${title}`} target="_blank" rel="noopener noreferrer">
                  <img src={Yes24_button} alt="Yes24" className="ticket-button-icon" />
                </a>
                <a href={`https://search.shopping.naver.com/search/all?query=%EC%97%B0%EA%B7%B9%20${title}`} target="_blank" rel="noopener noreferrer">
                  <img src={Naver_button} alt="Naver" className="ticket-button-icon" />
                </a>
              </div>
            ) : (
              <Tooltip title="본 연극은 종료되어 예매 링크가 제공되지 않습니다." arrow>
                <div>
                  <button disabled className="disabled-button">
                    <span>예매 종료</span>
                  </button>
                </div>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
