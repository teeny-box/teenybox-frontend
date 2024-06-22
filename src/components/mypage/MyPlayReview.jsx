import Button from "@mui/material/Button";
import "./MyPlayReview.scss";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Checkbox, Backdrop, CircularProgress, Pagination, FormControl, MenuItem, Select } from "@mui/material";
import { reviewUrl, userUrl } from "../../apis/apiURLs";
import ServerError from "../common/state/ServerError";
import Empty from "../common/state/Empty";
import TimeFormat from "../common/time/TimeFormat";
import { AlertCustom } from "../common/alert/Alerts";
import { AlertContext } from "../../App";

function MyPlayReview({ user, setUserData }) {
  const [reviews, setReviews] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [checkedList, setCheckedList] = useState([]);
  const [allChecked, setAllChecked] = useState(false);
  const [state, setState] = useState("loading");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [openAlert, setOpenAlert] = useState(false);
  const [sort, setSort] = useState("최신순");
  const [expandedId, setExpandedId] = useState(null);
  const nav = useNavigate();
  const { setOpenFetchErrorAlert } = useContext(AlertContext);

  const handleChangePage = (e, value) => {
    setPage(value);
  };

  const getReviews = async () => {
    setState("loading");

    const order = sort === "최신순" ? "recent" : "outdated";

    try {
      const res = await fetch(`${reviewUrl}?userId=${user.user_id}&page=${page}&limit=10&order=${order}`);
      const data = await res.json();

      if (res.ok) {
        setReviews(data.data);
        setTotalCount(data.total);
        setState("hasValue");
      } else {
        setState("hasError");
        console.error(data);
      }
    } catch (err) {
      setState("hasError");
    }
  };

  const getAllReviews = async () => {
    try {
      const res = await fetch(`${reviewUrl}?userId=${user.user_id}`);
      const data = await res.json();

      if (res.ok) {
        setAllReviews(data.data);
      } else {
        console.error(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${reviewUrl}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewIds: checkedList,
        }),
      });

      if (res.ok) {
        const newReviews = reviews.filter((review) => !checkedList.includes(review.id));
        setReviews(newReviews);
        setCheckedList([]);
        getReviews();
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
      setCheckedList(allReviews.map((review) => review._id));
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
    getReviews();
  }, [page, sort]);

  useEffect(() => {
    getReviews();
    getAllReviews();
  }, []);



  return (
    <>
      <div className="my-play-review-container">
        <div className="header">
          <h1>MY 연극 리뷰</h1>
          <div className="header-item-box">
            <FormControl color="silver" sx={{ m: 1, minWidth: 120 }}>
              <Select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
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
            {!reviews.length || (
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
            <ServerError onClickBtn={() => getReviews()} />
          ) : reviews.length ? (
            <div className="my-table">
              <div className="table-header">
                <div className="table-header-box" style={{ width: "10%" }}>
                  <p>번호</p>
                </div>
                <div className="table-header-box" style={{ width: "48%" }}>
                  <p>연극제목</p>
                </div>
                <div className="table-header-box" style={{ width: "20%" }}>
                  <p>작성일</p>
                </div>
                <div className="table-header-box" style={{ width: "22%" }}>
                  <p>전체선택</p>
                  <Checkbox
                    checked={allChecked}
                    sx={{
                      "& .MuiSvgIcon-root": {
                        color: "#FFB400",
                      },
                    }}
                    onChange={handleAllCheck}
                  />
                </div>
              </div>
              <div className="table-body">
                {reviews.map((review, index) => (
                  <div key={review._id}>
                    <div
                      className="table-item"
                      style={{ backgroundColor: expandedId === review._id ? "rgba(255, 180, 0, 0.1)" : null }}
                      onClick={(e) => toggleExpand(e, review._id)}
                    >
                      <div className="item-box" style={{ width: "10%" }}>
                        {(page - 1) * 10 + index + 1}
                      </div>
                      <div className="item-box" style={{ width: "48%" }}>
                        <p>{review.show_title}</p>
                      </div>
                      <div className="item-box" style={{ width: "20%" }}>
                        <TimeFormat time={review.created_at} />
                      </div>
                      <div className="item-box" style={{ width: "22%" }}>
                        <Checkbox
                          value={review._id}
                          checked={checkedList.includes(review._id)}
                          sx={{
                            "& .MuiSvgIcon-root": {
                              color: "#FFB400",
                            },
                          }}
                          onChange={handleChangeChecked}
                        />
                      </div>
                    </div>
                    {expandedId === review._id && (
                      <div className="expanded-content">
                        <div className="expanded-content-box">
                          <h6>{review.title}</h6>
                          <p>{review.content}</p>
                          <div className="img-box">
                            {review.image_urls.map((url, idx) => (
                              <img key={idx} src={url} alt={`review-${idx}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <Empty />
          )}
        </div>
        <div className="footer">
          {!reviews.length || (
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

export default MyPlayReview;
