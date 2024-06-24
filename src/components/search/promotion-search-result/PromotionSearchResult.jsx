import { useEffect, useState } from "react";
import { CircularProgress, FormControl, FormControlLabel, MenuItem, Pagination, Radio, RadioGroup, Select } from "@mui/material";
import { useLocation, useSearchParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { useMediaQuery } from "react-responsive";
import "./PromotionSearchResult.scss";
import { promotionUrl } from "../../../apis/apiURLs";
import EmptySearchResult from "../../common/state/EmptySearchResult";
import ServerError from "../../common/state/ServerError";
import PromotionList from "../../promotion/PromotionList";
import { UpButton } from "../../common/button/UpButton";

const GET_COUNT_LIMIT = 12;
const SORT = {
  최신순: "time desc",
  오래된순: "time asc",
  추천순: "like desc",
  조회순: "view desc",
};

export default function PromotionSearchResult({ searchKeyword }) {
  const isMoblie = useMediaQuery({ query: "(max-width: 768px)" });
  const [scrollRef, inView] = useInView();
  const loc = useLocation();
  const [reload, setReload] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchResult, setSearchResult] = useState([]);
  const [totalCnt, setTotalCnt] = useState({ play_title: 0, title: 0, tag: 0 });
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [type, setType] = useState(searchParams.get("type") || "play_title");
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

  const getTotalCount = async () => {
    const promises = ["play_title", "title", "tag"].map((_type) =>
      fetch(`${promotionUrl}/search?type=${_type}&query=${searchKeyword}&limit=1`)
        .then((res) => res.json())
        .then((data) => data.totalCount),
    );

    try {
      const counts = await Promise.all(promises);
      setTotalCnt({ play_title: counts[0], title: counts[1], tag: counts[2] });
    } catch (err) {
      setState("hasError");
    }
  };

  const getPromotionSearchResult = async (method) => {
    setState("loading");

    if (!searchKeyword.trim()) {
      setSearchResult([]);
      setState("hasValue");
      return;
    }

    try {
      const [by, order] = SORT[sort].split(" ");
      const res = await fetch(
        `${promotionUrl}/search?type=${type}&query=${searchKeyword}&page=${page}&limit=${GET_COUNT_LIMIT}&sortBy=${by}&sortOrder=${order}`,
      );
      const data = await res.json();
      console.log(res, data);

      if (res.ok) {
        if (method === "add" && page > 1) {
          addSearchResult(data.promotions);
        } else {
          setSearchResult(data.promotions);
        }
        setTotalCnt((cur) => ({ ...cur, [type]: data.totalCount }));
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
    getTotalCount();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [type, sort]);

  useEffect(() => {
    if (isMoblie) {
      setPage(1);
    }
    setReload((cur) => cur + 1);
    setSearchResult([]);
  }, [isMoblie]);

  useEffect(() => {
    if (inView && isMoblie && state !== "loading") {
      // 총 개수 받아서 page 넘어가면 api 호출 X
      if (searchResult.length >= totalCnt[type]) return;
      if (searchResult.length < page * GET_COUNT_LIMIT) {
        setReload((cur) => cur + 1);
        setPage(Math.ceil(searchResult.length / GET_COUNT_LIMIT));
      } else {
        setPage((cur) => cur + 1);
      }
    }
  }, [inView]);

  useEffect(() => {
    if (!loc.search) {
      setType("play_title");
      setSort("최신순");
      setReload(loc.key);
      setPage(1);
    }
  }, [loc.search]);

  useEffect(() => {
    if (isMoblie) {
      getPromotionSearchResult("add");
    } else {
      getPromotionSearchResult();
      window.scrollTo({ top: 0 });
    }
    setSearchParams({ query: searchKeyword, type, page, sort, category: "홍보게시판" });
  }, [page, reload, type, sort]);

  return (
    <div className="promotion-search-result-container">
      <div className="search-header">
        <div className="type">
          <RadioGroup name="controlled-radio-buttons-group" value={type} onChange={(e) => setType(e.target.value)}>
            <FormControlLabel
              value="play_title"
              control={<Radio size="10px" color="secondary" />}
              label={`연극/행사명(${totalCnt.play_title.toLocaleString("ko-KR")})`}
            />
            <FormControlLabel value="title" control={<Radio size="10px" color="secondary" />} label={`글 제목(${totalCnt.title.toLocaleString("ko-KR")})`} />
            <FormControlLabel value="tag" control={<Radio size="10px" color="secondary" />} label={`태그(${totalCnt.tag.toLocaleString("ko-KR")})`} />
          </RadioGroup>
        </div>
        <div className="sort">
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <Select value={sort} onChange={(e) => setSort(e.target.value)} displayEmpty>
              <MenuItem value="최신순">최신순</MenuItem>
              <MenuItem value="추천순">추천순</MenuItem>
              <MenuItem value="조회순">조회순</MenuItem>
              <MenuItem value="오래된순">오래된순</MenuItem>
            </Select>
          </FormControl>
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
            <ServerError onClickBtn={getPromotionSearchResult} />
          </div>
        </div>
      ) : !searchResult?.length ? (
        <div className="search-content">
          <div className="state">
            <EmptySearchResult play={true} type={true} />
          </div>
        </div>
      ) : (
        <>
          <div className="search-content">{searchResult && <PromotionList newList={searchResult} />}</div>
          {isMoblie && state === "loading" && (
            <div className={`state`}>
              <CircularProgress color="secondary" />
            </div>
          )}
          <UpButton />
          <div className="scroll-ref" ref={scrollRef}></div>
          {isMoblie || (
            <div className="pagination">
              <Pagination
                count={Math.ceil(totalCnt[type] / GET_COUNT_LIMIT)}
                color="secondary"
                page={page}
                size="large"
                onChange={(e, value) => setPage(value)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
