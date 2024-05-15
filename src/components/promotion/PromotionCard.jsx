import { Children } from "react";
import { Link } from "react-router-dom";
import { SmsOutlined, ThumbUpOutlined, VisibilityOutlined } from "@mui/icons-material";
import empty_img from "../../assets/img/empty_img.svg";
import TimeFormat from "../common/time/TimeFormat";
import numberFormat from "../../utils/numberFormat";
import "./PromotionCard.scss";

// const logo3 = "https://elice-5th.s3.ap-northeast-2.amazonaws.com/280046bf_e975_4241_a686_af535de3b07d_logo2.png";

export function PromotionListCard({ post, idx }) {
  return (
    <div className={`promotion-post-card ${idx % 2 ? "" : "bg-point"}`} key={post._id} id={post._id}>
      <Link className="img-box" to={`/promotion/${post.promotion_number}`}>
        <img
          src={post.image_url[0] || empty_img}
          onError={(e) => {
            e.target.src = empty_img;
          }}
          alt=""
        />
      </Link>
      <div className="post-card-content">
        <div className={`title h2 ${post.tags?.length ? "" : "tl-2"}`}>
          <Link to={`/promotion/${post.promotion_number}`}>{post.title}</Link>
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
        <div className="date">
          {post.start_date && <TimeFormat time={post.start_date} />}
          {" ~ "}
          {post.end_date && <TimeFormat time={post.end_date} />}
        </div>
        <div className="post-card-footer">
          <VisibilityOutlined sx={{ fontSize: 16 }} />
          <span>{numberFormat(post.views || 0)}</span>
          <ThumbUpOutlined sx={{ fontSize: 16 }} />
          <span>{numberFormat(post.likes || 0)}</span>
          <SmsOutlined sx={{ fontSize: 16 }} />
          <span>{numberFormat(post.commentsCount || 0)}</span>
        </div>
      </div>
    </div>
  );
}
