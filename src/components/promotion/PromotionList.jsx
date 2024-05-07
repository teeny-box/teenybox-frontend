import "./PromotionList.scss";
import { Link } from "react-router-dom";
import { SmsOutlined, ThumbUpOutlined, VisibilityOutlined } from "@mui/icons-material";
import { Children } from "react";
import empty_img from "../../assets/img/empty_img.svg";
import minilogo from "../../assets/img/minilogo.png";
import numberFormat from "../../utils/numberFormat";
import { PromotionListCard } from "./PromotionCard";

export default function PromotionList({ newList, fixedList }) {
  return (
    <div className="promotion-list-box">
      {fixedList.map((post) => (
        <div className={`promotion-post-card fixed-notice`} key={post._id} id={post._id}>
          <Link to={`${post.promotion_number}`}>
            <img
              src={minilogo}
              onError={(e) => {
                e.target.src = empty_img;
              }}
              alt=""
            />
          </Link>
          <div className="post-card-content">
            <h5 className="notice">📢 공지사항</h5>
            <div className={`title ${post.tags?.length ? "" : "tl-2"}`}>
              <Link to={`${post.promotion_number}`}>{post.title}</Link>
            </div>

            {post.tags && post.tags.length !== 0 && (
              <div className="tags">
                {post.tags.map((tag, idx) => (
                  <div className="tag" key={idx}>
                    <Link to={`/search?query=${tag}&category=홍보게시판&type=tag`}># {tag}</Link>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex-box post-card-footer">
            <VisibilityOutlined sx={{ fontSize: 16 }} />
            <span>{numberFormat(post.views || 0)}</span>
            <ThumbUpOutlined sx={{ fontSize: 16 }} />
            <span>{numberFormat(post.likes || 0)}</span>
            <SmsOutlined sx={{ fontSize: 16 }} />
            <span>{numberFormat(post.commentsCount || 0)}</span>
          </div>
        </div>
      ))}
      {Children.toArray(newList.map((post, idx) => <PromotionListCard post={post} idx={idx} />))}
    </div>
  );
}
