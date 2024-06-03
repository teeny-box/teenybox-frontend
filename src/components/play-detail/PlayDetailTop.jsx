import React, { useContext, useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import LinkIcon from "@mui/icons-material/Link";
import FacebookIcon from "@mui/icons-material/Facebook";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import classNames from "classnames";
import kakaoTalkImg from "../../assets/img/shareIcon/kakaoTalk.png";
import XImg from "../../assets/img/shareIcon/X.png";
import { AlertCustom } from "../common/alert/Alerts";
import { AlertContext } from "../../App";
import TimeFormat from "../common/time/TimeFormat";
import { dibsUrl } from "../../apis/apiURLs";
import "./PlayDetailTop.scss";

export default function PlayDetailTop({ showId, age, start_date, end_date, location, poster, price, runtime, state, title, isLoggedIn, averageRate }) {
  const [alert, setAlert] = useState(null);
  // 이 연극을 현재 로그인된 유저가 찜했는지 여부
  const [isDibbed, setIsDibbed] = useState(false);
  // 찜 여부 받아올때까지 버튼 로딩시키기
  const [loadingBtn, setLoadingBtn] = useState(true);
  // 로그인 필요 알람
  const { setOpenLoginAlert } = useContext(AlertContext);
  // 공유 버튼이 클릭되었는지 여부 (소셜 공유 버튼을 띄우기 위한)
  const [isShareBtnClicked, setIsShareBtnClicked] = useState(false);
  // 카카오가 init 되었는지 여부
  const [isKakaoInited, setIsKakaoInited] = useState(false);

  // 찜한 연극인지를 확인하는 로직 (유저가 로그인 되어 있을시에만 로직 적용)
  useEffect(() => {
    if (isLoggedIn) {
      // 찜 여부 확인
      fetch(`${dibsUrl}/${showId}`, {
        credentials: "include",
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          return null;
        }) // res.json()을 반환하도록 수정
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

  //
  useEffect(() => {
    if (isShareBtnClicked && !isKakaoInited) {
      // 이 부분이 수정되었습니다: window 객체를 통해 Kakao를 정의합니다. //const Kakao = window.Kakao를 구조분해 할당으로 수정
      const { Kakao } = window;

      // 페이지에서 init이 한번만 이루어지도록 설정
      if (!Kakao.isInitialized()) {
        // Kakao.init이 되어 있지 않은 경우에만 초기화 진행
        Kakao.init(process.env.REACT_APP_KAKAO_SHARE_API_KEY);
      }
      // 카카오링크 버튼 생성 (두 번 버튼을 클릭해야 생성되는 것을 막기 위해 useEffect에 작성!)
      Kakao.Link.createDefaultButton({
        container: "#btnKakaoShare", // 카카오공유버튼ID
        objectType: "feed",
        content: {
          title: `[🎫TeenyBox] ${title} 정보 공유`, // 보여질 제목
          description: `${title} 정보 공유입니다 (from TeenyBox)`, // 보여질 설명
          imageUrl: window.location.href, // 콘텐츠 URL
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
      });
    }
  }, [isShareBtnClicked, title, isKakaoInited]);

  // 공유 버튼 클릭 시
  const handleShareBtnClick = () => {
    setIsShareBtnClicked(true);
  };

  // 공유하기 닫기 버튼 클릭 시
  const handleShareCloseBtnClick = () => {
    setIsShareBtnClicked(false);
  };

  // 링크 복사 버튼 클릭 시
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

  // 카카오 공유하기를 위한 로직
  const shareKakao = () => {
    if (isShareBtnClicked && !isKakaoInited) {
      setIsKakaoInited(true);
    }
  };

  // 페이스북으로 공유하기 버튼 클릭 시
  const shareFacebook = () => {
    const sendUrl = window.location.href; // 전달할 URL
    window.open(`http://www.facebook.com/sharer/sharer.php?u=${sendUrl}`);
  };

  // 트위터로 공유하기 버튼 클릭 시
  const shareTwitter = () => {
    const sendText = `[🎫TeenyBox] ${title} 정보 공유`; // 전달할 텍스트
    const sendUrl = window.location.href; // 전달할 URL
    window.open(`https://twitter.com/intent/tweet?text= ${sendText}  &url= ${sendUrl}`);
  };

  // 찜 버튼 클릭 시
  const handleDibBtnClick = () => {
    if (isLoggedIn) {
      // 찜이 되어 있는 경우 찜 취소
      if (isDibbed) {
        fetch(`${dibsUrl}/${showId}`, {
          method: "DELETE",
          credentials: "include",
        })
          .then((res) => {
            if (res.ok) {
              setIsDibbed(false);
            } else if (res.status === 401 || res.status === 403) {
              // setNeedLoginAlert("로그인이 필요한 기능입니다. 로그인 페이지로 이동하시겠습니까?");
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
        // 찜이 되어 있지 않은 경우 찜 추가
        fetch(`${dibsUrl}/${showId}`, {
          method: "POST",
          credentials: "include",
        })
          .then((res) => {
            if (res.ok) {
              setIsDibbed(true);
            } else if (res.status === 401 || res.status === 403) {
              // setNeedLoginAlert("로그인이 필요한 기능입니다. 로그인 페이지로 이동하시겠습니까?");
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
      // 로그인이 되어 있지 않을 경우의 로직
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
                <div className="share-options" style={{ top: title.length >= 31 ? "67px" : "36px" }}>
                  <div className="share-option">
                    <Tooltip title="링크 복사" arrow>
                      <LinkIcon onClick={() => handleLinkShareBtnClick(window.location.href)} style={{ cursor: "pointer", width: "31px" }} />
                    </Tooltip>
                  </div>
                  <div className="share-option">
                    <Tooltip title="카카오톡" arrow>
                      <div className="SNS-img-box">
                        <img id="btnKakaoShare" src={kakaoTalkImg} alt="kakaoTalk-icon" style={{ cursor: "pointer" }} onClick={() => shareKakao()} />
                      </div>
                    </Tooltip>
                  </div>
                  <div className="share-option">
                    <Tooltip title="X" arrow>
                      <div className="SNS-img-box">
                        <img src={XImg} onClick={() => shareTwitter()} alt="X-icon" style={{ cursor: "pointer" }} />
                      </div>
                    </Tooltip>
                  </div>
                  <div className="share-option">
                    <Tooltip title="페이스북" arrow>
                      <FacebookIcon fontSize="large" color="facebookBlue" onClick={() => shareFacebook()} style={{ cursor: "pointer" }} />
                    </Tooltip>
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
          <hr style={{ backgroundColor: "black" }} />
          <div className="play-summary-info">
            <div>
              <h3>기간</h3>
              <p>
                {start_date && <TimeFormat time={start_date} />}
                {" ~ "}
                {end_date && <TimeFormat time={end_date} />}
              </p>
            </div>
            <div>
              <h3>관람등급</h3>
              <p>{age}</p>
            </div>
            <div>
              <h3>평점</h3>
              <p style={{ position: "relative", bottom: "2px" }}>
                <Rating value={averageRate} readOnly precision={0.5} />
              </p>
            </div>
            {runtime && (
              <div>
                <h3>관람시간</h3>
                <p>{runtime}</p>
              </div>
            )}
            <div>
              <h3>장소</h3>
              <p>{location}</p>
            </div>
            <div className={classNames({ price: price.length >= 60 })}>
              <h3>가격</h3>
              <p>{price}</p>
            </div>
            <div
              style={{
                gridColumnStart: "1",
                gridColumnEnd: "3",
                borderTop: "1px solid #bcbcbc",
              }}
            ></div>
            <div className="play-detail-buttons">
              <div className="another-btn">
                <div className="dibs-btn">
                  {loadingBtn ? (
                    <Button variant="outlined" color="error" size="large" loading="true" sx={{ height: "45px" }}>
                      <CircularProgress
                        color="error"
                        className="dib-btn-loading"
                        sx={{
                          position: "relative",
                          left: "29px",
                        }}
                      />
                      <span style={{ visibility: "hidden" }}>♥️ 찜하기</span>
                    </Button>
                  ) : (
                    <Button variant={isDibbed ? "contained" : "outlined"} color="error" size="large" onClick={handleDibBtnClick}>
                      <Typography className="button-text">{isDibbed ? "찜한 연극" : "♥️ 찜하기"}</Typography>
                    </Button>
                  )}
                </div>
                <div className="reserve-btn">
                  {state !== "공연완료" ? (
                    <a href={`https://tickets.interpark.com/contents/search?keyword=${title}&start=0&rows=20`} target="_blank" rel="noopener noreferrer">
                      <Button variant="contained" color="secondary" size="large" disableElevation>
                        <Typography className="button-text">예매하러 가기</Typography>
                      </Button>
                    </a>
                  ) : (
                    <Tooltip title="본 연극은 종료되어 예매 링크가 제공되지 않습니다." arrow>
                      <div>
                        <Button variant="contained" disabled>
                          <Typography className="button-text">예매하러 가기</Typography>
                        </Button>
                      </div>
                    </Tooltip>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
