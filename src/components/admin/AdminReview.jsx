import React, { useContext, useState, useEffect } from "react";
import "./AdminReview.scss";
import Button from "@mui/material/Button";
import { Checkbox, Backdrop, CircularProgress, Pagination, FormControl, MenuItem, Select } from "@mui/material";
import { AlertCustom } from "../common/alert/Alerts";
import { reviewUrl } from "../../apis/apiURLs";
import ServerError from "../common/state/ServerError";
import Empty from "../common/state/Empty";
import TimeFormat from "../common/time/TimeFormat";
import { AlertContext } from "../../App";

const AdminReview = () => {
  // table에서 선택된 review 관리
  const [reviews, setReviews] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  // 삭제 확인 alert
  const [openAlert, setOpenAlert] = useState(false);
  // 삭제 완료 alert
  const [openAlert2, setOpenAlert2] = useState(false);
  const [checkedList, setCheckedList] = useState([]);
  const [allChecked, setAllChecked] = useState(false);
  const [state, setState] = useState("loading");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [sort, setSort] = useState("최신순");
  const { setOpenFetchErrorAlert } = useContext(AlertContext);

  const handleChangePage = (e, value) => {
    setPage(value);
  };

  const getReviews = async () => {
    setState("loading");

    const order = sort === "최신순" ? "recent" : "outdated";

    try {
      const res = await fetch(`${reviewUrl}?page=${page}&limit=10&order=${order}`, {
        credentials: "include",
      });
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
      const res = await fetch(`${reviewUrl}`, {
        credentials: "include",
      });
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reviewIds: checkedList,
        }),
      });

      if (res.ok) {
        const newReviews = reviews.filter((review) => !checkedList.includes(review._id));
        setReviews(newReviews);
        setCheckedList([]);
        getReviews();
        setOpenAlert2(true);
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

  useEffect(() => {
    getReviews();
  }, [page, sort]);

  useEffect(() => {
    getReviews();
    getAllReviews();
  }, []);

  return (
    <>
      <div className="admin-board-container">
        <div className="header">
          <h1>공연 후기</h1>
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
                <div className="table-header-box" style={{ width: "24%" }}>
                  <p>후기 제목</p>
                </div>
                <div className="table-header-box" style={{ width: "24%" }}>
                  <p>작성자</p>
                </div>
                <div className="table-header-box" style={{ width: "20%" }}>
                  <p>작성 시기</p>
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
                    <div className="table-item">
                      <div className="item-box" style={{ width: "10%" }}>
                        {(page - 1) * 10 + index + 1}
                      </div>
                      <div className="item-box" style={{ width: "24%" }}>
                        <p>{review.title}</p>
                      </div>
                      <div className="item-box" style={{ width: "24%" }}>
                        <p>{review.user_nickname}</p>
                      </div>
                      <div className="item-box" style={{ width: "20%" }}>
                        <TimeFormat time={review.created_at} />
                      </div>
                      <div className="item-box" style={{ width: "22%" }}>
                        <Checkbox
                          value={review._id}
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
            </div>
          ) : (
            <Empty />
          )}
        </div>
        <div className="footer">
          <div className="footer-info-box">
            <p className="footer-info1">관리자 권한</p>
            <p className="footer-info2">*후기를 선택한 후 버튼을 클릭하세요.</p>
          </div>
          {!reviews.length || (
            <Button
              onClick={() => setOpenAlert(true)}
              disabled={!checkedList.length}
              variant="contained"
              color="secondary"
              sx={{ width: "160px", height: "36px", color: "white" }}
            >
              관리자 권한으로 삭제
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
          width={500}
          content={<p>선택하신 후기를 정말로 삭제시키시겠습니까?</p>}
        />
      </Backdrop>
      <AlertCustom
        severity="success"
        open={openAlert2}
        onclose={() => setOpenAlert2(false)}
        title={"완료"}
        width={500}
        content={<p>선택하신 후기가 정상적으로 삭제되었습니다.</p>}
        time={1000}
      />
    </>
  );
};

export default AdminReview;
