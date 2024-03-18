import React, { useState, useEffect } from "react";
import "./AdminPRComments.scss";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import TimeFormat from "../common/time/TimeFormat";
import { AlertCustom } from "../common/alert/Alerts";
import { Backdrop } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { commentUrl } from "../../apis/apiURLs";

// DataGrid table의 column구성
const columns = [
  { field: "content", headerName: "내용", width: 200 },
  { field: "nickname", headerName: "작성자", width: 200 },
  { field: "promotion_number", headerName: "해당 글 번호", width: 170 },
  {
    field: "createdAt",
    headerName: "작성 시기",
    width: 200,
    renderCell: (data) => <TimeFormat time={data.row.createdAt} type={"time"}/>,
  },
];

const AdminPRComments = () => {
  // table에서 선택된 홍보 댓글 관리
  const [comments, setComments] = useState([]);
  // 삭제 확인 alert
  const [openAlert, setOpenAlert] = useState(false);
  // 삭제 완료 alert
  const [openAlert2, setOpenAlert2] = useState(false);
  // 테이블 행 클릭시 해당 상세페이지로 이동
  const navigate = useNavigate();

  // fetch API 홍보 댓글 조회
  const fetchData = () => {
    fetch(`${commentUrl}/admins/promotions`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.comments) && data.comments.length > 0) {
          const commentsWithIds = data.comments.map((comment) => ({
            ...comment,
            nickname: comment.user.nickname,
            promotion_number: comment.promotion.promotion_number
          }));
          setComments(commentsWithIds);
        } else {
          console.error("Data is not an array or empty");
        }
      })
      .catch((err) => console.error(err));
  };

  // 페이지가 로드될 때 댓글 정보 가져옴
  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = () => {
    // 선택된 게시글의 ID 목록
    const selectedComments = comments
      .filter((comment) => comment.selected)
      .map((comment) => comment._id);

    // DELETE 요청 보내기
    fetch(`${commentUrl}/admins/comments`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ commentIds: selectedComments }),
    })
      .then((res) => res.json())
      .then(() => {
        fetchData(); // 삭제 후 데이터 다시 불러오기
        setOpenAlert2(true);
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <div className="admin-board-container">
        <div className="admin-board-header">
          <h1>홍보 게시판 댓글</h1>
          <Button
            variant="contained"
            color="moreDarkGray"
            sx={{ width: "80px", height: "40px", color: "white" }}
            onClick={() => {
              const hasSelectedComments = comments.some(
                (comment) => comment.selected
              );
              if (hasSelectedComments) setOpenAlert(true);
            }}
          >
            <h4>삭제</h4>
          </Button>
        </div>
        <div style={{ height: "631px", width: "800px" }}>
          <DataGrid
            // 해당 상세페이지로 이동
            onRowClick={(params) => {
              const promotionNumber = params.row.promotion.promotion_number;
              navigate(`/promotion/${promotionNumber}`);
            }}
            rows={comments}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            checkboxSelection
            getRowId={(comments) => comments._id}
            onRowSelectionModelChange={(newSelection) => {
              const updatedComments = comments.map((comment) => ({
                ...comment,
                selected: newSelection.includes(comment._id),
              }));
              setComments(updatedComments);
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
          content={<p>선택하신 댓글을 정말로 삭제시키시겠습니까?</p>}
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

export default AdminPRComments;
