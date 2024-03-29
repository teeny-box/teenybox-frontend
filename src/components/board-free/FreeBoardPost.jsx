import React from "react";
import "./FreeBoardPost.scss";
import { PostTop } from "../board";
import { Link } from "react-router-dom";

export default function FreeBoardPost({ data, totalCommentCount }) {
  return (
    <div className="free-board-post">
      <PostTop user={data.user_id} type={"community"} post={data} commentsCnt={totalCommentCount || 0} />
      <h2 className="title">{data.title}</h2>
      <div className="content">
        {data.content?.split("\n").map((text, idx) => (
          <p key={idx + text}>{text || <br />}</p>
        ))}
      </div>
      {data.tags && data.tags.length !== 0 && (
        <div className="tags">
          {data.tags.map((tag, idx) => (
            <div className="tag" key={idx}>
              <Link to={`/search?query=${tag}&category=커뮤니티&type=tag`}># {tag}</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
