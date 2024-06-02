import "./CommunityListPage.scss";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Button, CircularProgress, Pagination, FormControl, MenuItem, Select } from "@mui/material";
import { Loop } from "@mui/icons-material";
import { Helmet } from "react-helmet-async";
import { useInView } from "react-intersection-observer";
import { useMediaQuery } from "react-responsive";
import CommunityList from "../../components/community/CommunityList";
import ServerError from "../../components/common/state/ServerError";
import Empty from "../../components/common/state/Empty";
import { BoardRightContainer } from "../../components/board/BoardRightContainer";
import { postUrl } from "../../apis/apiURLs";
import { CommunityTabBar } from "../../components/board";
import { FixedTopBanner } from "../../components/board/FixedTopBanner";
import { UpButton } from "../../components/common/button/UpButton";
import { MoblieCreateButton } from "../../components/common/button/MoblieCreateButton";

const SORT = {
  최신순: "post_number desc",
  오래된순: "post_number asc",
  추천순: "likes desc",
  조회순: "views desc",
};

export function CommunityListPage() {
  const isMoblie = useMediaQuery({ query: "(max-width: 768px)" });
  const [searchParams, setSearchParams] = useSearchParams();
  const loc = useLocation();
  const nav = useNavigate();
  const [reload, setReload] = useState("");
  const [scrollRef, inView] = useInView();

  const [selected, setSelected] = useState(searchParams.get("category") === "공지" ? "공지" : "자유");
  const [fixedList, setFixedList] = useState([]);
  const [boardList, setBoardList] = useState([]);
  const [totalCnt, setTotalCnt] = useState(0);
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [state, setState] = useState("loading");
  const [toggle, setToggle] = useState(false);
  const [sort, setSort] = useState(searchParams.get("sort") || "최신순");

  const getFixedList = async () => {
    try {
      const res = await fetch(`${postUrl}?isFixed=고정`); // 카테고리별로 나눠서 고정할지?
      const data = await res.json();
      setFixedList(data.posts);
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

  const getPage = async (method) => {
    setState("loading");
    try {
      const [by, order] = SORT[sort].split(" ");
      const res = await fetch(`${postUrl}?category=${selected}&page=${page}&limit=10&sortBy=${by}&sortOrder=${order}`);
      const data = await res.json();
      console.log(res, data);

      if (res.ok) {
        if (method === "add" && page > 1) {
          addBoardList(data.posts);
        } else {
          setBoardList(data.posts);
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

  const handleReload = () => {
    setToggle(true);
    setTimeout(() => setToggle(false), 500);
    setPage(1);
    setReload((cur) => cur + 1);
  };

  const handleChangePage = (e, value) => {
    setPage(value);
    nav(`?category=${selected === "공지" ? "공지" : "일반"}&sort=${sort}&page=${value}`);
  };

  const handleFormBtn = () => {
    nav("/community/write");
  };

  useEffect(() => {
    if (isMoblie) {
      setPage(1);
      setBoardList([]);
    }
  }, [isMoblie, sort, selected, reload]);

  useEffect(() => {
    console.log(inView, reload, isMoblie);
    if (inView && isMoblie && state !== "loading") {
      // 총 개수 받아서 page 넘어가면 api 호출 X
      if (boardList.length >= totalCnt) return;
      console.log("asd", boardList.length, totalCnt);
      setPage((cur) => cur + 1);
    }
  }, [inView]);

  useEffect(() => {
    if (!loc.search) {
      setSelected("자유");
      setSort("최신순");
      setReload(loc.key);
      setPage(1);
    }
  }, [loc.search]);

  useEffect(() => {
    console.log(page, sort, selected, reload);
    if (page && sort && selected) {
      getFixedList();
      if (isMoblie) {
        getPage("add");
      } else {
        getPage();
        window.scrollTo({ top: 0 });
      }
      setSearchParams({ category: selected === "공지" ? "공지" : "일반", sort, page });
    }
  }, [page, sort, selected, reload]);

  return (
    <>
      <FixedTopBanner linkTo={"/community/35"} />
      <div className="Community-page page-layout">
        <Helmet>
          <title>티니박스(TeenyBox) 커뮤니티</title>
          <meta name="description" content="티니박스에서 연극과 관련된 이야기를 나눠보세요!" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="티니박스(TeenyBox) 커뮤니티" />
          <meta property="og:description" content="티니박스에서 연극과 관련된 이야기를 나눠보세요!" />
        </Helmet>
        <CommunityTabBar selected={selected} setSelected={setSelected} setPage={setPage} setReload={setReload} setSort={setSort} />
        <div className="Community-container">
          <div className="Community-left-container">
            <div className="header flex-box">
              <div className="left">
                <span>전체게시글&nbsp;</span>
                <span className="point">{totalCnt.toLocaleString("ko-KR")}</span>
                <span>개</span>
                <Loop onClick={handleReload} color="secondary" className={`refresh pointer ${toggle && "start"}`} />
              </div>
              <div className="buttons">
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                  <Select value={sort} onChange={(e) => setSort(e.target.value)} displayEmpty>
                    <MenuItem value="최신순">최신순</MenuItem>
                    <MenuItem value="추천순">추천순</MenuItem>
                    <MenuItem value="조회순">조회순</MenuItem>
                    <MenuItem value="오래된순">오래된순</MenuItem>
                  </Select>
                </FormControl>
                <Button className="create-button" onClick={handleFormBtn} variant="contained" size="small" color="secondary" disableElevation>
                  작성하기
                </Button>
              </div>
            </div>
            <div className="main">
              {state === "loading" && !boardList.length ? (
                <div className="state">
                  <CircularProgress color="secondary" className="progress" />
                </div>
              ) : state === "hasError" ? (
                <div className="state">
                  <ServerError onClickBtn={() => getPage()} />
                </div>
              ) : boardList.length ? (
                <>
                  {(isMoblie || page === 1) && <CommunityList boardList={fixedList} isFixed={true} />}
                  <CommunityList boardList={boardList} />
                  {isMoblie && state === "loading" && (
                    <div className={`state`}>
                      <CircularProgress color="secondary" />
                    </div>
                  )}
                  {isMoblie || (
                    <div className="pagination">
                      <Pagination page={page} onChange={handleChangePage} count={Math.ceil(totalCnt / 10)} color="secondary" siblingCount={2} />
                    </div>
                  )}
                  <UpButton />
                  <MoblieCreateButton onClick={handleFormBtn} />
                  <div className="scroll-ref" ref={scrollRef}></div>
                </>
              ) : (
                <div className="state box">
                  <Empty>
                    <></>
                  </Empty>
                </div>
              )}
            </div>
          </div>
          <BoardRightContainer />
        </div>
      </div>
    </>
  );
}
