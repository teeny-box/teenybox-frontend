import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
// <'OOO' 검색 결과> 띄우기 위한 컴포넌트 (공통)
import SearchResultHeader from "../../components/search/common/SearchResultHeader";
// 총 검색 결과 개수 띄우기 위한 컴포넌트 (공통)
import SearchResultCount from "../../components/search/common/SearchResultCount";
// 연극/홍보게시물/자유게시물 선택 탭 띄우기 위한 컴포넌트 (공통)
import SearchResultTab from "../../components/search/common/SearchResultTab";
// 연극 검색 결과 띄우기 위한 컴포넌트 (여기서부터는 개별로)
import PlaySearchResult from "../../components/search/play-search-result/PlaySearchResult";
import "./SearchResultPage.scss";

export default function SearchResultPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  // 검색어
  const searchKeyword = queryParams.get("query");

  // 로딩중 여부
  const [isLoading, setIsLoading] = useState(true);
  // 연극/홍보게시물/자유게시물 선택 탭에서 현재 선택되어 있는 메뉴
  const [selectedTabMenu, setSelectedTabMenu] = useState("연극");
  // 연극 검색 결과
  const [playSearchResult, setPlaySearchResult] = useState(null);
  console.log(playSearchResult);

  // 검색 결과 받아오기
  useEffect(() => {
    fetch(
      `https://dailytopia2.shop/api/shows?title=${searchKeyword}&limit=1000`
    )
      .then((res) => res.json())
      .then((data) => {
        setPlaySearchResult(data.shows);
        setIsLoading(false);
      })
      .catch((err) => alert(err));
  }, []);

  return (
    <>
      {isLoading ? (
        <div>로딩중</div>
      ) : (
        <div className="search-result-container">
          <SearchResultHeader searchKeyword={searchKeyword} />
          <SearchResultCount />
          <SearchResultTab
            playSearchCnt={playSearchResult.length}
            selectedTabMenu={selectedTabMenu}
            setSelectedTabMenu={setSelectedTabMenu}
          />
          {selectedTabMenu === "연극" && (
            <PlaySearchResult
              playSearchResult={playSearchResult}
              setPlaySearchResult={setPlaySearchResult}
            />
          )}
          {selectedTabMenu === "홍보게시글" && <div></div>}
          {selectedTabMenu === "자유게시글" && <div></div>}
        </div>
      )}
    </>
  );
}