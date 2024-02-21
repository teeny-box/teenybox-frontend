import React, { useState, useEffect } from "react";
import "./AdminUser.scss";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import TimeFormat from "../common/time/TimeFormat";
import { AlertCustom } from "../common/alert/Alerts";
import { Backdrop } from "@mui/material";
import { userUrl } from "../../apis/apiURLs";

// DataGrid table의 column구성
const columns = [
  { field: "_id", headerName: "회원 번호", width: 128 },
  { field: "nickname", headerName: "닉네임", width: 128 },
  { field: "social_provider", headerName: "가입 경로", width: 128 },
  { field: "role", headerName: "회원 등급", width: 128 },
  { field: "state", headerName: "회원 상태", width: 128 },
  {
    field: "createdAt",
    headerName: "가입 시기",
    width: 100,
    renderCell: (data) => <TimeFormat time={data.row.createdAt} />,
  },
];

const AdminUser = () => {
  // table에서 선택된 user
  const [users, setUsers] = useState([]);
  // 삭제 확인 alert
  const [openAlert, setOpenAlert] = useState(false);
  // 삭제 완료 alert
  const [openAlert2, setOpenAlert2] = useState(false);

  // fetch API 유저 조회
  const fetchData = () => {
    fetch(`${userUrl}/admin/users`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.users) {
          setUsers(data.users);
        } else {
          console.error("No user data found");
        }
      })
      .catch((err) => console.error(err));
  };

  // 페이지가 로드될 때 유저 정보 가져옴
  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = () => {
    // 선택된 사용자의 ID 목록
    const selectedUserIds = users
      .filter((user) => user.selected)
      .map((user) => user._id);

    // DELETE 요청 보내기
    fetch(`${userUrl}/admin/users`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userIds: selectedUserIds }),
    })
      .then((res) => res.json())
      .then(() => {
        fetchData(); // 선택한 회원 DELETE 후 유저정보 최신화
        setOpenAlert2(true);
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <div className="admin-board-container">
        <div className="admin-board-header">
          <h1>회원 정보</h1>
          <Button
            variant="contained"
            color="moreDarkGray"
            sx={{ width: "80px", height: "40px", color: "white" }}
            onClick={() => {
              const hasSelectedUsers = users.some((user) => user.selected);
              if (hasSelectedUsers) setOpenAlert(true);
            }}
          >
            <h4>탈퇴</h4>
          </Button>
        </div>
        <div style={{ height: "631px", width: "800px" }}>
          <DataGrid
            rows={users}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            checkboxSelection
            getRowId={(users) => users._id}
            onRowSelectionModelChange={(selectionModel) => {
              const updatedUsers = users.map((user) => ({
                ...user,
                selected: selectionModel.includes(user._id),
              }));
              setUsers(updatedUsers);
            }}
          />
        </div>
      </div>
      <Backdrop
        open={openAlert}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
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
