import React, { useContext, useState, useEffect } from "react";
import "./AdminCommunityComments.scss";
import Button from "@mui/material/Button";
import { Checkbox, Backdrop, CircularProgress, Pagination, FormControl, MenuItem, Select } from "@mui/material";
import { AlertCustom } from "../common/alert/Alerts";
import { commentUrl } from "../../apis/apiURLs";
import ServerError from "../common/state/ServerError";
import Empty from "../common/state/Empty";
import TimeFormat from "../common/time/TimeFormat";
import { AlertContext } from "../../App";

const AdminCommunityComments = () => {
  // table에서 선택된 커뮤니티 댓글 관리
  const [comments, setComments] = useState([]);
  const [allComments, setAllComments] = useState([]);
  // 삭제 확인 alert
  const [openAlert, setOpenAlert] = useState(false);
  // 삭제 완료 alert
  const [openAlert2, setOpenAlert2] = useState(false);
  // 테이블 행 클릭시 해당 상세페이지로 이동
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

  const getComments = async () => {
    setState("loading");

    const sortBy = "time";
    const sortOrder = sort === "최신순" ? "desc" : "asc";

    try {
      const res = await fetch(`${commentUrl}/admins/posts?page=${page}&limit=10&sortBy=${sortBy}&sortOrder=${sortOrder}`, {
        credentials: "include",
      });
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
      const res = await fetch(`${commentUrl}/admins/posts`, {
        credentials: "include",
      });
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
      const res = await fetch(`${commentUrl}/admins/comments`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentIds: checkedList,
        }),
      });

      if (res.ok) {
        const newComments = comments.filter((comment) => !checkedList.includes(comment._id));
        setComments(newComments);
        setCheckedList([]);
        getComments();
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
      setCheckedList((cur) => cur.filter((comment) => comment !== e.target.value));
    }
  };

  const handleAllCheck = (e) => {
    setAllChecked(e.target.checked);
    if (e.target.checked) {
      setCheckedList(allComments.map((comment) => comment._id));
    } else {
      setCheckedList([]);
    }
  };

  useEffect(() => {
    getComments();
  }, [page, sort]);

  useEffect(() => {
    getComments();
    getAllComments();
  }, []);

  return (
    <>
      <div className="admin-board-container">
        <div className="header">
          <h1>커뮤니티 댓글</h1>
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
            <ServerError onClickBtn={() => getComments()} />
          ) : comments.length ? (
            <div className="my-table">
              <div className="table-header">
                <div className="table-header-box" style={{ width: "10%" }}>
                  <p>번호</p>
                </div>
                <div className="table-header-box" style={{ width: "24%" }}>
                  <p>댓글</p>
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
                {comments.map((comment, index) => (
                  <div key={comment._id}>
                    <div className="table-item">
                      <div className="item-box" style={{ width: "10%" }}>
                        {(page - 1) * 10 + index + 1}
                      </div>
                      <div className="item-box" style={{ width: "24%" }}>
                        <p>{comment.content}</p>
                      </div>
                      <div className="item-box" style={{ width: "24%" }}>
                        <p>{comment.user.nickname}</p>
                      </div>
                      <div className="item-box" style={{ width: "20%" }}>
                        <TimeFormat time={comment.createdAt} />
                      </div>
                      <div className="item-box" style={{ width: "22%" }}>
                        <Checkbox
                          value={comment._id}
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
            <p className="footer-info2">*회원을 선택한 후 버튼을 클릭하세요.</p>
          </div>
          {!comments.length || (
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
          content={<p>선택하신 게시글을 정말로 삭제시키시겠습니까?</p>}
        />
      </Backdrop>
      <AlertCustom
        severity="success"
        open={openAlert2}
        onclose={() => setOpenAlert2(false)}
        title={"완료"}
        width={500}
        content={<p>선택하신 댓글이 정상적으로 삭제되었습니다.</p>}
        time={1000}
      />
    </>
  );
};

export default AdminCommunityComments;
