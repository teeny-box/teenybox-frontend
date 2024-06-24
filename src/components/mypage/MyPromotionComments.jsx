import { useContext, useEffect, useState } from "react";
import "./MyPromotionComments.scss";
import Button from "@mui/material/Button";
import { Checkbox, Backdrop, CircularProgress, Pagination, FormControl, MenuItem, Select } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { commentUrl, userUrl } from "../../apis/apiURLs";
import ServerError from "../common/state/ServerError";
import Empty from "../common/state/Empty";
import TimeFormat from "../common/time/TimeFormat";
import { AlertCustom } from "../common/alert/Alerts";
import { AlertContext } from "../../App";

function MyPromotionComments({ setUserData }) {
  const [comments, setComments] = useState([]);
  const [allcomments, setAllComments] = useState([]);
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

  const getComments = async () => {
    setState("loading");
    try {
      const res = await fetch(`${commentUrl}/promotions?page=${page}&limit=10`, { credentials: "include" });
      const data = await res.json();

      if (res.ok) {
        setComments(data.comments);
        setTotalCount(data.totalComments);
        setState("hasValue");
      } else {
        setState("hasError");
        console.error(data);
      }
    } catch (err) {
      setState("hasError");
    }
  };

  const getAllComments = async () => {
    try {
      const res = await fetch(`${commentUrl}/promotions`, { credentials: "include" });
      const data = await res.json();

      if (res.ok) {
        setAllComments(data.comments);
      } else {
        console.error(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${commentUrl}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commentIds: checkedList,
        }),
      });

      if (res.ok) {
        const newComments = [...comments];
        checkedList.forEach((id) => {
          const index = newComments.findIndex((comment) => comment.id === id);
          newComments.splice(index, 1);
        });

        setComments(newComments);
      } else if (res.status === 401 || res.status === 403) {
        const loginRes = await fetch(`${userUrl}`, { credentials: "include" });
        if (loginRes.ok) {
          const data = await loginRes.json();
          setUserData({ isLoggedIn: true, user: data.user });
          handleDelete();
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

  const handleChangeChecked = (e) => {
    if (e.target.checked) {
      setCheckedList((cur) => [...cur, e.target.value]);
    } else {
      setCheckedList((cur) => cur.filter((id) => id !== e.target.value));
    }
  };

  const handleAllCheck = (e) => {
    setAllChecked(e.target.checked);
    if (e.target.checked) {
      setCheckedList(allcomments.map((comment) => comment._id));
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
    getComments();
  }, [page, sort, order]);

  useEffect(() => {
    getComments();
    getAllComments();
  }, []);

  return (
    <>
      <div className="my-comments-container">
        <div className="header">
          <h1>MY 댓글</h1>
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
            {!comments.length || (
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
            <ServerError onClickBtn={() => getComments()} />
          ) : comments.length ? (
            <div className="my-table">
              <div className="table-header">
                <div className="table-header-box" style={{ width: "10%" }}>
                  <p>번호</p>
                </div>
                <div className="table-header-box" style={{ width: "48%" }}>
                  <p>해당 홍보 글 제목</p>
                </div>
                <div className="table-header-box" style={{ width: "20%" }}>
                  <p>작성일</p>
                </div>
                <div className="table-header-box" style={{ width: "22%" }}>
                  <p>전체선택</p>
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
                {comments.map((comment, index) => (
                  <div key={comment._id}>
                    <div
                      className="table-item"
                      style={{ backgroundColor: expandedId === comment._id ? "rgba(255, 180, 0, 0.1)" : null }}
                      onClick={(e) => toggleExpand(e, comment._id)}
                    >
                      <div className="item-box" style={{ width: "10%" }}>
                        {(page - 1) * 10 + index + 1}
                      </div>
                      <div className="item-box" style={{ width: "48%" }}>
                        <p>{comment.promotion.title}</p>
                      </div>
                      <div className="item-box" style={{ width: "20%" }}>
                        <TimeFormat time={comment.createdAt} />
                      </div>
                      <div className="item-box" style={{ width: "22%" }}>
                        <Checkbox
                          value={comment._id}
                          checked={checkedList.includes(comment._id)}
                          onChange={handleChangeChecked}
                          sx={{
                            "& .MuiSvgIcon-root": {
                              color: "#FFB400",
                            },
                          }}
                        />
                      </div>
                    </div>
                    {expandedId === comment._id && (
                      <div className="expanded-content">
                        <div className="expanded-content-box">
                          <p>{comment.content}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <Empty>
              <>
                <p>데이터가 없습니다. 연극을 찾아보고 다양한 기록을 남겨보세요</p>
                <Link className="link" to={`/play`}>
                  연극 찾아보기
                </Link>
              </>
            </Empty>
          )}
        </div>
        <div className="footer">
          {!comments.length || (
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

export default MyPromotionComments;
