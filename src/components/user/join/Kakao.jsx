import { useState } from "react";
import { KakaoRedirection } from "../../../pages/redirection/KakaoRedirection";
import { AlertCustom } from "../../../components/common/alert/Alerts";
import Loading from "../../common/state/Loading";
import "./AllLoginBtn.scss";
import kakaoLogo from "../../../assets/img/user/kakao-logo.png";

export default function Kakao({ popup, setPopup }) {
  const [alert, setAlert] = useState(null);

  const KAKAO_REDIRECT_URL = process.env.REACT_APP_KAKAO_REDIRECT_URL;
  const KAKAO_REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY;

  const kakaoLoginHandler = () => {
    const width = 500;
    const height = 400; // 팝업의 세로 길이 : 500
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const url = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URL}&response_type=code`;
    const popup = window.open(
      url,
      "로그인 중...",
      `width=${width},height=${height},left=${left},top=${top}`
    );
    setPopup(popup);
  };

  return (
    <>
      {alert && (
        <>
          {alert.title === "정보 제공 동의 필수" ? null : alert.title ===
            "로그인 성공" ? (
            <Loading isLogin={true} />
          ) : (
            <Loading />
          )}
          <AlertCustom
            open={true}
            title={alert.title}
            content={alert.content}
            severity={alert.severity}
            btnCloseHidden={true}
            onclose={alert.onclose}
            onclick={alert.onclick}
            checkBtn={alert.checkBtn}
          />
        </>
      )}
      <button onClick={() => kakaoLoginHandler()} className="all-login-btn">
        <div className="sns-logo-container">
          <img src={kakaoLogo} alt="kakao-logo" id="kakao-logo" />
        </div>
        <div className="logo-description">
          <span>카카오 계정으로 로그인</span>
        </div>
        <KakaoRedirection
          popup={popup}
          setPopup={setPopup}
          setAlert={setAlert}
        />
      </button>
    </>
  );
}
