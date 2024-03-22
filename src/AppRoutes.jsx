import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/common/header/Header";
import Footer from "./components/common/footer/Footer";
import {
  PRBoardListPage,
  PRBoardDetailPage,
  PRBoardFormPage,
  FreeBoardEdit,
  PRBoardEdit,
  FreeBoardDetailPage,
  FreeBoardFormPage,
  FreeBoardListPage,
  PlayList,
  PlayDetail,
  SignUp_In,
  InputAdditionalInfo,
  MyPage,
  Main,
  Admin,
  SearchResultPage,
  CommonLayout,
  PrivacyPolicy,
  KakaoRedirection,
  GoogleRedirection,
  NaverRedirection,
  ForbiddenPage,
  NotFoundPage,
  NotFoundRedirect,
} from "./pages";
import useScrollToTop from "./hooks/useScrollToTop";

let currentPath = "";
let reloard = true;

export default function AppRoutes({ setPrevPlayListQuery }) {
  const location = useLocation();
  useScrollToTop();

  useEffect(() => {
    if (location.pathname === "/search" || location.pathname === "/mypages") {
      currentPath = location.pathname + location.search;
      return;
    }
    if (currentPath === location.pathname + location.search && reloard) {
      reloard = false;
      window.location.reload();
    }
    currentPath = location.pathname + location.search;
  }, [location]);

  return (
    <Routes>
      {/* 에러 페이지 */}
      <Route path="/forbidden" element={<ForbiddenPage />} />
      <Route path="/not-found" element={<NotFoundPage />} />

      {/* 로그인 관련 페이지 */}
      <Route path="/user/kakao-login" element={<KakaoRedirection />} />
      <Route path="/user/google-login" element={<GoogleRedirection />} />
      <Route path="/user/naver-login" element={<NaverRedirection />} />

      {/* 나머지 페이지 */}
      <Route
        path="/*"
        element={
          <>
            <Header />
            <CommonLayout setPrevPlayListQuery={setPrevPlayListQuery}>
              <Routes>
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/signup-in" element={<SignUp_In />} />
                <Route path="/additional-user-info" element={<InputAdditionalInfo />} />

                <Route path="/mypages" element={<MyPage />} />
                <Route path="/" element={<Main />} />

                <Route path="/admin" element={<Admin />} />

                <Route path="/community" element={<FreeBoardListPage />} />
                <Route path="/community/:postId" element={<FreeBoardDetailPage />} />
                <Route path="/community/write" element={<FreeBoardFormPage />} />
                <Route path="/community/edit/:postId" element={<FreeBoardEdit />} />

                <Route path="/promotion" element={<PRBoardListPage />} />
                <Route path="/promotion/:postId" element={<PRBoardDetailPage />} />
                <Route path="/promotion/write" element={<PRBoardFormPage />} />
                <Route path="/promotion/edit/:postId" element={<PRBoardEdit />} />

                <Route path="/play" element={<PlayList />} />
                <Route path="/play/:playId" element={<PlayDetail />} />

                <Route path="/search" element={<SearchResultPage />} />
                <Route path="/*" element={<NotFoundRedirect />} />
              </Routes>
            </CommonLayout>
            <Footer />
          </>
        }
      />
    </Routes>
  );
}
