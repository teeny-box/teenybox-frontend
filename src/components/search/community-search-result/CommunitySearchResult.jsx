import { useEffect, useState } from "react";
import FreeBoardList from "../../board-free/FreeBoardList";
import "./CommunitySearchResult.scss";
import { postUrl } from "../../../apis/apiURLs";
import { CircularProgress, Pagination } from "@mui/material";
import EmptySearchResult from "../../common/state/EmptySearchResult";
import { useSearchParams } from "react-router-dom/dist";
import ServerError from "../../common/state/ServerError";

const TYPES = ["title", "tag"];

export default function CommunitySearchResult({ searchKeyword }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchResult, setSearchResult] = useState();
  const [totalCnt, setTotalCnt] = useState(0);
  const [page, setPage] = useState(1);
  const [type, setType] = useState(searchParams.get("type") || "title");
  const [state, setState] = useState("loading");

  const getCommunitySearchResult = async () => {
    setState("loading");

    if (!searchKeyword.trim()) {
      setSearchResult([]);
      setState("hasValue");
      return;
    }

    try {
      const res = await fetch(`${postUrl}/search?type=${type}&query=${searchKeyword}&page=${page}&limit=10`);
      const data = await res.json();

      if (res.ok) {
        setSearchResult(data.posts);
        setTotalCnt(data.totalCount);
        setState("hasValue");
      } else {
        setState("hasError");
        console.error(data);
      }
    } catch (err) {
      setState("hasError");
    }
  };

  const handleChangeType = (e) => {
    setType(e.target.value);
    searchParams.set("type", e.target.value);
    setSearchParams(searchParams);
  };

  useEffect(() => {
    if (!TYPES.includes(searchParams.get("type"))) {
      setType("title");
      searchParams.set("type", "title");
      setSearchParams(searchParams);
    }

    getCommunitySearchResult();
  }, [searchParams, page, type]);

  useEffect(() => {
    getCommunitySearchResult();
  }, []);

  return (
    <div className="community-search-result-container">
      <div className="search-header">
        <div>
          <span className="title">커뮤니티 검색결과</span>
          <span className="title count">({totalCnt.toLocaleString("ko-KR")})</span>
        </div>
        <div>
          <span>검색 범위 : </span>
          <select className="sort-by" value={type} onChange={handleChangeType}>
            <option value="title">글 제목</option>
            <option value="tag">태그</option>
          </select>
        </div>
      </div>
      <div className="search-content">
        {state === "loading" ? (
          <div className="loading">
            <CircularProgress color="secondary" />
          </div>
        ) : state === "hasError" ? (
          <div className={`state`}>
            <ServerError onClickBtn={getCommunitySearchResult} />
          </div>
        ) : !searchResult?.length ? (
          <div className="state">
            <EmptySearchResult type={true} />
          </div>
        ) : (
          <>
            <FreeBoardList boardList={searchResult} />
            <div className="search-pagination">
              <Pagination count={Math.ceil(totalCnt / 10)} color="secondary" page={page} size="large" onChange={(e, value) => setPage(value)} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
