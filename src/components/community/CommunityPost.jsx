import "./CommunityPost.scss";
import React, { Children, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Viewer } from "@toast-ui/react-editor";
import { Button, Tooltip } from "@mui/material";
import { ThumbUpAlt, ThumbUpAltOutlined } from "@mui/icons-material";
import { postUrl } from "../../apis/apiURLs";
import numberFormat from "../../utils/numberFormat";
import { AlertContext, AppContext } from "../../App";
import { PostTop } from "../board";
// eslint-disable-next-line import/no-extraneous-dependencies
import "@toast-ui/editor/dist/toastui-editor-viewer.css";

export default function CommunityPost({ post, totalCommentCount }) {
  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(false);
  const { setOpenLoginAlert, setOpenFetchErrorAlert } = useContext(AlertContext);
  const { userData } = useContext(AppContext);

  const handleClickLikes = async () => {
    try {
      if (isLiked) {
        const res = await fetch(`${postUrl}/${post.post_number}/like`, { method: "DELETE", credentials: "include" });

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
        const res = await fetch(`${postUrl}/${post.post_number}/like`, { method: "POST", credentials: "include" });

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
    <div className="Community-post">
      <PostTop user={post.user_id} type={"community"} post={post} commentsCnt={totalCommentCount || 0} />
      <h2 className="title t1">{post.title}</h2>
      <div className="content">
        <Viewer initialValue={post.content} />
      </div>
      {post.tags && post.tags.length !== 0 && (
        <div className="tags">
          {Children.toArray(
            post.tags.map((tag) => (
              <Link to={`/search?query=${tag}&category=커뮤니티&type=tag`} className="tag">
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
    </div>
  );
}
