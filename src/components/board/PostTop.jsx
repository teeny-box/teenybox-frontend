import React, { useEffect, useState } from "react";
import "./PostTop.scss";
import { Close, ShareOutlined, SmsOutlined, VisibilityOutlined } from "@mui/icons-material";
import { AlertCustom } from "../common/alert/Alerts";
import copyUrl from "../../utils/copyUrl";
import LiveTimeDiff from "../common/time/LiveTimeDiff";
import numberFormat from "../../utils/numberFormat";
import { DELETE_USER_NICKNAME } from "../../utils/const";
import default_user_img from "../../assets/img/default_user_img.svg";
import kakaoTalkIcon from "../../assets/img/shareIcon/kakaoTalk.png";
import facebookIcon from "../../assets/img/shareIcon/facebook.png";
import URLIcon from "../../assets/img/shareIcon/URL.png";
import XIcon from "../../assets/img/shareIcon/X.png";

export function PostTop({ user, post, commentsCnt }) {
  const [openURLCopyAlert, setOpenURLCopyAlert] = useState(false);

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
                <VisibilityOutlined sx={{ fontSize: 15 }} />
                <span>{numberFormat(post.views || 0)}</span>
              </div>
              <span className="dot">•</span>
              <div className="view-cnt pointer" onClick={handleCommentsButtonClick}>
                <SmsOutlined sx={{ fontSize: 14 }} />
                <span>{numberFormat(commentsCnt)}</span>
              </div>
            </div>
          </div>
          <div className="icons">
            <div className="share-btn">
              <ShareOutlined className="share-icon pointer" onClick={() => setOpenShareBox(true)} />
            </div>

            {openShareBox && (
              <>
                <div className="share-options">
                  <div className="share-option pointer">
                    <div className="SNS-img-box">
                      <img src={URLIcon} alt="kakaoTalk-icon" onClick={handleCopyButtonClick} />
                    </div>
                    <span className="label">URL복사</span>
                  </div>
                  <div className="share-option pointer">
                    <div className="SNS-img-box">
                      <img id="btnKakaoShare" src={kakaoTalkIcon} alt="kakaoTalk-icon" onClick={shareKakao} />
                    </div>
                    <span className="label">카카오톡</span>
                  </div>
                  <div className="share-option pointer">
                    <div className="SNS-img-box">
                      <img src={XIcon} onClick={shareTwitter} alt="X-icon" />
                    </div>
                    <span className="label">트위터</span>
                  </div>
                  <div className="share-option pointer">
                    <div className="SNS-img-box">
                      <img src={facebookIcon} onClick={shareFacebook} alt="X-icon" />
                    </div>
                    <span className="label">페이스북</span>
                  </div>
                  <div className="close-icon pointer" onClick={() => setOpenShareBox(false)}>
                    <Close />
                  </div>
                </div>
                <div className="backdrop" onClick={() => setOpenShareBox(false)}></div>
              </>
            )}
          </div>

          <AlertCustom
            open={openURLCopyAlert}
            onclose={() => setOpenURLCopyAlert(false)}
            title={"URL이 복사되었습니다!"}
            content={window.location.href}
            time={1000}
          />
        </div>
      )}
    </>
  );
}
