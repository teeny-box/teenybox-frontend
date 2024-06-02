import { useEffect, useState } from "react";
import { CircularProgress, Pagination } from "@mui/material";
import { useLocation, useSearchParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { useMediaQuery } from "react-responsive";
import { postUrl } from "../../../apis/apiURLs";
import CommunityList from "../../community/CommunityList";
import "./CommunitySearchResult.scss";
import EmptySearchResult from "../../common/state/EmptySearchResult";
import ServerError from "../../common/state/ServerError";

// const TYPES = ["title", "tag"];

export default function CommunitySearchResult({ searchKeyword }) {
  const isMoblie = useMediaQuery({ query: "(max-width: 768px)" });
  const [scrollRef, inView] = useInView();
  const loc = useLocation();
  const [reload, setReload] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchResult, setSearchResult] = useState([]);
  const [totalCnt, setTotalCnt] = useState(0);
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [type, setType] = useState(searchParams.get("type") || "title");
  const [state, setState] = useState("loading");

  const addSearchResult = (newList) => {
    const uniqueList = [...searchResult, ...newList].reduce((newArr, current) => {
      if (newArr.findIndex(({ _id }) => _id === current._id) === -1) {
        newArr.push(current);
      }
      return newArr;
    }, []);
    setSearchResult(uniqueList);
  };

  const getCommunitySearchResult = async (method) => {
    setState("loading");

    if (!searchKeyword.trim()) {
      setSearchResult([]);
      setState("hasValue");
      return;
    }

    try {
      const res = await fetch(`${postUrl}/search?type=${type}&query=${searchKeyword}&page=${page}&limit=5`);
      const data = await res.json();

      if (res.ok) {
        if (method === "add" && page > 1) {
          addSearchResult(data.posts);
        } else {
          setSearchResult(data.posts);
        }
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
    setPage(1);
  }, [type]);

  useEffect(() => {
    if (isMoblie) {
      console.log("moblie");
      setPage(1);
    }
    setReload((cur) => cur + 1);
    setSearchResult([]);
  }, [isMoblie]);

  useEffect(() => {
    console.log(inView, reload, isMoblie);
    if (inView && isMoblie && state !== "loading") {
      // 총 개수 받아서 page 넘어가면 api 호출 X
      if (searchResult.length >= totalCnt) return;
      console.log("asd", searchResult.length, totalCnt);
      setPage((cur) => cur + 1);
    }
  }, [inView]);

  useEffect(() => {
    if (!loc.search) {
      setType("title");
      setReload(loc.key);
      setPage(1);
    }
  }, [loc.search]);

  useEffect(() => {
    console.log(page, type, reload);
    if (isMoblie) {
      getCommunitySearchResult("add");
    } else {
      getCommunitySearchResult();
      window.scrollTo({ top: 0 });
    }
    setSearchParams({ query: searchKeyword, type, page });
  }, [page, type, reload]);

  return (
    <div className="community-search-result-container">
      <div className="search-header">
        <div>
          <span className="title">커뮤니티 검색결과</span>
          <span className="title count">({totalCnt.toLocaleString("ko-KR")})</span>
        </div>
        <div className="left">
          <span>검색 범위 : </span>
          <select className="sort-by" value={type} onChange={handleChangeType}>
            <option value="title">글 제목</option>
            <option value="tag">태그</option>
          </select>
        </div>
      </div>
      {(state === "loading" && isMoblie && page === 1) || (state === "loading" && !isMoblie) ? (
        <div className="search-content">
          <div className="state">
            <CircularProgress color="secondary" />
          </div>
        </div>
      ) : state === "hasError" ? (
        <div className="search-content">
          <div className={`state box`}>
            <ServerError onClickBtn={getCommunitySearchResult} />
          </div>
        </div>
      ) : !searchResult.length ? (
        <div className="search-content">
          <div className="state box">
            <EmptySearchResult type={true} />
          </div>
        </div>
      ) : (
        <>
          <div className="search-content">
            <CommunityList boardList={searchResult} />
          </div>
          {isMoblie && state === "loading" && (
            <div className={`state`}>
              <CircularProgress color="secondary" />
            </div>
          )}
          <div className="scroll-ref" ref={scrollRef}></div>
          {isMoblie || (
            <div className="search-pagination">
              <Pagination count={Math.ceil(totalCnt / 5)} color="secondary" page={page} size="large" onChange={(e, value) => setPage(value)} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
