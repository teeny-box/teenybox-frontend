import React, { useContext, useEffect, useState } from "react";
import "./PostTop.scss";
import { useNavigate } from "react-router-dom";
import { Backdrop, Button, Tooltip } from "@mui/material";
import {
  Close,
  DeleteOutline,
  EditOutlined,
  Facebook,
  Link,
  ShareOutlined,
  SmsOutlined,
  ThumbUpAlt,
  ThumbUpAltOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import { AlertCustom } from "../common/alert/Alerts";
import copyUrl from "../../utils/copyUrl";
import { postUrl, promotionUrl } from "../../apis/apiURLs";
import { AlertContext, AppContext } from "../../App";
import LiveTimeDiff from "../common/time/LiveTimeDiff";
import numberFormat from "../../utils/numberFormat";
import { DELETE_USER_NICKNAME } from "../../utils/const";
import default_user_img from "../../assets/img/default_user_img.svg";
import kakaoTalkImg from "../../assets/img/SNSIcon/kakaoTalk.png";
import XImg from "../../assets/img/SNSIcon/X.png";

export function PostTop({ user, type, post, commentsCnt }) {
  const [openURLCopyAlert, setOpenURLCopyAlert] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [isWriter, setIsWriter] = useState(false); // false로 바꾸기
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const { userData } = useContext(AppContext);
  const { setOpenLoginAlert, setOpenFetchErrorAlert } = useContext(AlertContext);
  const nav = useNavigate();

  // 공유 버튼이 클릭되었는지 여부 (소셜 공유 버튼을 띄우기 위한)
  const [openShareBox, setOpenShareBox] = useState(false);
  // 카카오가 init 되었는지 여부
  const [isKakaoInited, setIsKakaoInited] = useState(false);

  const handleCommentsButtonClick = () => {
    const location = document.querySelector("#commentForm").offsetTop;
    window.scrollTo({ top: location, behavior: "smooth" });
  };

  const handleCopyButtonClick = () => {
    copyUrl();
    setOpenURLCopyAlert(true);
  };

  const handleEditButtonClick = () => {
    nav(`/${type}/edit/${post.post_number || post.promotion_number}`);
  };

  const handleDeleteButtonClick = () => {
    setOpenDeleteAlert(true);
  };

  const handleClickLikes = async () => {
    const url = type === "community" ? `${postUrl}/${post.post_number}/like` : `${promotionUrl}/${post.promotion_number}/like`;
    try {
      if (isLiked) {
        const res = await fetch(url, { method: "DELETE", credentials: "include" });

        if (res.ok) {
          setIsLiked(false);
          setLikes((cur) => cur - 1);
        } else if (res.status === 403) {
          setOpenLoginAlert(true);
        } else {
          const data = await res.json();
          console.error(data);
        }
      } else {
        const res = await fetch(url, { method: "POST", credentials: "include" });

        if (res.ok) {
          setIsLiked(true);
          setLikes((cur) => cur + 1);
        } else if (res.status === 403) {
          setOpenLoginAlert(true);
        } else {
          const data = await res.json();
          console.error(data);
        }
      }
    } catch (e) {
      setOpenFetchErrorAlert(true);
    }
  };

  const deletePost = async () => {
    try {
      const url = type === "community" ? `${postUrl}/${post.post_number}` : `${promotionUrl}/${post.promotion_number}`;
      const res = await fetch(url, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        nav(`/${type}`);
      } else {
        const data = await res.json();
        console.error(data);
      }
    } catch (e) {
      setOpenFetchErrorAlert(true);
    }
  };

  const shareKakao = () => {
    if (openShareBox && !isKakaoInited) {
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
    const sendText = `[🎫TeenyBox] ${post.title}`; // 전달할 텍스트
    const sendUrl = window.location.href; // 전달할 URL
    window.open(`https://twitter.com/intent/tweet?text=${sendText}&url=${sendUrl}`);
  };

  useEffect(() => {
    const kakao = window.Kakao;
    if (openShareBox && !isKakaoInited) {
      // 페이지에서 init이 한번만 이루어지도록 설정
      if (!kakao.isInitialized()) {
        // kakao.init이 되어 있지 않은 경우에만 초기화 진행
        kakao.init(process.env.REACT_APP_KAKAO_SHARE_API_KEY);
      }
      // 카카오링크 버튼 생성 (두 번 버튼을 클릭해야 생성되는 것을 막기 위해 useEffect에 작성!)
      kakao.Link.createDefaultButton({
        container: "#btnKakaoShare", // 카카오공유버튼ID
        objectType: "feed",
        content: {
          title: `[🎫TeenyBox] ${post.title}`, // 보여질 제목
          description: `${post.title} 정보 공유입니다 (from TeenyBox)`, // 보여질 설명
          imageUrl: window.location.href, // 콘텐츠 URL
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
      });
    }
  }, [openShareBox]);

  useEffect(() => {
    if (userData?.nickname === user?.nickname) {
      setIsWriter(true);
    }

    if (userData?._id) {
      setIsLiked(post.likedUsers.includes(userData?._id));
    }
  }, [userData, user]);

  return (
    <>
      {user && (
        <div className="board-post-top">
          <img
            className="user-img"
            src={(user?.state === "가입" && user?.profile_url) || default_user_img}
            onError={(e) => {
              e.target.src = default_user_img;
            }}
          />
          <div className="flex-box">
            <div className="user-id">{(user?.state === "가입" && user?.nickname) || DELETE_USER_NICKNAME}</div>
            <div className="date">
              <LiveTimeDiff time={post.createdAt} />
              <span className="dot">•</span>
              <div className="view-cnt">
                <VisibilityOutlined sx={{ fontSize: 16 }} />
                <span>{numberFormat(post.views || 0)}</span>
              </div>
            </div>
          </div>
          <div className="icons">
            <div className="share-btn">
              <ShareOutlined className="share-icon" onClick={() => setOpenShareBox(true)} />
            </div>
            {type === "community" && (
              <div className="comments-icon" onClick={handleCommentsButtonClick}>
                <SmsOutlined />
                <span>{numberFormat(commentsCnt)}</span>
              </div>
            )}
            {isWriter && (
              <>
                <EditOutlined onClick={handleEditButtonClick} />
                <DeleteOutline onClick={handleDeleteButtonClick} />
              </>
            )}
            <Tooltip title={isLiked ? "추천됨" : "추천하기"} arrow>
              <Button
                onClick={handleClickLikes}
                variant={"outlined"}
                size="small"
                startIcon={isLiked ? <ThumbUpAlt /> : <ThumbUpAltOutlined />}
                disableElevation
              >
                {numberFormat(likes)}
              </Button>
            </Tooltip>
            {openShareBox && (
              <div className="share-options">
                <div className="share-option">
                  <Tooltip title="링크 복사" arrow>
                    <Link onClick={handleCopyButtonClick} style={{ cursor: "pointer", width: "31px" }} />
                  </Tooltip>
                </div>
                <div className="share-option">
                  <Tooltip title="카카오톡" arrow>
                    <div className="SNS-img-box">
                      <img id="btnKakaoShare" src={kakaoTalkImg} alt="kakaoTalk-icon" style={{ cursor: "pointer" }} onClick={shareKakao} />
                    </div>
                  </Tooltip>
                </div>
                <div className="share-option">
                  <Tooltip title="X" arrow>
                    <div className="SNS-img-box">
                      <img src={XImg} onClick={shareTwitter} alt="X-icon" style={{ cursor: "pointer" }} />
                    </div>
                  </Tooltip>
                </div>
                <div className="share-option">
                  <Tooltip title="페이스북" arrow>
                    <Facebook fontSize="large" color="facebookBlue" onClick={shareFacebook} style={{ cursor: "pointer" }} />
                  </Tooltip>
                </div>
                <div className="close-icon" onClick={() => setOpenShareBox(false)}>
                  <Close
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
            )}
          </div>

          <AlertCustom
            open={openURLCopyAlert}
            onclose={() => setOpenURLCopyAlert(false)}
            title={"URL이 복사되었습니다!"}
            content={window.location.href}
            time={1000}
          />
          <Backdrop open={openDeleteAlert} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <AlertCustom
              open={openDeleteAlert}
              onclose={() => setOpenDeleteAlert(false)}
              severity={"error"}
              title={"teenybox.com 내용:"}
              content={"정말 삭제하시겠습니까?"}
              onclick={deletePost}
              checkBtn={"확인"}
              checkBtnColor={"#ef5350"}
              closeBtn={"취소"}
            />
          </Backdrop>
        </div>
      )}
    </>
  );
}
