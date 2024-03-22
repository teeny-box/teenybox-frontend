import { useState } from "react";
import { NaverRedirection } from "../../../pages/redirection/NaverRedirection";
import { AlertCustom } from "../../../components/common/alert/Alerts";
import Loading from "../../common/state/Loading";
import "./AllLoginBtn.scss";
import naverLogo from "../../../assets/img/user/naver-logo.png";

export default function Naver({ popup, setPopup }) {
  const [alert, setAlert] = useState(null);

  const NAVER_CALLBACK_URL = process.env.REACT_APP_NAVER_CALLBACK_URL;
  const NAVER_CLIENT_ID = process.env.REACT_APP_NAVER_CLIENT_ID;
  // const NAVER_CLIENT_SECRET = process.env.REACT_APP_NAVER_CLIENT_SECRET;
  /**
   *
   *  OAuth 클라이언트 시크릿은 클라이언트 사이드에서 직접 사용되어서는 안 되는 중요한 정보입니다.
   * 보통 서버에서 인증 절차를 처리할 때 필요하므로, 클라이언트 사이드 코드에서는 사용되지 않을 가능성이 높습니다.
   * : 만약 이 변수가 실제로 필요하지 않다면, 그냥 선언 자체를 제거해 버리는 것이 좋습니다.
   * 클라이언트 사이드에서 NAVER_CLIENT_SECRET을 사용할 일이 없다면, 이 변수의 선언을 아예 삭제하는 것이 바람직합니다.
   */

  function generateState() {
    return Math.random().toString(36).substr(2, 10);
  }

  const naverLoginHandler = () => {
    const width = 500;
    const height = 400; // 팝업의 세로 길이 : 500
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const url = `https://nid.naver.com/oauth2.0/authorize?client_id=${NAVER_CLIENT_ID}&response_type=code&redirect_uri=${NAVER_CALLBACK_URL}&state=${generateState()}`;

    const loginPopup = window.open(url, "로그인 중...", `width=${width},height=${height},left=${left},top=${top}`);
    setPopup(loginPopup);
  };

  return (
    <>
      {alert && (
        <>
          {alert.title === "정보 제공 동의 필수" ? null : alert.title === "로그인 성공" ? <Loading isLogin={true} /> : <Loading />}
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
      <button onClick={() => naverLoginHandler()} className="all-login-btn">
        <div className="sns-logo-container">
          <img src={naverLogo} alt="naver-logo" id="naver-logo" />
        </div>
        <div className="logo-description">
          <span>네이버 계정으로 로그인</span>
        </div>
        <NaverRedirection popup={popup} setPopup={setPopup} setAlert={setAlert} />
      </button>
    </>
  );
}
