/* 마이페이지 - 찜한 연극 LIST */
import React, { useContext, useEffect, useState } from "react";
import "./MyPickList.scss";
import Button from "@mui/material/Button";
import { Checkbox, CircularProgress, Pagination, Tooltip, Typography, Backdrop } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { userUrl } from "../../apis/apiURLs";
import ServerError from "../common/state/ServerError";
import Empty from "../common/state/Empty";
import TimeFormat from "../common/time/TimeFormat";
import { AlertCustom } from "../common/alert/Alerts";
import { AlertContext } from "../../App";

function MyPickList({ setUserData }) {
  const [bookmarks, setBookmarks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [checkedList, setCheckedList] = useState([]);
  const [allList, setAllList] = useState([]);
  const [renderState, setRenderState] = useState("loading");
  const [openAlert, setOpenAlert] = useState(false);
  const nav = useNavigate();
  const { setOpenFetchErrorAlert } = useContext(AlertContext);
  

  const getBookmarks = async () => {
    setRenderState("loading");
    try {
      const res = await fetch(`${userUrl}/bookmarks?page=${page}&limit=6`, { credentials: "include" });
      const data = await res.json();

      if (res.ok) {
        setAllList(data.bookmarks.validShows.map((show) => show.showId));
        setBookmarks(data.bookmarks.validShows);
        setTotalCount(data.bookmarks.totalCount);
        setRenderState("hasValue");
      } else {
        setRenderState("hasError");
        console.error(data);
      }
    } catch (err) {
      setRenderState("hasError");
    }
  };

  const handleChangePage = (e, value) => {
    setPage(value);
  };

  const handleChangeChecked = (e) => {
    if (e.target.checked) {
      setCheckedList((cur) => [...cur, e.target.value]);
    } else {
      setCheckedList((cur) => cur.filter((id) => id !== e.target.value));
    }
  };

  const handleClickDeleteBtn = async () => {
    try {
      const res = await fetch(`${userUrl}/bookmarks`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          showIds: checkedList,
        }),
      });

      if (res.ok) {
        if (bookmarks.length <= checkedList.length) {
          setPage(page - 1);
        }
        setCheckedList([]);
        getBookmarks();
      } else if (res.status === 401 || res.status === 403) {
        const loginRes = await fetch(`${userUrl}`, { credentials: "include" });
        if (loginRes.ok) {
          const data = await loginRes.json();
          setUserData({ isLoggedIn: true, user: data.user });
          handleClickDeleteBtn();
        } else {
          setUserData({ isLoggedIn: false });
          nav(`/signup-in`);
        }
      } else {
        const data = await res.json();
        console.error(data);
      }
    } catch (e) {
      setOpenFetchErrorAlert(true);
    }
  };

  const handleDeleteAll = async () => {
    try {
      const res = await fetch(`${userUrl}/bookmarks`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          showIds: allList,
        }),
      });

      if (res.ok) {
        getBookmarks();
      } else if (res.status === 401 || res.status === 403) {
        const loginRes = await fetch(`${userUrl}`, { credentials: "include" });
        if (loginRes.ok) {
          const data = await loginRes.json();
          setUserData({ isLoggedIn: true, user: data.user });
          handleDeleteAll();
        } else {
          setUserData({ isLoggedIn: false });
          nav(`/signup-in`);
        }
      } else {
        const data = await res.json();
        console.error(data);
      }
    } catch (e) {
      setOpenFetchErrorAlert(true);
    }
  };

  const renderComponent = (mainComponent) => {
    switch (renderState) {
      case "loading":
        return (
          <div className="content-container loading">
            <CircularProgress />
          </div>
        );
      case "hasValue":
        return mainComponent;
      case "hasError":
        return <ServerError onClickBtn={() => getBookmarks()} />;
      default:
        return mainComponent;
    }
  };

  useEffect(() => {
    getBookmarks();
    setCheckedList([]);
  }, [page]);

  useEffect(() => {
    getBookmarks();
    console.log(bookmarks);
    console.log(checkedList);
  }, []);

  return (
    <>
      <div className="my-pick-list-container">
        <div className="header">
          <h1>찜한 연극 LIST</h1>
          <div className="btn-box">
            {!bookmarks.length || (
              <Button onClick={() => setOpenAlert(true)} variant="contained" color="secondary" sx={{ width: "100px", height: "36px", color: "white" }}>
                전체삭제
              </Button>
            )}
            {!bookmarks.length || (
              <Button
                disabled={!checkedList.length}
                onClick={handleClickDeleteBtn}
                variant="contained"
                color="orange"
                sx={{ width: "100px", height: "36px", color: "white" }}
              >
                선택삭제
              </Button>
            )}
          </div>
        </div>
        <div className="body">
          {renderComponent(
            <>
              {bookmarks.length ? (
                <>
                  <div className="content-container">
                    {bookmarks.map(({ showId, title, poster, location, startDate, endDate, state }) => (
                      <div className="content" key={showId}>
                        <Checkbox value={showId} checked={checkedList.includes(showId)} onChange={handleChangeChecked} />
                        <div className="play-img-container">
                          <Link to={`/play/${showId}`}>
                            <img src={poster} />
                          </Link>
                        </div>
                        <div className="play-info">
                          <Link className="title" to={`/play/${showId}`}>
                            <h3>{title}</h3>
                          </Link>
                          <p className="place">{location || "극장 정보"}</p>
                          <p>
                            {startDate && <TimeFormat time={startDate} />}
                            {" ~ "}
                            {endDate && <TimeFormat time={endDate} />}
                          </p>
                          <div className="reservation-btn">
                            {(state || "") !== "공연완료" ? (
                              <a
                                href={`https://tickets.interpark.com/contents/search?keyword=${title}&start=0&rows=20`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Button variant="contained" color="secondary" size="small">
                                  <Typography fontFamily="Nanum Gothic, sans-serif">예매하러 가기</Typography>
                                </Button>
                              </a>
                            ) : (
                              <Tooltip title="본 연극은 종료되어 예매 링크가 제공되지 않습니다." arrow>
                                <div className="reservation-disabled">
                                  <Button variant="contained" disabled size="small">
                                    <Typography fontFamily="Nanum Gothic, sans-serif" className="button-text">
                                      예매하러 가기
                                    </Typography>
                                  </Button>
                                </div>
                              </Tooltip>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pagination">
                    <Pagination count={Math.ceil(totalCount / 6)} page={page} onChange={handleChangePage} />
                  </div>
                </>
              ) : (
                <div className="empty-box">
                  <Empty />
                </div>
              )}
            </>,
          )}
        </div>
      </div>
      <Backdrop open={openAlert} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <AlertCustom
          severity="error"
          open={openAlert}
          onclose={() => setOpenAlert(false)}
          onclick={() => handleDeleteAll()}
          checkBtn={"확인"}
          closeBtn={"취소"}
          checkBtnColor={"#fa2828"}
          title={"teenybox.com 내용:"}
          content={"정말 전체 삭제하시겠습니까?"}
        />
      </Backdrop>
    </>
  );
}

export default MyPickList;
