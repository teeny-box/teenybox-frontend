// 마이페이지 화면
import React, { useEffect, useState } from "react";
import "./MyPage.scss";
import { CircularProgress } from "@mui/material";
import { useSearchParams, Navigate } from "react-router-dom";
import MemberInfo from "../../components/mypage/MemberInfo";
import MemberDeletion from "../../components/mypage/MemberDeletion";
import MyPickList from "../../components/mypage/MyPickList";
import MyPlayReview from "../../components/mypage/MyPlayReview";
import MyPromotionBoard from "../../components/mypage/MyPromotionBoard";
import MyCommunityBoard from "../../components/mypage/MyCommunityBoard";
import MyComments from "../../components/mypage/MyComments";
import useGetUser from "../../hooks/authoriaztionHooks/useGetUser";

export function MyPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedComponent, setSelectedComponent] = useState(searchParams.get("tab") || "MemberInfo");
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);

  const userData = useGetUser();

  // 화면 너비 조절 이벤트를 듣도록 하기
  useEffect(() => {
    const resizeListener = () => {
      setInnerWidth(window.innerWidth);
    };
    window.addEventListener("resize", resizeListener);
  });

  const isSelected = (componentName) => (selectedComponent === componentName ? "selected" : "");

  const renderComponent = () => {
    switch (selectedComponent) {
      case "MemberInfo":
        return <MemberInfo user={userData} />;
      case "MemberDeletion":
        return <MemberDeletion user={userData} />;
      case "MyPickList":
        return <MyPickList user={userData} />;
      case "MyPlayReview":
        return <MyPlayReview user={userData} />;
      case "MyPromotionBoard":
        return <MyPromotionBoard user={userData} />;
      case "MyCommunityBoard":
        return <MyCommunityBoard user={userData} />;
      case "MyComments":
        return <MyComments user={userData} />;
      default:
        return <MemberInfo user={userData} />;
    }
  };

  useEffect(() => {
    searchParams.set("tab", selectedComponent);
    setSearchParams(searchParams);
  }, [selectedComponent]);

  if (!userData) {
    // 사용자 데이터가 없으면 로그인 페이지로 리다이렉트
    return <Navigate to="/signup-in" />;
  }

  return (
    <>
      {userData ? (
        innerWidth > 768 ? (
          <div className="mypage-container">
            <div className="mypage-template">
              <div className="mypage-nav">
                <div className="nav-header">
                  <p className="nav-header-text">마이페이지</p>
                </div>
                <div className="nav-body">
                  <div className="my-nav-box">
                    <h3>내 정보 관리</h3>
                    <p className={isSelected("MemberInfo")} onClick={() => setSelectedComponent("MemberInfo")}>
                      회원정보 수정
                    </p>
                    <p className={isSelected("MemberDeletion")} onClick={() => setSelectedComponent("MemberDeletion")}>
                      회원탈퇴
                    </p>
                  </div>
                  <div className="my-nav-box">
                    <h3>찜한 연극</h3>
                    <p className={isSelected("MyPickList")} onClick={() => setSelectedComponent("MyPickList")}>
                      내가 찜한 연극
                    </p>
                  </div>
                  <div className="my-nav-box">
                    <h3>My 리뷰</h3>
                    <p className={isSelected("MyPlayReview")} onClick={() => setSelectedComponent("MyPlayReview")}>
                      나의 연극 리뷰
                    </p>
                  </div>
                  <div className="my-nav-box">
                    <h3>My 작성글</h3>
                    <p className={isSelected("MyPromotionBoard")} onClick={() => setSelectedComponent("MyPromotionBoard")}>
                      홍보 게시판
                    </p>
                    <p className={isSelected("MyCommunityBoard")} onClick={() => setSelectedComponent("MyCommunityBoard")}>
                      커뮤니티
                    </p>
                    <p className={isSelected("MyComments")} onClick={() => setSelectedComponent("MyComments")}>
                      내 댓글
                    </p>
                  </div>
                </div>
              </div>
              <div className="mypage-content-area">{renderComponent()}</div>
            </div>
          </div>
        ) : (
          <div className="mypage-container">
            <div className="mypage-template">
              <div className="mypage-nav">
                <div className="nav-header">
                  <p className="nav-header-text">마이페이지</p>
                </div>
                <div className="nav-body">
                  <div className="my-nav-box">
                    <h3>내 정보 관리</h3>
                    <p className={isSelected("MemberInfo")} onClick={() => setSelectedComponent("MemberInfo")}>
                      회원정보 수정
                    </p>
                    <p className={isSelected("MemberDeletion")} onClick={() => setSelectedComponent("MemberDeletion")}>
                      회원탈퇴
                    </p>
                  </div>
                  <div className="my-nav-box">
                    <h3>찜한 연극</h3>
                    <p className={isSelected("MyPickList")} onClick={() => setSelectedComponent("MyPickList")}>
                      내가 찜한 연극
                    </p>
                  </div>
                  <div className="my-nav-box">
                    <h3>My 리뷰</h3>
                    <p className={isSelected("MyPlayReview")} onClick={() => setSelectedComponent("MyPlayReview")}>
                      나의 연극 리뷰
                    </p>
                  </div>
                  <div className="my-nav-box">
                    <h3>My 작성글</h3>
                    <p className={isSelected("MyPromotionBoard")} onClick={() => setSelectedComponent("MyPromotionBoard")}>
                      홍보 게시판
                    </p>
                    <p className={isSelected("MyCommunityBoard")} onClick={() => setSelectedComponent("MyCommunityBoard")}>
                      커뮤니티
                    </p>
                    <p className={isSelected("MyComments")} onClick={() => setSelectedComponent("MyComments")}>
                      내 댓글
                    </p>
                  </div>
                </div>
              </div>
              <div className="mypage-content-area">{renderComponent()}</div>
            </div>
          </div>
        )
      ) : (
        <CircularProgress className="mypage-progress" color="inherit" />
      )}
    </>
  );
}
