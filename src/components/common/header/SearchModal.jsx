import React, { useState, useRef, useEffect } from "react";
import "./SearchModal.scss";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const SearchModal = ({ onCloseModal }) => {
  const inputRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);
  const [contentVisible, setContentVisible] = useState(true);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); // input 요소에 포커스 주기
    }

    // 컴포넌트가 처음으로 렌더링될 때 로컬 스토리지에서 최근 검색어 가져오기
    const storedRecentSearches = JSON.parse(localStorage.getItem("recentSearches"));
    if (storedRecentSearches) {
      setRecentSearches(storedRecentSearches);
    }
  }, []);

  const sendUrl = (query) => {
    let encodedQuery = "";

    if (query.charAt(0) === "#") {
      encodedQuery = encodeURIComponent(query.slice(1));
      window.location.href = `/search?query=${encodedQuery}&category=홍보게시판&type=tag`;
    } else {
      encodedQuery = encodeURIComponent(query);
      window.location.href = `/search?query=${encodedQuery}`;
    }
  };

  const handleCloseStart = () => {
    setIsClosing(true);
    setContentVisible(false);
    setTimeout(onCloseModal, 200); // 애니메이션 시간에 맞추어 모달을 닫습니다.
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      // 엔터 키를 누르면 검색어를 URL 쿼리로 전달
      const searchQuery = inputRef.current.value.trim();
      if (!searchQuery) return;
      sendUrl(searchQuery);

      // 최근 검색어 목록에서 입력한 검색어의 인덱스를 찾습니다.
      const existingIndex = recentSearches.indexOf(searchQuery);

      // 이미 최근 검색어 목록에 있는 검색어라면 해당 검색어를 배열에서 제거하고 다시 맨 앞에 추가
      if (existingIndex !== -1) {
        recentSearches.splice(existingIndex, 1);
      }

      // 새로운 검색어를 최상단에 추가
      const updatedRecentSearches = [searchQuery, ...recentSearches.slice(0, 4)];
      setRecentSearches(updatedRecentSearches);

      // 로컬 스토리지에 최근 검색어 저장
      localStorage.setItem("recentSearches", JSON.stringify(updatedRecentSearches));
    }
  };

  const handleDeleteRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  }; // 비우기 클릭 시 로컬스토리지 비우기

  const handleRecentSearchClick = (searchQuery) => {
    // 검색을 실행
    sendUrl(searchQuery);

    // 최근 검색어 목록에서 클릭한 검색어의 인덱스를 찾습니다
    const existingIndex = recentSearches.indexOf(searchQuery);

    // 이미 최근 검색어 목록에 있는 검색어라면 해당 검색어를 배열에서 제거하고 다시 맨 앞에 추가
    if (existingIndex !== -1) {
      recentSearches.splice(existingIndex, 1);
    }

    // 클릭한 검색어를 최상단에 추가
    const updatedRecentSearches = [searchQuery, ...recentSearches.slice(0, 4)];
    setRecentSearches(updatedRecentSearches);

    // 로컬 스토리지에 최근 검색어 저장
    localStorage.setItem("recentSearches", JSON.stringify(updatedRecentSearches));
  };

  return (
    <>
      <div className="search-modal-backdrop" onClick={handleCloseStart}></div>
      <div className={`search-modal-container ${isClosing ? "closing" : ""}`}>
        <div className={`search-modal-box ${contentVisible ? "" : "hide-content"}`}>
          <SearchRoundedIcon className="search-modal-search-icon" />
          <input className="search-modal-input" ref={inputRef} placeholder="Teeny-Box.com 검색하기" onKeyDown={handleKeyDown}></input>
          <HighlightOffIcon className="search-modal-exit-icon" onClick={handleCloseStart} />
          <div className="last-search-header-box">
            <div className="last-search-title">&nbsp;&nbsp;최근 검색어</div>
            <div className="last-search-delete" onClick={handleDeleteRecentSearches}>
              <DeleteOutlineIcon className="last-search-delete-icon" />
              삭제&nbsp;&nbsp;
            </div>
          </div>
          <div className="recent-search-box">
            {recentSearches.length > 0 ? (
              recentSearches.slice(0, 5).map((search, index) => (
                <div key={index} className="recent-search-contents">
                  <p className="recent-search-text" onClick={() => handleRecentSearchClick(search)}>
                    {search}
                  </p>
                </div>
              ))
            ) : (
              <p className="no-recent-search-text">최근 검색어가 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchModal;
