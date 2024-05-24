import "./Comment.scss";
import { useNavigate } from "react-router-dom";
import { Backdrop } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { AlertContext, AppContext } from "../../App";
import { commentUrl } from "../../apis/apiURLs";
import { AlertCustom } from "../common/alert/Alerts";
import LiveTimeDiff from "../common/time/LiveTimeDiff";
import default_user_img from "../../assets/img/default_user_img.svg";
import { DELETE_USER_NICKNAME } from "../../utils/const";

export function Comment({ commentData, deleteComment }) {
  const [comment, setComment] = useState(commentData);
  const [seeMoreOpen, setSeeMoreOpen] = useState(false);
  const [disable, setDisable] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [inputComment, setInputComment] = useState(comment.content);
  const [openAlertDelete, setOpenAlertDelete] = useState(false);
  const { userData, setUserData } = useContext(AppContext);
  const { setOpenFetchErrorAlert } = useContext(AlertContext);
  const nav = useNavigate();

  const handleSeeMore = () => {
    setSeeMoreOpen((cur) => !cur);
  };

  const handleClickUpdateBtn = async () => {
    try {
      const res = await fetch(`${commentUrl}/${comment._id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: inputComment }),
      });
      const data = await res.json();

      if (res.ok) {
        setComment({ ...comment, content: data.content });
        setIsEditing(false);
      } else if (res.status === 401 || res.status === 403) {
        setUserData(null);
        nav("/signup-in");
      } else {
        console.error(data);
      }
    } catch (err) {
      setOpenFetchErrorAlert(true);
    }
  };

  useEffect(() => {
    if (!isEditing) {
      const textBox = document.querySelector(`#comment${comment._id} .text`);
      if (parseInt(textBox.clientHeight, 10) >= 220) {
        setDisable(false);
      }
      setSeeMoreOpen(false);
    }
  }, [isEditing]);

  return (
    <>
      <div className={`comment-box ${userData?.nickname === comment.user.nickname && "my"}`} id={`comment${comment._id}`}>
        <img
          className="user-profile-img"
          src={comment.user.profile_url || default_user_img}
          onError={(e) => {
            e.target.src = default_user_img;
          }}
        />
        <div className="right-box">
          <div className="top">
            <div className="left">
              <span className="user-id">{comment.user.nickname || DELETE_USER_NICKNAME}</span>
              {" · "}
              <span className="time">
                <LiveTimeDiff time={comment.createdAt} />
              </span>
            </div>
            {userData?.nickname === comment.user.nickname && (
              <>
                {isEditing ? (
                  <div className="buttons editing">
                    <button className="edit" onClick={handleClickUpdateBtn}>
                      완료
                    </button>
                    <button onClick={() => setIsEditing(false)}>취소</button>
                  </div>
                ) : (
                  <div className="buttons default">
                    <button onClick={() => setIsEditing(true)}>수정</button>
                    <button onClick={() => setOpenAlertDelete(true)}>삭제</button>
                  </div>
                )}
              </>
            )}
          </div>
          {isEditing ? (
            <div className="content edit">
              <textarea id="comment" value={inputComment} onChange={(e) => setInputComment(e.target.value)} placeholder="댓글을 작성하세요."></textarea>
            </div>
          ) : (
            <div className="content pre-wrap">
              <span className={`text ${disable || (seeMoreOpen ? "open" : "close")}`}>
                {comment.content}
                <span className="see-more-btn pointer" onClick={handleSeeMore}>
                  {disable || (seeMoreOpen ? "▴접기" : "▾더보기")}
                </span>
              </span>
            </div>
          )}
        </div>
      </div>
      <Backdrop open={openAlertDelete} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <AlertCustom
          open={openAlertDelete}
          onclose={() => setOpenAlertDelete(false)}
          title={"teenybox.com 내용:"}
          content={"댓글을 삭제하시겠습니까?"}
          onclick={() => deleteComment(comment._id)}
          checkBtn={"삭제"}
          closeBtn={"취소"}
          severity={"error"}
          checkBtnColor={"#ef5350"}
        />
      </Backdrop>
    </>
  );
}
