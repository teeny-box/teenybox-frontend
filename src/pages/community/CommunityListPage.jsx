import "./CommunityListPage.scss";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, CircularProgress, Pagination, FormControl, MenuItem, Select } from "@mui/material";
import { Loop } from "@mui/icons-material";
import { Helmet } from "react-helmet-async";
import CommunityList from "../../components/community/CommunityList";
import ServerError from "../../components/common/state/ServerError";
import Empty from "../../components/common/state/Empty";
import { BoardRightContainer } from "../../components/board/BoardRightContainer";
import { postUrl } from "../../apis/apiURLs";
import { CommunityTabBar } from "../../components/board";
import { FixedTopBanner } from "../../components/board/FixedTopBanner";
import { UpButton } from "../../components/common/button/UpButton";
import { MoblieCreateButton } from "../../components/common/button/MoblieCreateButton";

export function CommunityListPage() {
  const [selected, setSelected] = useState("자유");
  const [fixedList, setFixedList] = useState([]);
  const [boardList, setBoardList] = useState([]);
  const [totalCnt, setTotalCnt] = useState(0);
  const [page, setPage] = useState(1);
  const [state, setState] = useState("loading");
  const [toggle, setToggle] = useState(false);
  const [sort, setSort] = useState("post_number desc");
  const nav = useNavigate();
  const [searchParams] = useSearchParams();

  const getFixedList = async () => {
    try {
      const res = await fetch(`${postUrl}?isFixed=고정`); // 카테고리별로 나눠서 고정할지?
      const data = await res.json();
      setFixedList(data.posts);
    } catch (e) {
      console.error(e);
    }
  };

  const getPage = async () => {
    setState("loading");
    try {
      const [by, order] = sort.split(" ");
      const res = await fetch(`${postUrl}?category=${selected}&page=${page}&limit=10&sortBy=${by}&sortOrder=${order}`);
      const data = await res.json();
      console.log(res, data);

      if (res.ok) {
        setBoardList(data.posts);
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

  const handleClick = () => {
    setToggle(true);
    setTimeout(() => setToggle(false), 500);
    getPage();
  };

  const handleChange = (e, value) => {
    setPage(value);
    nav(`?page=${value}`);
  };

  const handleFormBtn = () => {
    nav("/community/write");
  };

  useEffect(() => {
    getPage();
    window.scrollTo({ top: 0 });
  }, [page]);

  useEffect(() => {
    getFixedList();
    setPage(Number(searchParams.get("page")) || 1);
  }, [searchParams]);

  useEffect(() => {
    getPage();
  }, [sort, selected]);

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
        <CommunityTabBar selected={selected} setSelected={setSelected} />
        <div className="Community-container">
          <div className="Community-left-container">
            <div className="header flex-box">
              <div className="left">
                <span>전체게시글&nbsp;</span>
                <span className="point">{totalCnt.toLocaleString("ko-KR")}</span>
                <span>개</span>
                <Loop onClick={handleClick} color="secondary" className={`refresh pointer ${toggle && "start"}`} />
              </div>
              <div className="buttons">
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                  <Select value={sort} onChange={(e) => setSort(e.target.value)} displayEmpty>
                    <MenuItem value="post_number desc">최신순</MenuItem>
                    <MenuItem value="likes desc">추천순</MenuItem>
                    <MenuItem value="views desc">조회순</MenuItem>
                    <MenuItem value="post_number asc">오래된순</MenuItem>
                  </Select>
                </FormControl>
                <Button className="create-button" onClick={handleFormBtn} variant="contained" size="small" color="secondary" disableElevation>
                  작성하기
                </Button>
              </div>
            </div>
            <div className="main">
              {state === "loading" ? (
                <div className="state">
                  <CircularProgress color="secondary" className="progress" />
                </div>
              ) : state === "hasError" ? (
                <div className="state">
                  <ServerError onClickBtn={() => getPage()} />
                </div>
              ) : boardList.length ? (
                <>
                  {page === 1 && <CommunityList boardList={fixedList} isFixed={true} />}
                  <CommunityList boardList={boardList} />
                  <div className="pagination">
                    <Pagination page={page} onChange={handleChange} count={Math.ceil(totalCnt / 10)} color="secondary" siblingCount={2} />
                  </div>
                  <UpButton />
                  <MoblieCreateButton onClick={handleFormBtn} />
                </>
              ) : (
                <div className="state">
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
