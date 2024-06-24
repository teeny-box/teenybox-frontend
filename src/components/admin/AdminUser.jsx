import React, { useContext, useState, useEffect } from "react";
import "./AdminUser.scss";
import Button from "@mui/material/Button";
import { Checkbox, Backdrop, CircularProgress, Pagination, FormControl, MenuItem, Select } from "@mui/material";
import { AlertCustom } from "../common/alert/Alerts";
import { userUrl } from "../../apis/apiURLs";
import ServerError from "../common/state/ServerError";
import Empty from "../common/state/Empty";
import TimeFormat from "../common/time/TimeFormat";
import { AlertContext } from "../../App";

const AdminUser = () => {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [openAlert, setOpenAlert] = useState(false);
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

  const getUsers = async () => {
    setState("loading");

    const order = sort === "최신순" ? "asc" : "desc";

    try {
      const res = await fetch(`${userUrl}/admin/users?page=${page}&limit=10&order=${order}`, {
        credentials: "include",
      });
      const data = await res.json();

      if (res.ok) {
        setUsers(data.users);
        setTotalCount(data.totalUsers);
        setState("hasValue");
      } else {
        setState("hasError");
        console.error(data);
      }
    } catch (err) {
      setState("hasError");
    }
  };

  const getAllUsers = async () => {
    try {
      const res = await fetch(`${userUrl}/admin/users`, {
        credentials: "include",
      });
      const data = await res.json();

      if (res.ok) {
        setAllUsers(data.users);
      } else {
        console.error(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${userUrl}/admin/users`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userIds: checkedList,
        }),
      });

      if (res.ok) {
        const newUsers = users.filter((user) => !checkedList.includes(user._id));
        setUsers(newUsers);
        setCheckedList([]);
        getUsers();
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
      setCheckedList(allUsers.map((user) => user._id));
    } else {
      setCheckedList([]);
    }
  };

  useEffect(() => {
    getUsers();
  }, [page, sort]);

  useEffect(() => {
    getUsers();
    getAllUsers();
  }, []);

  const renderUserRole = (user) => {
    if (user.state === "가입") {
      return user.role === "admin" ? "관리자" : "일반회원";
    }
    if (user.state === "탈퇴") {
      return "탈퇴회원";
    }
    return "알 수 없음";
  };

  return (
    <>
      <div className="admin-board-container">
        <div className="header">
          <h1>회원 정보</h1>
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
            <ServerError onClickBtn={() => getUsers()} />
          ) : users.length ? (
            <div className="my-table">
              <div className="table-header">
                <div className="table-header-box" style={{ width: "10%" }}>
                  <p>번호</p>
                </div>
                <div className="table-header-box" style={{ width: "24%" }}>
                  <p>닉네임</p>
                </div>
                <div className="table-header-box" style={{ width: "24%" }}>
                  <p>현재상태</p>
                </div>
                <div className="table-header-box" style={{ width: "20%" }}>
                  <p>가입일</p>
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
                {users.map((user, index) => (
                  <div key={user._id}>
                    <div className="table-item">
                      <div className="item-box" style={{ width: "10%" }}>
                        {(page - 1) * 10 + index + 1}
                      </div>
                      <div className="item-box" style={{ width: "24%" }}>
                        <p>{user.nickname}</p>
                      </div>
                      <div className="item-box" style={{ width: "24%" }}>
                        <p>{renderUserRole(user)}</p>
                      </div>
                      <div className="item-box" style={{ width: "20%" }}>
                        <TimeFormat time={user.createdAt} />
                      </div>
                      <div className="item-box" style={{ width: "22%" }}>
                        <Checkbox
                          value={user._id}
                          checked={checkedList.includes(user._id)}
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
          {!users.length || (
            <Button
              onClick={() => setOpenAlert(true)}
              disabled={!checkedList.length}
              variant="contained"
              color="secondary"
              sx={{ width: "160px", height: "36px", color: "white" }}
            >
              관리자 권한으로 탈퇴
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
          content={<p>선택하신 회원을 정말로 탈퇴시키시겠습니까?</p>}
        />
      </Backdrop>
      <AlertCustom
        severity="success"
        open={openAlert2}
        onclose={() => setOpenAlert2(false)}
        title={"완료"}
        width={500}
        content={<p>선택하신 회원이 정상적으로 탈퇴 처리되었습니다.</p>}
        time={1000}
      />
    </>
  );
};

export default AdminUser;
