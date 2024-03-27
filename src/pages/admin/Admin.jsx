import React, { useState, useEffect, useContext } from "react";
import "./Admin.scss";
import { useNavigate } from "react-router-dom";
import AdminUser from "../../components/admin/AdminUser";
import AdminReview from "../../components/admin/AdminReview";
import AdminPromotion from "../../components/admin/AdminPromotion";
import AdminPromotionComments from "../../components/admin/AdminPromotionComments";
import AdminCommunity from "../../components/admin/AdminCommunity";
import AdminCommunityComments from "../../components/admin/AdminCommunityComments";
import { AppContext } from "../../App";

export function Admin() {
  const [selectedComponent, setSelectedComponent] = useState("AdminUser");
  const { userData } = useContext(AppContext);
  const navigate = useNavigate();

  // contextApi로 전역 관리하는 유저 정보를 확인하여 비 로그인이거나 일반회원일 경우 접근을 막고 forbidden페이지로 리다이렉션
  useEffect(() => {
    if (!userData || !userData.user || userData.user.role !== "admin") {
      navigate("/forbidden");
    }
  }, [userData]);

  const isSelected = (componentName) => (selectedComponent === componentName ? "selected" : "");
  // nav 에서 선택된 탭에 따라 다른 컴포넌트 랜더링
  const renderComponent = () => {
    if (userData && userData.user) {
      switch (selectedComponent) {
        case "AdminUser":
          return <AdminUser />;
        case "AdminReview":
          return <AdminReview />;
        case "AdminPromotion":
          return <AdminPromotion />;
        case "AdminPromotionComments":
          return <AdminPromotionComments />;
        case "AdminCommunity":
          return <AdminCommunity />;
        case "AdminCommunityComments":
          return <AdminCommunityComments />;
        default:
          return <AdminUser />;
      }
    } else {
      return null;
    }
  };
  return (
    <div className="admin-template">
      <div className="admin-container">
        <div className="admin-nav">
          <div className="admin-nav-header">
            <p className="admin-nav-header-text">관리자</p>
          </div>
          <div className="admin-nav-body">
            <div className="admin-nav-box">
              <h3>회원 관리</h3>
              <p className={isSelected("AdminUser")} onClick={() => setSelectedComponent("AdminUser")}>
                회원 정보
              </p>
            </div>
            <div className="admin-nav-box">
              <h3>공연 후기 관리</h3>
              <p className={isSelected("AdminReview")} onClick={() => setSelectedComponent("AdminReview")}>
                공연 후기
              </p>
            </div>
            <div className="admin-nav-box">
              <h3>홍보 게시판 관리</h3>
              <p className={isSelected("AdminPromotion")} onClick={() => setSelectedComponent("AdminPromotion")}>
                홍보 게시글
              </p>
              <p className={isSelected("AdminPromotionComments")} onClick={() => setSelectedComponent("AdminPromotionComments")}>
                댓글
              </p>
            </div>
            <div className="admin-nav-box">
              <h3>커뮤니티 관리</h3>
              <p className={isSelected("AdminCommunity")} onClick={() => setSelectedComponent("AdminCommunity")}>
                커뮤니티 게시글
              </p>
              <p className={isSelected("AdminCommunityComments")} onClick={() => setSelectedComponent("AdminCommunityComments")}>
                댓글
              </p>
            </div>
          </div>
        </div>
        <div className="admin-content-area">{renderComponent()}</div>
      </div>
    </div>
  );
}
