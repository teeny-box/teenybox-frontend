// 소셜 로그인/회원가입 버튼들
import React, { useState } from "react";
import Naver from "./Naver";
import Kakao from "./Kakao";
import Google from "./Google";
import "./SnsButtons.scss";

export default function SnsButtons() {
  const [popup, setPopup] = useState();

  return (
    <>
      <div className="socialButtons">
        <div className="btnbox">
          <Naver popup={popup} setPopup={setPopup} />
        </div>
        <div className="btnbox">
          <Kakao popup={popup} setPopup={setPopup} />
        </div>
        <div className="btnbox">
          <Google popup={popup} setPopup={setPopup} />
        </div>
        {localStorage.getItem("social_provider") && (
          <div className="last-account">
            마지막으로 로그인한 계정은&nbsp;
            <span
              style={{
                color:
                  localStorage.getItem("social_provider") === "naver" ? "#3eaf0e" : localStorage.getItem("social_provider") === "kakao" ? "#FFC939" : "#147bb7",
              }}
            >
              {localStorage.getItem("social_provider")}
            </span>
            &nbsp;입니다.
          </div>
        )}
      </div>
    </>
  );
}
