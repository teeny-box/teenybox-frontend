import React, { useContext, useEffect, useState } from "react";
import "./MyPickList.scss";
import Button from "@mui/material/Button";
import { Checkbox, CircularProgress, Pagination, Tooltip, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { userUrl } from "../../apis/apiURLs";
import ServerError from "../common/state/ServerError";
import Empty from "../common/state/Empty";
import TimeFormat from "../common/time/TimeFormat";
import { AlertContext } from "../../App";

function MyPickList({ setUserData }) {
  const [bookmarks, setBookmarks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [checkedList, setCheckedList] = useState([]);
  const [renderState, setRenderState] = useState("loading");
  const [allChecked, setAllChecked] = useState(false);
  const nav = useNavigate();
  const { setOpenFetchErrorAlert } = useContext(AlertContext);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);

  useEffect(() => {
    const resizeListener = () => {
      setInnerWidth(window.innerWidth);
    };
    window.addEventListener("resize", resizeListener);
    return () => window.removeEventListener("resize", resizeListener);
  }, []);

  const getBookmarks = async () => {
    setRenderState("loading");
    try {
      const res = await fetch(`${userUrl}/bookmarks?page=${page}&limit=4`, { credentials: "include" });
      const data = await res.json();

      if (res.ok) {
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
    const showId = e.target.value;
    if (e.target.checked) {
      setCheckedList((cur) => [...cur, showId]);
    } else {
      setCheckedList((cur) => cur.filter((id) => id !== showId));
    }
  };

  const handleChangeCheckedAll = async () => {
    if (allChecked) {
      setCheckedList([]);
      setAllChecked(false);
    } else {
      try {
        const res = await fetch(`${userUrl}/bookmarks?page=1&limit=10000`, { credentials: "include" });
        const data = await res.json();

        if (res.ok) {
          setCheckedList(data.bookmarks.validShows.map((show) => show.showId));
          setAllChecked(true);
        } else {
          setRenderState("hasError");
          console.error(data);
        }
      } catch (err) {
        setRenderState("hasError");
      }
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
        setAllChecked(false);
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
  }, [page]);

  useEffect(() => {
    getBookmarks();
  }, []);

  return (
    <>
      {innerWidth > 768 ? (
        <div className="my-pick-list-container">
          <div className="header">
            <h1>내가 찜한 연극</h1>
            <div className="btn-box">
              {!bookmarks.length || (
                <button onClick={() => handleChangeCheckedAll()} className="all-dlt-btn">
                  전체선택
                </button>
              )}
              {!bookmarks.length || (
                <Button
                  disabled={!checkedList.length}
                  onClick={handleClickDeleteBtn}
                  variant="contained"
                  color="secondary"
                  sx={{ width: "100px", height: "36px", color: "white", boxShadow: "none" }}
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
                      {bookmarks.map(({ showId, title, poster, location, startDate, endDate, state }, index) => (
                        <div className="content" key={showId} style={{ backgroundColor: index % 2 === 0 ? "rgba(255, 180, 0, 0.05)" : "transparent" }}>
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
                                  <Button variant="contained" color="secondary" size="small" sx={{ boxShadow: "none" }}>
                                    <Typography fontFamily="Nanum Gothic, sans-serif">예매하러 가기</Typography>
                                  </Button>
                                </a>
                              ) : (
                                <Tooltip title="본 연극은 종료되어 예매 링크가 제공되지 않습니다." arrow>
                                  <div className="reservation-disabled">
                                    <Button variant="contained" disabled size="small" sx={{ boxShadow: "none" }}>
                                      <Typography fontFamily="Nanum Gothic, sans-serif" className="button-text">
                                        예매하러 가기
                                      </Typography>
                                    </Button>
                                  </div>
                                </Tooltip>
                              )}
                            </div>
                          </div>
                          <div className="checkbox-area">
                            <Checkbox
                              value={showId}
                              checked={checkedList.includes(showId)}
                              sx={{
                                "& .MuiSvgIcon-root": {
                                  color: "#FFB400",
                                },
                              }}
                              onChange={handleChangeChecked}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="footer">
                      <div className="btn-box">
                        {!bookmarks.length || (
                          <button onClick={() => handleChangeCheckedAll()} className="all-dlt-btn">
                            전체선택
                          </button>
                        )}
                        {!bookmarks.length || (
                          <Button
                            disabled={!checkedList.length}
                            onClick={handleClickDeleteBtn}
                            variant="contained"
                            color="secondary"
                            sx={{ width: "100px", height: "36px", color: "white", boxShadow: "none" }}
                          >
                            선택삭제
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="pagination">
                      <Pagination
                        count={Math.ceil(totalCount / 4)}
                        page={page}
                        onChange={handleChangePage}
                        sx={{
                          "& .MuiPaginationItem-root": {
                            "&.Mui-selected": {
                              backgroundColor: "#ffb400",
                            },
                          },
                        }}
                      />
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
      ) : (
        <div className="my-pick-list-container">
          <div className="header">
            <div className="active-layout3">
              <h1>내가 찜한 연극</h1>
              <div className="btn-box">
                {!bookmarks.length || (
                  <button onClick={() => handleChangeCheckedAll()} className="all-dlt-btn">
                    전체선택
                  </button>
                )}
                {!bookmarks.length || (
                  <Button
                    disabled={!checkedList.length}
                    onClick={handleClickDeleteBtn}
                    variant="contained"
                    color="secondary"
                    sx={{ width: "100px", height: "36px", color: "white", boxShadow: "none" }}
                  >
                    선택삭제
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="body">
            {renderComponent(
              <>
                {bookmarks.length ? (
                  <>
                    <div className="content-container">
                      {bookmarks.map(({ showId, title, poster, location, startDate, endDate, state }, index) => (
                        <div className="content" key={showId} style={{ backgroundColor: index % 2 === 0 ? "rgba(255, 180, 0, 0.05)" : "transparent" }}>
                          <div className="active-layout3">
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
                                    <Button variant="contained" color="secondary" size="small" sx={{ boxShadow: "none" }}>
                                      <Typography fontFamily="Nanum Gothic, sans-serif">예매하러 가기</Typography>
                                    </Button>
                                  </a>
                                ) : (
                                  <Tooltip title="본 연극은 종료되어 예매 링크가 제공되지 않습니다." arrow>
                                    <div className="reservation-disabled">
                                      <Button variant="contained" disabled size="small" sx={{ boxShadow: "none" }}>
                                        <Typography fontFamily="Nanum Gothic, sans-serif" className="button-text">
                                          예매하러 가기
                                        </Typography>
                                      </Button>
                                    </div>
                                  </Tooltip>
                                )}
                              </div>
                            </div>
                            <div className="checkbox-area">
                              <Checkbox
                                value={showId}
                                checked={checkedList.includes(showId)}
                                sx={{
                                  "& .MuiSvgIcon-root": {
                                    color: "#FFB400",
                                  },
                                }}
                                onChange={handleChangeChecked}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="active-layout3">
                      <div className="footer">
                        <div className="btn-box">
                          {!bookmarks.length || (
                            <button onClick={() => handleChangeCheckedAll()} className="all-dlt-btn">
                              전체선택
                            </button>
                          )}
                          {!bookmarks.length || (
                            <Button
                              disabled={!checkedList.length}
                              onClick={handleClickDeleteBtn}
                              variant="contained"
                              color="secondary"
                              sx={{ width: "100px", height: "36px", color: "white", boxShadow: "none" }}
                            >
                              선택삭제
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="pagination">
                      <Pagination count={Math.ceil(totalCount / 4)} page={page} onChange={handleChangePage} />
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
      )}
    </>
  );
}

export default MyPickList;
