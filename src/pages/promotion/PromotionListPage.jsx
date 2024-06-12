import "./PromotionListPage.scss";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { Button, CircularProgress, FormControl, MenuItem, Select } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useMediaQuery } from "react-responsive";
import PromotionList from "../../components/promotion/PromotionList";
import { UpButton } from "../../components/common/button/UpButton";
import ServerError from "../../components/common/state/ServerError";
import Empty from "../../components/common/state/Empty";
import { promotionUrl } from "../../apis/apiURLs";
import { FixedTopBanner } from "../../components/board/FixedTopBanner";
import { PromotionBanner } from "../../components/promotion/PromotionBanner";
import { MoblieCreateButton } from "../../components/common/button/MoblieCreateButton";
import SortIcon from "../../assets/img/search_sort_icon.png";

const GET_COUNT_LIMIT = 20;
const SORT = {
  최신순: "time desc",
  오래된순: "time asc",
  추천순: "like desc",
  조회순: "view desc",
};

export function PromotionListPage() {
  const isMoblie = useMediaQuery({ query: "(max-width: 768px)" });
  const [scrollRef, inView] = useInView();
  const nav = useNavigate();
  const loc = useLocation();
  const [reload, setReload] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const [boardList, setBoardList] = useState([]);
  const [totalCnt, setTotalCnt] = useState(0);
  const [page, setPage] = useState(1);
  const [state, setState] = useState("loading");
  const [category, setCategory] = useState(searchParams.get("category") || "전체");
  const [sort, setSort] = useState(searchParams.get("sort") || "최신순");

  const [fixedList, setFixedList] = useState([]);

  const getFixedList = async () => {
    try {
      const res = await fetch(`${promotionUrl}?is_fixed=고정&category=공지`); // 카테고리별로 나눠서 고정할지?
      const data = await res.json();
      setFixedList(data.promotions);
    } catch (e) {
      console.error(e);
    }
  };

  const addBoardList = (newList) => {
    const uniqueList = [...boardList, ...newList].reduce((newArr, current) => {
      if (newArr.findIndex(({ _id }) => _id === current._id) === -1) {
        newArr.push(current);
      }
      return newArr;
    }, []);
    setBoardList(uniqueList);
  };

  const getPage = async () => {
    setState("loading");

    const [by, order] = SORT[sort].split(" ");
    try {
      const res = await fetch(
        `${promotionUrl}?page=${page}&limit=${GET_COUNT_LIMIT}&sortBy=${by}&sortOrder=${order}&category=${category === "전체" ? "" : category}`,
      );
      const data = await res.json();

      if (res.ok) {
        addBoardList(data.promotions);
        setTotalCnt(data.totalCount);
        setState("hasValue");

        console.log(data);
      } else {
        setState("hasError");
        console.error(data);
      }
    } catch (err) {
      setState("hasError");
    }
  };

  const handleClickDivision = (e) => {
    setCategory(e.target.id);
    setReload((cur) => cur + 1);
    setBoardList([]);
    setPage(1);
  };

  const handleFormBtn = () => {
    nav("/promotion/write");
  };

  useEffect(() => {
    getFixedList();
  }, []);

  useEffect(() => {
    setPage(1);
    setBoardList([]);
  }, [category, sort]);

  useEffect(() => {
    if (inView && state !== "loading") {
      // 총 개수 받아서 page 넘어가면 api 호출 X
      if (boardList.length >= totalCnt) return;
      if (boardList.length < page * GET_COUNT_LIMIT) {
        setReload((cur) => cur + 1);
        setPage(Math.ceil(boardList.length / GET_COUNT_LIMIT));
      } else {
        setPage((cur) => cur + 1);
      }
    }
  }, [inView]);

  useEffect(() => {
    if (!loc.search) {
      setCategory("전체");
      setSort("최신순");
      setReload(loc.key);
      setPage(1);
    }
  }, [loc.search]);

  useEffect(() => {
    getPage();
    setSearchParams({ sort, category });
  }, [page, reload, category, sort]);

  return (
    <>
      <Helmet>
        <title>티니박스(TeenyBox) 연극 홍보 게시판</title>
        <meta name="description" content="티니박스에서 쇼규모 연극 홍보 및 연극 관련 이벤트를 홍보해보세요!" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="티니박스(TeenyBox) 홍보 게시판" />
        <meta property="og:description" content="티니박스에서 쇼규모 연극 홍보 및 연극 관련 이벤트를 홍보해보세요!" />
      </Helmet>
      <FixedTopBanner linkTo={`/promotion/${fixedList[fixedList.length - 1]?.promotion_number}`} />
      <div className="promotion-page page-layout">
        <PromotionBanner />
        <div className="header flex-box">
          <div className="division flex-box">
            <div id="전체" className={category === "전체" ? "selected" : ""} onClick={handleClickDivision}>
              전체보기
            </div>
            <div id="연극" className={category === "연극" ? "selected" : ""} onClick={handleClickDivision}>
              연극
            </div>
            <div id="기타" className={category === "기타" ? "selected" : ""} onClick={handleClickDivision}>
              기타
            </div>
          </div>
          <div className="buttons">
            {isMoblie ? (
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
            ) : (
              <>
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                  <Select value={sort} onChange={(e) => setSort(e.target.value)} displayEmpty>
                    <MenuItem value="최신순">최신순</MenuItem>
                    <MenuItem value="추천순">추천순</MenuItem>
                    <MenuItem value="조회순">조회순</MenuItem>
                    <MenuItem value="오래된순">오래된순</MenuItem>
                  </Select>
                </FormControl>
                <Button className="create-button" onClick={handleFormBtn} variant="contained" size="small" color="secondary" disableElevation>
                  글쓰기
                </Button>
              </>
            )}
          </div>
        </div>
        {state === "loading" && !boardList.length ? (
          <div className={`state box`}>
            <CircularProgress color="secondary" />
          </div>
        ) : state === "hasError" ? (
          <div className={`state box`}>
            <ServerError onClickBtn={() => getPage()} />
          </div>
        ) : boardList.length + fixedList.length ? (
          <>
            <PromotionList newList={boardList} fixedList={fixedList} />
            {state === "loading" && (
              <div className={`state`}>
                <CircularProgress color="secondary" />
              </div>
            )}
            <UpButton />
            <MoblieCreateButton onClick={handleFormBtn} />
            <div className="scroll-ref" ref={scrollRef}></div>
          </>
        ) : (
          <div className={`state box`}>
            <Empty>
              <></>
            </Empty>
          </div>
        )}
      </div>
    </>
  );
}
