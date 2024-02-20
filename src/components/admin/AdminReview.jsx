import React, { useState, useEffect } from "react";
import "./AdminReview.scss";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import TimeFormat from "../common/time/TimeFormat";
import { AlertCustom } from "../common/alert/Alerts";
import { Backdrop } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { reviewUrl } from "../../apis/apiURLs";

// DataGrid table의 column구성
const columns = [
  { field: "_id", headerName: "후기 번호", width: 128 },
  { field: "show_title", headerName: "해당 공연 제목", width: 128 },
  { field: "title", headerName: "후기 제목", width: 128 },
  { field: "rate", headerName: "평점", width: 128 },
  { field: "user_nickname", headerName: "작성자", width: 128 },
  {
    field: "created_at",
    headerName: "작성 시기",
    width: 100,
    renderCell: (data) => <TimeFormat time={data.row.createdAt} />,
  },
];

const AdminReview = () => {
  // table에서 선택된 review 관리
  const [reviews, setReviews] = useState([]);
  // 삭제 확인 alert
  const [openAlert, setOpenAlert] = useState(false);
  // 삭제 완료 alert
  const [openAlert2, setOpenAlert2] = useState(false);
  // 테이블 행 클릭시 해당 상세페이지로 이동
  const navigate = useNavigate();

  // fetch API 리뷰 조회
  const fetchData = () => {
    fetch(`${reviewUrl}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.data) && data.data.length > 0) {
          setReviews(data.data);
        } else {
          console.error("Data is not an array or empty");
        }
      })
      .catch((err) => console.error(err));
  };

  // 페이지가 로드될 때 리뷰 정보 가져옴
  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = () => {
    // 선택된 후기의 ID 목록
    const selectedReviewIds = reviews
      .filter((review) => review.selected)
      .map((review) => review._id);

    // DELETE 요청 보내기
    fetch(`${reviewUrl}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reviewIds: selectedReviewIds }),
    })
      .then((res) => res.json())
      .then(() => {
        fetchData(); // 선택한 리뷰 DELETE 후 리뷰정보 최신화
        setOpenAlert2(true);
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <div className="admin-board-container">
        <div className="admin-board-header">
          <h1>공연 후기</h1>
          <Button
            variant="contained"
            color="moreDarkGray"
            sx={{ width: "80px", height: "40px", color: "white" }}
            onClick={() => {
              const hasSelectedReviews = reviews.some(
                (review) => review.selected
              );
              if (hasSelectedReviews) setOpenAlert(true);
            }}
          >
            <h4>삭제</h4>
          </Button>
        </div>
        <div style={{ height: "631px", width: "800px" }}>
          <DataGrid
            // 해당 상세페이지로 이동
            onRowClick={(params) => {
              const showNumber = params.row.show_id;
              navigate(`/Play/${showNumber}`);
            }}
            rows={reviews}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            checkboxSelection
            getRowId={(reviews) => reviews._id}
            onRowSelectionModelChange={(selectionModel) => {
              const updateReviews = reviews.map((review) => ({
                ...review,
                selected: selectionModel.includes(review._id),
              }));
              setReviews(updateReviews);
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
