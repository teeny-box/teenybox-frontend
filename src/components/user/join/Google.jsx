import googleimg from "../../../assets/img/user/googlelogin.png";
import { useState, useEffect } from "react";
import GoogleRedirection from "../../../pages/redirection/GoogleRedirection";
import { AlertCustom } from "../../../components/common/alert/Alerts";
import Loading from "../../../components/common/loading/Loading";

export default function Google() {
  const [popup, setPopup] = useState();
  const [alert, setAlert] = useState(null);

  const GOOGLE_REDIRECT_URL = process.env.REACT_APP_GOOGLE_REDIRECT_URL;
  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  const googleLoginHandler = () => {
    const width = 500;
    const height = 400; // 팝업의 세로 길이 : 500
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${GOOGLE_CLIENT_ID}&scope=openid%20profile%20email&redirect_uri=${GOOGLE_REDIRECT_URL}`;
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
          <Loading />
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
      <button onClick={() => googleLoginHandler()}>
        <img className="btnimage" src={googleimg} alt=" 구글로그인" />
        <GoogleRedirection
          popup={popup}
          setPopup={setPopup}
          setAlert={setAlert}
        />
      </button>
    </>
  );
}