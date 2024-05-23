import "./PromotionListPage.scss";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom/dist";
import { useInView } from "react-intersection-observer";
import { Button, CircularProgress, FormControl, MenuItem, Select } from "@mui/material";
import { Helmet } from "react-helmet-async";
import PromotionList from "../../components/promotion/PromotionList";
import { UpButton } from "../../components/common/button/UpButton";
import ServerError from "../../components/common/state/ServerError";
import Empty from "../../components/common/state/Empty";
import { promotionUrl } from "../../apis/apiURLs";
import { FixedTopBanner } from "../../components/board/FixedTopBanner";
import { PromotionBanner } from "../../components/promotion/PromotionBanner";
import { MoblieCreateButton } from "../../components/common/button/MoblieCreateButton";

export function PromotionListPage() {
  const [boardList, setBoardList] = useState([]);
  const [totalCnt, setTotalCnt] = useState(0);
  const [page, setPage] = useState(1);
  const [state, setState] = useState("loading");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("promotion_number desc");

  const [fixedList, setFixedList] = useState([]);

  const [scrollRef, inView] = useInView();
  const nav = useNavigate();

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

  const getPage = async (curPage, method) => {
    setState("loading");

    const [by, order] = sort.split(" ");
    try {
      const res = await fetch(`${promotionUrl}?page=${curPage || page}&limit=20&sortBy=${by}&sortOrder=${order}&category=${category}`);
      const data = await res.json();

      if (res.ok) {
        if (method === "add") {
          addBoardList(data.promotions);
        } else {
          setBoardList(data.promotions);
        }
        setPage(curPage + 1);
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
  };

  const handleFormBtn = () => {
    nav("/promotion/write");
  };

  useEffect(() => {
    if (inView) {
      // 총 개수 받아서 page 넘어가면 api 호출 X
      if (boardList.length >= totalCnt) return;
      getPage(page, "add");
    }
  }, [inView]);

  useEffect(() => {
    getPage(1);
  }, [sort, category]);

  useEffect(() => {
    getFixedList();
  }, []);

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
            <div id="" className={category === "" ? "selected" : ""} onClick={handleClickDivision}>
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
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <Select value={sort} onChange={(e) => setSort(e.target.value)} displayEmpty>
                <MenuItem value="promotion_number desc">최신순</MenuItem>
                <MenuItem value="likes desc">추천순</MenuItem>
                <MenuItem value="views desc">조회순</MenuItem>
                <MenuItem value="promotion_number asc">오래된순</MenuItem>
              </Select>
            </FormControl>
            <Button className="create-button" onClick={handleFormBtn} variant="contained" size="small" color="secondary" disableElevation>
              글쓰기
            </Button>
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
