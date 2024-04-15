import React from "react";
import { Link } from "react-router-dom";
import "./FreeBoardPost.scss";
import { Viewer } from "@toast-ui/react-editor";
import { PostTop } from "../board";
// eslint-disable-next-line import/no-extraneous-dependencies
import "@toast-ui/editor/dist/toastui-editor-viewer.css";

export default function FreeBoardPost({ data, totalCommentCount }) {
  return (
    <div className="free-board-post">
      <PostTop user={data.user_id} type={"community"} post={data} commentsCnt={totalCommentCount || 0} />
      <h2 className="title">{data.title}</h2>
      <div className="content">
        <Viewer initialValue={data.content} />
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
