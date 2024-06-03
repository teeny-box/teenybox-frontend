import { useEffect, useState } from "react";
import { CircularProgress, FormControl, FormControlLabel, MenuItem, Pagination, Radio, RadioGroup, Select } from "@mui/material";
import { useLocation, useSearchParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { useMediaQuery } from "react-responsive";
import { postUrl } from "../../../apis/apiURLs";
import CommunityList from "../../community/CommunityList";
import "./CommunitySearchResult.scss";
import EmptySearchResult from "../../common/state/EmptySearchResult";
import ServerError from "../../common/state/ServerError";
import RangeIcon from "../../../assets/img/search_range_icon.png";
import SortIcon from "../../../assets/img/search_sort_icon.png";

// const TYPES = ["title", "tag"];
const GET_COUNT_LIMIT = 3;
const SORT = {
  최신순: "time desc",
  오래된순: "time asc",
  추천순: "like desc",
  조회순: "view desc",
};

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
  const [sort, setSort] = useState(searchParams.get("sort") || "최신순");
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
      const [by, order] = SORT[sort].split(" ");
      const res = await fetch(`${postUrl}/search?type=${type}&query=${searchKeyword}&page=${page}&limit=${GET_COUNT_LIMIT}&sortBy=${by}&sortOrder=${order}`);
      const data = await res.json();
      console.log(res, data);

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

  useEffect(() => {
    setPage(1);
  }, [type, sort]);

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
      if (searchResult.length < page * GET_COUNT_LIMIT) {
        setReload((cur) => cur + 1);
        setPage(Math.ceil(searchResult.length / GET_COUNT_LIMIT));
      } else {
        setPage((cur) => cur + 1);
      }
      console.log("asd", searchResult.length, totalCnt);
    }
  }, [inView]);

  useEffect(() => {
    if (!loc.search) {
      setType("title");
      setSort("최신순");
      setReload(loc.key);
      setPage(1);
    }
  }, [loc.search]);

  useEffect(() => {
    console.log(page, type, sort, reload);
    if (isMoblie) {
      getCommunitySearchResult("add");
    } else {
      getCommunitySearchResult();
      window.scrollTo({ top: 0 });
    }
    setSearchParams({ query: searchKeyword, type, page, sort });
  }, [page, reload, type, sort]);

  return (
    <div className="community-search-result-container">
      <div className="search-header">
        <div>
          <span className="title">커뮤니티 검색결과</span>
          <span className="title count">({totalCnt.toLocaleString("ko-KR")})</span>
        </div>
        <div className="right">
          {isMoblie ? (
            <>
              <div className="select-box">
                <img src={RangeIcon} />
                <span>검색범위</span>
                <FormControl sx={{ m: 1, minWidth: 120 }} className="range">
                  <Select value={type} onChange={(e) => setType(e.target.value)} displayEmpty>
                    <MenuItem value="title">글 제목</MenuItem>
                    <MenuItem value="tag">태그</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="select-box">
                <img src={SortIcon} />
                <span>정렬</span>
                <FormControl sx={{ m: 1, minWidth: 120 }} className="sort">
                  <Select value={sort} onChange={(e) => setSort(e.target.value)} displayEmpty>
                    <MenuItem value="최신순">최신순</MenuItem>
                    <MenuItem value="추천순">추천순</MenuItem>
                    <MenuItem value="조회순">조회순</MenuItem>
                    <MenuItem value="오래된순">오래된순</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </>
          ) : (
            <>
              <div className="type">
                <RadioGroup name="controlled-radio-buttons-group" value={type} onChange={(e) => setType(e.target.value)}>
                  <FormControlLabel value="title" control={<Radio size="10px" color="secondary" />} label="글 제목" />
                  <FormControlLabel value="tag" control={<Radio size="10px" color="secondary" />} label="태그" />
                </RadioGroup>
              </div>
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <Select value={sort} onChange={(e) => setSort(e.target.value)} displayEmpty>
                  <MenuItem value="최신순">최신순</MenuItem>
                  <MenuItem value="추천순">추천순</MenuItem>
                  <MenuItem value="조회순">조회순</MenuItem>
                  <MenuItem value="오래된순">오래된순</MenuItem>
                </Select>
              </FormControl>
            </>
          )}
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
              <Pagination count={Math.ceil(totalCnt / GET_COUNT_LIMIT)} color="secondary" page={page} size="large" onChange={(e, value) => setPage(value)} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
