import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { fromPageContext } from "../user/SignUp_In";
import { AppContext } from "../../App";
import { userUrl } from "../../apis/apiURLs";

export function NaverRedirection({ popup, setPopup, setAlert }) {
  const pageFrom = useContext(fromPageContext);
  const { setUserData } = useContext(AppContext);
  const navigate = useNavigate();

  const getLoggedInUserInfo = () => {
    fetch(`${userUrl}`, {
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          setAlert({
            title: "오류",
            content: "사용자 정보를 가져오는 중 오류가 발생하였습니다.",
            severity: "error",
            onclose: () => setAlert(null),
            onclick: () => setAlert(null),
            checkBtn: "확인",
          });
        }
      })
      .then((data) => {
        setUserData({ isLoggedIn: true, user: data.user });
      })
      .then(() => {
        setTimeout(() => {
          if (pageFrom) {
            navigate(pageFrom);
            return;
          }
          navigate("/");
        }, 1000);
      })
      .catch(() => {
        setAlert({
          title: "오류",
          content: "사용자 정보를 가져오는 중 오류가 발생하였습니다.",
          severity: "error",
          onclose: () => setAlert(null),
          onclick: () => setAlert(null),
          checkBtn: "확인",
        });
      });
  };

  useEffect(() => {
    const currentUrl = window.location.href;
    const searchParams = new URL(currentUrl).searchParams;
    const error = searchParams.get("error");
    if (error === "access_denied") {
      window.opener.postMessage(
        { error, errorIsNaver: currentUrl.includes("naver-login") },
        window.location.origin
      );
      return;
    }
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    if (code && state) {
      window.opener.postMessage(
        { code, state, isNaver: currentUrl.includes("naver-login") },
        window.location.origin
      );
    }
  }, []);

  // 로그인 팝입이 열리면 로그인 로직을 처리합니다.
  useEffect(() => {
    if (!popup) {
      return;
    }

    const naverOauthCodeListener = (e) => {
      if (e.origin !== window.location.origin) {
        return;
      }

      const { error, errorIsNaver } = e.data;
      if (error && errorIsNaver) {
        popup?.close();
        setPopup(null);
        setAlert({
          title: "정보 제공 동의 필수",
          content: "정보 제공 동의는 필수입니다.",
          severity: "error",
          onclose: () => setAlert(null),
          onclick: () => setAlert(null),
          checkBtn: "확인",
        });
        return;
      }

      const { code, state, isNaver } = e.data;

      if (code && state && isNaver) {
        popup?.close();

        // 가져온 code 로 다른 정보를 가져오는 API 호출
        fetch(`${userUrl}/login/naver`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ authorizationCode: code, state }),
          credentials: "include",
        })
          .then((res) => {
            if (res.ok) {
              // 마지막으로 로그인한 계정 저장
              localStorage.setItem("social_provider", "naver");
              setAlert({
                title: "로그인 성공",
                content: "Teeny Box에 로그인 되었습니다.",
                severity: "success",
              });
              getLoggedInUserInfo();
            } else {
              res.json().then((data) => {
                setAlert({
                  title: "추가정보 입력 필요",
                  content: "회원가입을 위한 추가정보 입력 페이지로 이동합니다.",
                  severity: "info",
                });
                setTimeout(() => {
                  setAlert(null);
                  navigate("/additional-user-info", {
                    state: {
                      id: data[`naverUserData`]["id"],
                      existingNickname: data[`naverUserData`]["nickname"],
                      profileUrl: data[`naverUserData`]["profileUrl"],
                      socialProvider: "naver",
                      isFromSignUpPage: true,
                    },
                  });
                }, 2000);
              });
            }
          })
          .catch((error) => {
            console.error("네트워크 오류", error);
            setAlert({
              title: "오류 발생",
              content: "회원가입/로그인 중 오류가 발생하였습니다.",
              severity: "error",
              onclose: () => setAlert(null),
              onclick: () => setAlert(null),
              checkBtn: "확인",
            });
          });
        // popup 닫은 뒤 setPopul(null) 설정 세트
        popup?.close();
        setPopup(null);
      }
    };

    window.addEventListener("message", naverOauthCodeListener, false);
    return () => {
      window.removeEventListener("message", naverOauthCodeListener);
    };
  }, [popup]);

  return <></>;
}
