import React, { Children, useEffect, useState } from "react";
import { BoardListHeader } from "../../components/board";
import "./PRBoardListPage.scss";
import PRBoardList from "../../components/board-pr/PRBoardList";
import { UpButton } from "../../components/common/button/UpButton";
import { useInView } from "react-intersection-observer";
import { promotionUrl } from "../../apis/apiURLs";
import { Button, CircularProgress, FormControl, MenuItem, Select, Skeleton } from "@mui/material";
import ServerError from "../../components/common/state/ServerError";
import Empty from "../../components/common/state/Empty";
import { ArrowBackIosRounded, ArrowForwardIosRounded, SmsOutlined, ThumbUpOutlined, VisibilityOutlined } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom/dist";
import getBestPromotionPlay from "../../utils/getBestPromotionPlay";
import TimeFormat from "../../components/common/time/TimeFormat";
import numberFormat from "../../utils/numberFormat";
import minilogo from "../../assets/img/minilogo.png";

export function PRBoardListPage() {
  const [boardList, setBoardList] = useState([]);
  const [totalCnt, setTotalCnt] = useState(0);
  const [page, setPage] = useState(1);
  const [state, setState] = useState("loading");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("promotion_number desc");

  const [bannerList, setBannerList] = useState([]);
  const [bannerIndex, setBannerIndex] = useState(0);

  const [fixedList, setFixedList] = useState([]);

  const [scrollRef, inView] = useInView();
  const nav = useNavigate();

  const getBannerList = async () => {
    let newList = await getBestPromotionPlay();
    setBannerList(newList.slice(0, 5));
  };

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
    const uniqueList = [...boardList, ...newList].reduce(function (newArr, current) {
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
        method === "add" ? addBoardList(data.promotions) : setBoardList(data.promotions);
        setPage(curPage + 1);
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

  const handleClickLeftArrow = () => {
    if (bannerIndex <= 0) {
      setBannerIndex(bannerList.length);
    } else {
      setBannerIndex((cur) => cur - 1);
    }
  };

  const handleClickRightArrow = () => {
    if (bannerIndex >= bannerList.length) {
      setBannerIndex(0);
    } else {
      setBannerIndex((cur) => cur + 1);
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
    getBannerList();
    getFixedList();
  }, []);

  return (
    <div className="pr-board-page page-margin">
      <BoardListHeader header="홍보게시판" />
      {bannerList.length + fixedList.length ? (
        <div className="best-box ">
          <img
            className={"bg-img" + (bannerIndex ? "" : " small")}
            src={bannerIndex ? bannerList[bannerIndex - 1]?.image_url[0] : "https://i.pinimg.com/564x/6e/b0/9f/6eb09f7b1a6467f17847f99ae732791b.jpg"} // "https://elice-5th.s3.amazonaws.com/promotions%252F1707380134216_teeny-box-icon.png"}
          />
          <div className="bg-mask">
            <div className={`absolute ${bannerIndex === 0 && "visible"}`}>
              <div className={"contents-container"}>
                <div className="left-box">
                  <div className="sub-title">📢 공지사항</div>
                  <h2 className="title">
                    <Link to={`/promotion/${fixedList[fixedList.length - 1].promotion_number}`}>{fixedList[fixedList.length - 1].title}</Link>
                  </h2>
                  <div className="ellipsis">
                    <Link to={`/promotion/${fixedList[fixedList.length - 1].promotion_number}`}>{fixedList[fixedList.length - 1].content}</Link>
                  </div>

                  <div className="content"></div>
                  <div className="footer">
                    <VisibilityOutlined sx={{ fontSize: 20 }} />
                    <span>{numberFormat(fixedList[fixedList.length - 1].views || 0)}</span>
                    <ThumbUpOutlined sx={{ fontSize: 20 }} />
                    <span>{numberFormat(fixedList[fixedList.length - 1].likes || 0)}</span>
                    <SmsOutlined sx={{ fontSize: 20 }} />
                    <span>{numberFormat(fixedList[fixedList.length - 1].commentsCount || 0)}</span>
                  </div>
                </div>
                <Link to={`/promotion/${fixedList[fixedList.length - 1].promotion_number}`}>{/* <img className="poster" src={""} /> */}</Link>
              </div>
            </div>
            {Children.toArray(
              bannerList.map((post, idx) => (
                <div className={`absolute ${bannerIndex === idx + 1 && "visible"}`}>
                  <div className={"contents-container"}>
                    <div className="left-box">
                      <div className="sub-title">인기 소규모 연극</div>
                      <h2 className="title">
                        <Link to={`/promotion/${post.promotion_number}`}>{post.play_title}</Link>
                      </h2>
                      <div className="ellipsis">
                        <Link to={`/promotion/${post.promotion_number}`}>{post.title}</Link>
                      </div>

                      <div className="content">
                        {post.start_date && post.end_date && (
                          <div className="date">
                            <span className="lable">공연기간</span>
                            {post.start_date && <TimeFormat time={post.start_date} />}
                            {" ~ "}
                            {post.end_date && <TimeFormat time={post.end_date} />}
                          </div>
                        )}
                        {post.location && (
                          <div>
                            <span className="lable">장소</span>
                            {post.location}
                          </div>
                        )}
                        {post.host && (
                          <div>
                            <span className="lable">주최</span>
                            {post.host}
                          </div>
                        )}
                        {!post.runtime || (
                          <div>
                            <span className="lable">런타임</span>
                            {post.runtime} 분
                          </div>
                        )}
                      </div>
                      <div className="footer">
                        <VisibilityOutlined sx={{ fontSize: 20 }} />
                        <span>{numberFormat(post.views || 0)}</span>
                        <ThumbUpOutlined sx={{ fontSize: 20 }} />
                        <span>{numberFormat(post.likes || 0)}</span>
                        <SmsOutlined sx={{ fontSize: 20 }} />
                        <span>{numberFormat(post.commentsCount || 0)}</span>
                      </div>
                    </div>
                    <Link to={`/promotion/${post.promotion_number}`}>
                      <img className="poster" src={post.image_url[0] || "https://elice-5th.s3.amazonaws.com/promotions%252F1707380134216_teeny-box-icon.png"} />
                    </Link>
                  </div>
                </div>
              ))
            )}
            {bannerList.length > 1 && (
              <>
                <ArrowBackIosRounded className="arrow-left pointer" onClick={handleClickLeftArrow} />
                <ArrowForwardIosRounded className="arrow-right pointer" onClick={handleClickRightArrow} />
              </>
            )}
          </div>
        </div>
      ) : (
        <Skeleton variant="rectangular" width={1110} height={420} sx={{ borderRadius: "6px", marginBottom: "60px" }} />
      )}
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
          <Button onClick={handleFormBtn} variant="contained" size="small" color="secondary" disableElevation>
            작성하기
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
          <PRBoardList newList={boardList} fixedList={fixedList} />
          {state === "loading" && (
            <div className={`state`}>
              <CircularProgress color="secondary" />
            </div>
          )}
          <UpButton />
          <div className="scroll-ref" ref={scrollRef}></div>
        </>
      ) : (
        <div className={`state box`}>
          <Empty children={<></>} />
        </div>
      )}
    </div>
  );
}
