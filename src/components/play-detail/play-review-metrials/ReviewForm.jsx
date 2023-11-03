import React, { useState } from "react";
import "./ReviewForm.scss";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

export default function ReviewForm({ purpose, contents }) {
  const [ratingValue, setRatingValue] = useState(0);
  // console.log(ratingValue);

  return (
    <>
      <form className="review-form-container">
        {purpose === "작성" && <h2>관람 후기 작성</h2>}
        <div className="review-title-box">
          <h3>* 후기 제목</h3>
          <TextField
            variant="standard"
            minRows="false"
            maxRows="true"
            rows="8"
            defaultValue="제목을 입력해주세요. 30자 제한입니다."
            sx={{ width: 550 }}
            inputProps={{ maxLength: 30 }}
          />
        </div>
        <div className="review-author-box">
          <h3>작성자</h3>
          <p>작성자 닉네임</p>
        </div>
        <div className="review-content-box">
          <h3>후기 내용</h3>
          <TextField
            variant="outlined"
            multiline
            rows={10}
            defaultValue="내용을 입력해주세요. 500자 제한입니다."
            sx={{ width: 1000, height: 280 }}
            inputProps={{ maxLength: 500 }}
          />
        </div>
        <div className="review-rating-box">
          <h3>* 별점</h3>
          <Rating
            name="simple-controlled"
            value={ratingValue}
            onChange={(event, newValue) => {
              setRatingValue(newValue);
            }}
            precision={0.5}
          />
        </div>
        <div className="reivew-photo-upload-box">
          <h3>사진 첨부</h3>
          <input type="file" className="file-upload-btn" />
          <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fc62jaK%2FbtrR6FXheGZ%2F5hRmAFuxAopQCmEZ5C1TE1%2Fimg.jpg" />
        </div>
        <div className="review-guide-text">
          <p>* 표시가 되어 있는 항목은 필수 기재 항목입니다.</p>
          <p>
            제목은 띄어쓰기 포함 30자, 내용은 띄어쓰기 포함 500자 제한입니다.
          </p>
        </div>
      </form>
      <div className="play-review-btn">
        <Button variant="contained" className="play-review-btn">
          {purpose} 완료
        </Button>
        <Button variant="outlined" color="error" className="play-review-btn">
          {purpose} 취소
        </Button>
      </div>
    </>
  );
}
