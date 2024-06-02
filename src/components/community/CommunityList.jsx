import { Children } from "react";
import "./CommunityList.scss";
import { Link } from "react-router-dom";
import { SmsOutlined, ThumbUpOutlined, VisibilityOutlined } from "@mui/icons-material";
import { useMediaQuery } from "react-responsive";
import LiveTimeDiff from "../common/time/LiveTimeDiff";
import default_user_img from "../../assets/img/default_user_img.svg";
import numberFormat from "../../utils/numberFormat";
import { DELETE_USER_NICKNAME } from "../../utils/const";

export default function CommunityList({ boardList, isFixed }) {
  const isMoblie = useMediaQuery({ query: "(max-width: 768px)" });

  const body = (post) => (
    <>
      <div className="top">
        <div className="user">
          <img
            className="user-img"
            src={(post.user?.state === "가입" && post.user?.profile_url) || default_user_img}
            onError={(e) => {
              e.target.src = default_user_img;
            }}
          />
          <span>{(post.user?.state === "가입" && post.user?.nickname) || DELETE_USER_NICKNAME}</span>
        </div>
        {" · "}
        <div className="time">
          <LiveTimeDiff time={post.createdAt} />
        </div>
      </div>
      <div>
        <Link className="title" to={`/community/${post.post_number}`}>
          {post.title}
        </Link>
      </div>
      <div className="flex-box bottom">
        {post.tags?.length ? (
          <div className="tags">
            {isFixed && (
              <div className="notice">
                <span>공지사항</span>
              </div>
            )}
            {Children.toArray(
              post.tags.map((tag) => (
                <Link to={`/search?query=${tag}&category=커뮤니티&type=tag`} className="tag">
                  <span># {tag}</span>
                </Link>
              )),
            )}
          </div>
        ) : (
          <div className="content">{post.content}</div>
        )}
        <div className="flex-box post-card-footer">
          <VisibilityOutlined sx={{ fontSize: 16 }} />
          <span>{numberFormat(post.views || 0)}</span>
          <ThumbUpOutlined sx={{ fontSize: 16 }} />
          <span>{numberFormat(post.likes || 0)}</span>
          <SmsOutlined sx={{ fontSize: 16 }} />
          <span>{numberFormat(post.commentsCount || 0)}</span>
        </div>
      </div>
    </>
  );

  return (
    <div className={`Community-list-box ${isFixed ? "fixed" : ""}`}>
      {boardList.map((post) => (
        <div className={`content-box`} key={post._id} id={post.post_number}>
          {isMoblie ? (
            <Link className="link" to={`/community/${post.post_number}`}>
              {body(post)}
            </Link>
          ) : (
            body(post)
          )}
        </div>
      ))}
    </div>
  );
}
