// 소셜 로그인 및 회원가입 페이지
import { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./SignUp_In.scss";
import SnsButtons from "../../components/user/join/SnsButtons";
import { AlertCustom } from "../../components/common/alert/Alerts";
import { AppContext } from "../../App";
import DisableModal from "../../components/common/modal/DisableModal";
import { Backdrop } from "@mui/material";

export const fromPageContext = createContext();

export function SignUp_In() {
  const { userData } = useContext(AppContext);
  const location = useLocation();
  const pageFrom = location.state?.from;
  const nav = useNavigate();

  const [forbiddenAlert, setForbiddenAlert] = useState(null);

  useEffect(() => {
    if (userData?.isLoggedIn) {
      setForbiddenAlert(true);
      return;
    }

    return () => setForbiddenAlert(false);
  }, [userData]);

  return (
    <>
      {forbiddenAlert && (
        <>
          <DisableModal />

          <Backdrop
            open={true}
            sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
          >
            <AlertCustom
              title="tennybox.com 내용:"
              content={"로그아웃 후 로그인 페이지 이용이 가능합니다."}
              severity="error"
              open={true}
              btnCloseHidden={true}
              checkBtn="확인"
              onclick={() => nav("/")}
              onclose={() => nav("/")}
            />
          </Backdrop>
        </>
      )}
      <section className="signupInContainer inner">
        <h1 className="signup-title">SIGN UP / LOGIN </h1>
        <p className="signup-description">
          소셜 계정으로 간편하게 가입/로그인 가능합니다.
        </p>

        <div className="social-buttons">
          <fromPageContext.Provider value={pageFrom}>
            <SnsButtons />
          </fromPageContext.Provider>
        </div>
      </section>
    </>
  );
}
