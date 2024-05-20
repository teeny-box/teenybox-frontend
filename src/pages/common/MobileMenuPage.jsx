import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./MobileMenuPage.scss";
import CloseIcon from "@mui/icons-material/Close";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import HomeIcon from "@mui/icons-material/Home";
import MovieIcon from "@mui/icons-material/Movie";
import FeedIcon from "@mui/icons-material/Feed";
import PeopleIcon from "@mui/icons-material/People";
import MobileSearchModal from "./MobileSearchModal";
import { AppContext } from "../../App";
import { userUrl } from "../../apis/apiURLs";
import { AlertCustom } from "../../components/common/alert/Alerts";
import default_user_img from "../../assets/img/default_user_img.svg";

export function MobileMenuPage() {
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [open, setOpen] = useState(false); // Alert 창 열림 여부 상태
  const { userData, setUserData } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleWindowResize = () => {
      if (window.innerWidth >= 769) {
        navigate("/");
      }
    };
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${userUrl}/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        // 사용자 정보 삭제 후 페이지 새로고침
        setUserData(null);
        setOpen(true);
      } else {
        console.error("로그아웃 실패");
      }
    } catch (error) {
      console.error("로그아웃 요청 에러:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    navigate("/");
  };

  const onShowModal = () => {
    setSearchModalOpen(true); // 검색 모달 열기
  };

  const onCloseModal = () => {
    setSearchModalOpen(false); // 검색 모달 닫기
  };

  console.log(userData);

  const profileImgSrc = userData?.profile_url && userData?.profile_url !== "" ? userData.profile_url : default_user_img;

  return (
    <div className="mobile-menu-background">
      <AlertCustom
        open={open}
        onclose={handleClose}
        title="로그아웃"
        content={<div>정상적으로 로그아웃 되었습니다.</div>}
        time={1000}
        severity="success"
        width={450}
        color="secondary"
      />

      {userData ? (
        <div className="mobile-menu-container">
          <div className="header">
            <div className="header-top-box">
              <Link to="/">
                <CloseIcon className="close-icon"></CloseIcon>
              </Link>
            </div>
            <div className="header-mid-box">
              <img
                className="profile-img"
                src={profileImgSrc}
                onError={(e) => {
                  e.target.src = default_user_img;
                }}
              />
              <div className="profile-info">
                <p className="profile-text">어서오세요!</p>
                <p className="user-nickname">{userData.nickname} 님</p>
              </div>
            </div>
            <div className="logined-header-bottom-box">
              <span className="tab-area left">
                <Link to="/mypages" className="tab-text">
                  마이페이지
                </Link>
              </span>
              {userData.role === "admin" && (
                <span className="tab-area">
                  <Link to="/admin" className="tab-text">
                    관리자페이지
                  </Link>
                </span>
              )}
              <span className="tab-area right">
                <div className="tab-text" onClick={handleLogout}>
                  로그아웃
                </div>
              </span>
            </div>
          </div>
          <div className="body">
            <div className="search-btn" onClick={onShowModal}>
              <SearchRoundedIcon className="search-btn-icon" />
            </div>
            <div className="category">
              <Link to="/" className="category-btn">
                <span>
                  <HomeIcon className="category-icon" />홈
                </span>
                <ArrowForwardIosIcon className="category-arrow-icon" />
              </Link>
              <Link to="/play" className="category-btn">
                <span>
                  <MovieIcon className="category-icon" />
                  연극
                </span>
                <ArrowForwardIosIcon className="category-arrow-icon" />
              </Link>
              <Link to="/promotion" className="category-btn">
                <span>
                  <FeedIcon className="category-icon" />
                  홍보
                </span>
                <ArrowForwardIosIcon className="category-arrow-icon" />
              </Link>
              <Link to="/community" className="category-btn">
                <span>
                  <PeopleIcon className="category-icon" />
                  커뮤니티
                </span>
                <ArrowForwardIosIcon className="category-arrow-icon" />
              </Link>
            </div>
            <div className="logout-btn" onClick={handleLogout}>
              <p>로그아웃</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mobile-menu-container">
          <div className="header">
            <div className="header-top-box">
              <Link to="/">
                <CloseIcon className="close-icon"></CloseIcon>
              </Link>
            </div>
            <div className="header-mid-box"></div>
            <div className="header-bottom-box">
              <Link to="/signup-in" className="tab-text">
                로그인
              </Link>
            </div>
          </div>
          <div className="body">
            <div className="search-btn" onClick={onShowModal}>
              <SearchRoundedIcon className="search-btn-icon" />
            </div>
            <div className="category">
              <Link to="/" className="category-btn">
                <span>
                  <HomeIcon className="category-icon" />홈
                </span>
                <ArrowForwardIosIcon className="category-arrow-icon" />
              </Link>
              <Link to="/play" className="category-btn">
                <span>
                  <MovieIcon className="category-icon" />
                  연극
                </span>
                <ArrowForwardIosIcon className="category-arrow-icon" />
              </Link>
              <Link to="/promotion" className="category-btn">
                <span>
                  <FeedIcon className="category-icon" />
                  홍보
                </span>
                <ArrowForwardIosIcon className="category-arrow-icon" />
              </Link>
              <Link to="/community" className="category-btn">
                <span>
                  <PeopleIcon className="category-icon" />
                  커뮤니티
                </span>
                <ArrowForwardIosIcon className="category-arrow-icon" />
              </Link>
            </div>
          </div>
        </div>
      )}
      {/* 모달 */}
      {searchModalOpen && <MobileSearchModal onCloseModal={onCloseModal} />}
    </div>
  );
}
