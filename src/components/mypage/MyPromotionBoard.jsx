import React, { useContext, useEffect, useState } from "react";
import "./MyPromotionBoard.scss";
import Button from "@mui/material/Button";
import { Checkbox, Backdrop, CircularProgress, Pagination, FormControl, MenuItem, Select } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { decodeHTML } from "../../utils/decodeHTML";
import { promotionUrl, userUrl } from "../../apis/apiURLs";
import ServerError from "../common/state/ServerError";
import Empty from "../common/state/Empty";
import TimeFormat from "../common/time/TimeFormat";
import { AlertCustom } from "../common/alert/Alerts";
import { AlertContext } from "../../App";

function MyPromotionBoard({ user, setUserData }) {
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [state, setState] = useState("loading");
  const [checkedList, setCheckedList] = useState([]);
  const [allChecked, setAllChecked] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [openAlert, setOpenAlert] = useState(false);
  const [sort, setSort] = useState("최신순");
  const [order, setOrder] = useState("desc");
  const [expandedId, setExpandedId] = useState(null);
  const nav = useNavigate();
  const { setOpenFetchErrorAlert } = useContext(AlertContext);

  const handleChangePage = (e, value) => {
    setPage(value);
  };

  const getPosts = async () => {
    setState("loading");

    try {
      const res = await fetch(`${promotionUrl}/user/${user._id}?page=${page}&limit=10&sortBy=${"time"}&sortOrder=${order}`);
      const data = await res.json();

      if (res.ok) {
        setPosts(data.promotions);
        setTotalCount(data.totalCount);
        setState("hasValue");
      } else {
        setState("hasError");
        console.error(data);
      }
    } catch (err) {
      setState("hasError");
    }
  };

  const getAllPosts = async () => {
    try {
      const res = await fetch(`${promotionUrl}/user/${user._id}`);
      const data = await res.json();

      if (res.ok) {
        setAllPosts(data.promotions);
      } else {
        console.error(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${promotionUrl}/bulk`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promotionNumbers: checkedList,
        }),
      });

      if (res.ok) {
        getPosts();
        setCheckedList([]);
        setAllChecked(false);
      } else if (res.status === 401 || res.status === 403) {
        const loginRes = await fetch(`${userUrl}`, { credentials: "include" });
        if (loginRes.ok) {
          const data = await loginRes.json();
          setUserData({ isLoggedIn: true, user: data.user });
          handleDelete();
        } else {
          setUserData({ isLoggedIn: false });
          return nav(`/signup-in`);
        }
      }
      return undefined;
    } catch (e) {
      setOpenFetchErrorAlert(true);
      return undefined;
    }
  };

  const handleChangeChecked = (e) => {
    const promotionNumber = Number(e.target.value);

    if (e.target.checked) {
      setCheckedList((cur) => [...cur, promotionNumber]);
    } else {
      setCheckedList((cur) => cur.filter((number) => number !== promotionNumber));
    }
  };

  const handleAllCheck = (e) => {
    setAllChecked(e.target.checked);
    if (e.target.checked) {
      setCheckedList(allPosts.map((post) => post.promotion_number));
    } else {
      setCheckedList([]);
    }
  };

  const toggleExpand = (e, id) => {
    if (e.target.type !== "checkbox") {
      setExpandedId((prev) => (prev === id ? null : id));
    }
  };

  useEffect(() => {
    getPosts();
  }, [page, sort, order]);

  useEffect(() => {
    getPosts();
    getAllPosts();
  }, []);

  return (
    <>
      <div className="my-pr-board-container">
        <div className="header">
          <h1>MY 홍보 게시글</h1>
          <div className="header-item-box">
            <FormControl color="silver" sx={{ m: 1, minWidth: 120 }}>
              <Select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setOrder(e.target.value === "최신순" ? "desc" : "asc");
                }}
                sx={{
                  padding: "0px",
                  "& .MuiSelect-select": {
                    padding: "7.5px 20px",
                  },
                }}
                className="sort"
                displayEmpty
              >
                <MenuItem value="최신순">최신순</MenuItem>
                <MenuItem value="오래된순">오래된순</MenuItem>
              </Select>
            </FormControl>
            {!posts.length || (
              <Button
                onClick={() => setOpenAlert(true)}
                disabled={!checkedList.length}
                variant="contained"
                color="secondary"
                className="header-btn"
                sx={{ width: "100px", height: "36px", color: "white" }}
              >
                선택삭제
              </Button>
            )}
          </div>
        </div>
        <div className="body">
          {state === "loading" ? (
            <CircularProgress className="loading" color="secondary" />
          ) : state === "hasError" ? (
            <ServerError onClickBtn={() => getPosts()} />
          ) : posts.length ? (
            <div className="my-table">
              <div className="table-header">
                <div className="table-header-box" style={{ width: "10%" }}>
                  <p>번호</p>
                </div>
                <div className="table-header-box" style={{ width: "48%" }}>
                  <p>제목</p>
                </div>
                <div className="table-header-box" style={{ width: "20%" }}>
                  <p>작성일</p>
                </div>
                <div className="table-header-box" style={{ width: "22%" }}>
                  <p>전체선택</p>{" "}
                  <Checkbox
                    checked={allChecked}
                    onChange={handleAllCheck}
                    sx={{
                      "& .MuiSvgIcon-root": {
                        color: "#FFB400",
                      },
                    }}
                  />
                </div>
              </div>
              <div className="table-body">
                {posts.map((post, index) => (
                  <div key={post._id}>
                    <div
                      className="table-item"
                      style={{ backgroundColor: expandedId === post._id ? "rgba(255, 180, 0, 0.1)" : null }}
                      onClick={(e) => toggleExpand(e, post._id)}
                    >
                      <div className="item-box" style={{ width: "10%" }}>
                        {(page - 1) * 10 + index + 1}
                      </div>
                      <div className="item-box" style={{ width: "48%" }}>
                        <p>{post.title}</p>
                      </div>
                      <div className="item-box" style={{ width: "20%" }}>
                        <TimeFormat time={post.createdAt} />
                      </div>
                      <div className="item-box" style={{ width: "22%" }}>
                        <Checkbox
                          value={post.promotion_number}
                          checked={checkedList.includes(post.promotion_number)}
                          onChange={handleChangeChecked}
                          sx={{
                            "& .MuiSvgIcon-root": {
                              color: "#FFB400",
                            },
                          }}
                        />
                      </div>
                    </div>
                    {expandedId === post._id && (
                      <div className="expanded-content">
                        <div className="expanded-content-box">
                          <h6>{post.play_title}</h6>
                          <div className="img-box">
                            {post.image_url.map((url, idx) => (
                              <img key={idx} src={url} alt={`post-${idx}`} />
                            ))}
                          </div>
                          <p>{post.location}</p>
                          <p>{`${new Date(post.start_date).toLocaleDateString()} ~ ${new Date(post.end_date).toLocaleDateString()}`}</p>
                          <p>{decodeHTML(post.content)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <Empty onClickBtn={() => nav(`/promotion/write`)} />
          )}
        </div>
        <div className="footer">
          {" "}
          {!posts.length || (
            <Button
              onClick={() => setOpenAlert(true)}
              disabled={!checkedList.length}
              variant="contained"
              color="secondary"
              sx={{ width: "100px", height: "36px", color: "white" }}
            >
              선택삭제
            </Button>
          )}
        </div>
        <div className="pagination">
          <Pagination
            count={Math.ceil(totalCount / 10)}
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
      </div>
      <Backdrop open={openAlert} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <AlertCustom
          severity="error"
          open={openAlert}
          onclose={() => setOpenAlert(false)}
          onclick={() => handleDelete()}
          checkBtn={"확인"}
          closeBtn={"취소"}
          checkBtnColor={"#fa2828"}
          title={"teenybox.com 내용:"}
          content={"정말 삭제하시겠습니까?"}
        />
      </Backdrop>
    </>
  );
}

export default MyPromotionBoard;
