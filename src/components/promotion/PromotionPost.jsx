import "./PromotionPost.scss";
import React, { Children, useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Tooltip, Backdrop } from "@mui/material";
import { CalendarMonth, FormatQuote, LocationOn, MovieCreation, ThumbUpAlt, ThumbUpAltOutlined } from "@mui/icons-material";
import { Viewer } from "@toast-ui/react-editor";
import { PostTop } from "../board";
import { promotionUrl } from "../../apis/apiURLs";
import { AlertContext, AppContext } from "../../App";
import empty_img from "../../assets/img/empty_img.svg";
import TimeFormat from "../common/time/TimeFormat";
import numberFormat from "../../utils/numberFormat";
// eslint-disable-next-line import/no-extraneous-dependencies
import "@toast-ui/editor/dist/toastui-editor-viewer.css";

export default function PromotionPost({ post, totalCommentCount }) {
  const [openMainImg, setOpenMainImg] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(false);
  const { setOpenLoginAlert, setOpenFetchErrorAlert } = useContext(AlertContext);
  const { userData } = useContext(AppContext);

  const handleClickLikes = async () => {
    try {
      if (isLiked) {
        const res = await fetch(`${promotionUrl}/${post.promotion_number}/like`, { method: "DELETE", credentials: "include" });

        if (res.ok) {
          setIsLiked(false);
          setLikes((cur) => cur - 1);
        } else if (res.status === 403) {
          setOpenLoginAlert(true);
        } else {
          const data = await res.json();
          console.error(data);
        }
      } else {
        const res = await fetch(`${promotionUrl}/${post.promotion_number}/like`, { method: "POST", credentials: "include" });

        if (res.ok) {
          setIsLiked(true);
          setLikes((cur) => cur + 1);
        } else if (res.status === 403) {
          setOpenLoginAlert(true);
        } else {
          const data = await res.json();
          console.error(data);
        }
      }
    } catch (e) {
      setOpenFetchErrorAlert(true);
    }
  };

  useEffect(() => {
    if (userData?._id) {
      setIsLiked(post.likedUsers.includes(userData?._id));
    }
  }, [userData]);

  return (
    <div className="promotion-post">
      <PostTop user={post.user_id} type={"promotion"} post={post} commentsCnt={totalCommentCount} />
      {post.category === "공지" || (
        <div className="top-container">
          <img
            className="main-img"
            src={post.image_url[0] || empty_img}
            onError={(e) => {
              e.target.src = empty_img;
            }}
            alt="홍보 포스터"
            onClick={() => setOpenMainImg(true)}
          />
          <div className="flex-column">
            <div className="box">
              <div className="lable">타이틀</div>
              <div className="value">{post.play_title}</div>
              <FormatQuote className="icon double" />
            </div>
            <div className="box">
              <div className="lable">{post.category === "연극" ? "공연기간" : "행사기간"}</div>
              <div className="value">
                {post.start_date && <TimeFormat time={post.start_date} />} ~ {post.end_date && <TimeFormat time={post.end_date} />}
              </div>
              <CalendarMonth className="icon" />
            </div>
          </div>
          <div className="flex-column">
            <div className="box">
              <div className="lable">장소</div>
              <div className="value">{post.location || <span className="undefined">본문참고</span>}</div>
              <LocationOn className="icon" />
            </div>
            <div className="box add">
              <div className="lable">추가정보</div>
              {post.category === "연극" && (
                <div className="value">
                  <span className="sub-lable">러닝타임</span>
                  {post.runtime ? `${post.runtime}분` : <span className="undefined">본문참고</span>}
                </div>
              )}
              {!post.runtime || !post.host || <span className="hidden">,</span>}
              <div className={`value ${post.category === "연극" && "mg-6"}`}>
                <span className="sub-lable">주최</span>
                {post.host || <span className="undefined">본문참고</span>}
              </div>

              <MovieCreation className="icon" />
            </div>
          </div>
        </div>
      )}

      <h2 className="title t1">{post.title}</h2>
      <div className="content">
        <Viewer initialValue={post.content} />
      </div>
      {post.tags && post.tags.length !== 0 && (
        <div className="tags">
          {Children.toArray(
            post.tags.map((tag) => (
              <Link to={`/search?query=${tag}&category=홍보게시판&type=tag`} className="tag">
                <span># {tag}</span>
              </Link>
            )),
          )}
        </div>
      )}
      <div className="flex-center">
        <Tooltip title={isLiked ? "추천됨" : "추천하기"} arrow>
          <Button
            color="secondary"
            onClick={handleClickLikes}
            variant={isLiked ? "contained" : "outlined"}
            size="large"
            startIcon={isLiked ? <ThumbUpAlt /> : <ThumbUpAltOutlined />}
            style={{ borderRadius: 10 }}
            disableElevation
          >
            {numberFormat(likes)}
          </Button>
        </Tooltip>
      </div>
      <Backdrop open={openMainImg} onClick={() => setOpenMainImg(false)} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <img className="zoom" src={post.image_url[0]} />
      </Backdrop>
    </div>
  );
}
