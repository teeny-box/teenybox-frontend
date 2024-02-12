import React, { useContext, useEffect, useState } from "react";
import "./PostTop.scss";
import { AlertCustom } from "../common/alert/Alerts";
import copyUrl from "../../utils/copyUrl";
import { DeleteOutline, EditOutlined, ShareOutlined, SmsOutlined, ThumbUpAlt, ThumbUpAltOutlined, VisibilityOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { postUrl, promotionUrl } from "../../apis/apiURLs";
import { AlertContext, AppContext } from "../../App";
import { Backdrop, Button, Tooltip } from "@mui/material";
import LiveTimeDiff from "../common/time/LiveTimeDiff";
import default_user_img from "../../assets/img/default_user_img.svg";
import numberFormat from "../../utils/numberFormat";
import { DELETE_USER_NICKNAME } from "../../utils/const";

export function PostTop({ user, type, post, commentsCnt }) {
  const [openURLCopyAlert, setOpenURLCopyAlert] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [isWriter, setIsWriter] = useState(false); // false로 바꾸기
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const { userData } = useContext(AppContext);
  const { setOpenLoginAlert } = useContext(AlertContext);
  const nav = useNavigate();

  const handleCommentsButtonClick = () => {
    const location = document.querySelector("#commentForm").offsetTop;
    window.scrollTo({ top: location, behavior: "smooth" });
  };

  const handleCopyButtonClick = () => {
    copyUrl();
    setOpenURLCopyAlert(true);
  };

  const handleEditButtonClick = () => {
    nav(`/${type}/edit/${post.post_number || post.promotion_number}`);
  };

  const handleDeleteButtonClick = () => {
    setOpenDeleteAlert(true);
  };

  const handleClickLikes = async () => {
    const url = type === "community" ? `${postUrl}/${post.post_number}/like` : `${promotionUrl}/${post.promotion_number}/like`;
    if (isLiked) {
      const res = await fetch(url, { method: "DELETE", credentials: "include" });
      const data = await res.json();
      console.log(data);

      if (res.ok) {
        setIsLiked(false);
        setLikes((cur) => cur - 1);
      } else if (res.status === 403) {
        setOpenLoginAlert(true);
      }
    } else {
      const res = await fetch(url, { method: "POST", credentials: "include" });
      const data = await res.json();
      console.log(data);

      if (res.ok) {
        setIsLiked(true);
        setLikes((cur) => cur + 1);
      } else if (res.status === 403) {
        setOpenLoginAlert(true);
      }
    }
  };

  const deletePost = async () => {
    const url = type === "community" ? `${postUrl}/${post.post_number}` : `${promotionUrl}/${post.promotion_number}`;
    const res = await fetch(url, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await res.json();
    console.log(data);
    nav(`/${type}`);
  };

  useEffect(() => {
    console.log(userData, user);
    if (userData?.user?.nickname === user?.nickname) {
      setIsWriter(true);
    }

    if (userData?.user?._id) {
      setIsLiked(post.likedUsers.includes(userData?.user?._id));
    }
  }, [userData, user]);

  return (
    <>
      {user && (
        <div className="board-post-top">
          <img className="user-img" src={user?.profile_url || default_user_img} onError={(e) => (e.target.src = default_user_img)} />
          <div className="flex-box">
            <div className="user-id">{user?.nickname || DELETE_USER_NICKNAME}</div>
            <div className="date">
              <LiveTimeDiff time={post.createdAt} />
              <span className="dot">•</span>
              <div className="view-cnt">
                <VisibilityOutlined sx={{ fontSize: 16 }} />
                <span>{numberFormat(post.views || 0)}</span>
              </div>
            </div>
          </div>
          <div className="icons">
            <ShareOutlined className="share-icon" onClick={handleCopyButtonClick} />
            {type === "community" && (
              <div className="comments-icon" onClick={handleCommentsButtonClick}>
                <SmsOutlined />
                <span>{numberFormat(commentsCnt)}</span>
              </div>
            )}
            {isWriter && (
              <>
                <EditOutlined onClick={handleEditButtonClick} />
                <DeleteOutline onClick={handleDeleteButtonClick} />
              </>
            )}
            <Tooltip title={isLiked ? "추천됨" : "추천하기"} arrow>
              <Button onClick={handleClickLikes} variant={"outlined"} size="small" startIcon={isLiked ? <ThumbUpAlt /> : <ThumbUpAltOutlined />} disableElevation>
                {numberFormat(likes)}
              </Button>
            </Tooltip>
          </div>

          <AlertCustom open={openURLCopyAlert} onclose={() => setOpenURLCopyAlert(false)} title={"URL이 복사되었습니다!"} content={window.location.href} time={1500} />
          <Backdrop open={openDeleteAlert} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <AlertCustom
              open={openDeleteAlert}
              onclose={() => setOpenDeleteAlert(false)}
              severity={"error"}
              title={"teenybox.com 내용:"}
              content={"정말 삭제하시겠습니까?"}
              onclick={deletePost}
              checkBtn={"확인"}
              checkBtnColor={"#ef5350"}
              closeBtn={"취소"}
            />
          </Backdrop>
        </div>
      )}
    </>
  );
}
