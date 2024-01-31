import React, { useEffect, useState } from "react";
import "./PRBoardList.scss";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import { Link } from "react-router-dom";

export default function PRBoardList({ newList }) {
  const [boardListLeft, setBoardListLeft] = useState([]);
  const [boardListRight, setBoardListRight] = useState([]);

  useEffect(() => {
    if (!boardListLeft.length && !boardListRight.length) return;
    const lastl = document.querySelector(".left .content-box:last-child")?.clientHeight + 78;
    const lastr = document.querySelector(".right .content-box:last-child")?.clientHeight + 78;
    const suml = document.querySelector(".left").clientHeight;
    const sumr = document.querySelector(".right").clientHeight;

    if (suml > sumr && suml - lastl > sumr) {
      setBoardListRight((cur) => [...cur, boardListLeft[boardListLeft.length - 1]]);
      setBoardListLeft((cur) => [...cur.slice(0, cur.length - 1)]);
    } else if (sumr > suml && sumr - lastr > suml) {
      setBoardListLeft((cur) => [...cur, boardListRight[boardListRight.length - 1]]);
      setBoardListRight((cur) => [...cur.slice(0, cur.length - 1)]);
    }
  }, [boardListLeft, boardListRight]);

  useEffect(() => {
    console.log("newlist update");
    setBoardListLeft((cur) => [...cur, ...newList.filter((b, idx) => idx % 2 == 0)]);
    setBoardListRight((cur) => [...cur, ...newList.filter((b, idx) => idx % 2 == 1)]);
  }, [newList]);

  const content = (post) => (
    <Link className={`content-box pointer`} key={post._id} id={post._id} to={`${post.promotion_number}`}>
      <img src={post.image_url} alt="" />
      <div className="post-content-box">
        <div className="flex-box">
          <div className="title">{post.title}</div>
          <div className="flex-box comments">
            <SmsOutlinedIcon sx={{ fontSize: 20 }} />
            <span>{post.comments?.length || 0}</span>
          </div>
        </div>
        {post.tags && post.tags.length !== 0 && (
          <div className="tags">
            {post.tags.map((tag, idx) => (
              <div key={idx}># {tag}</div>
            ))}
          </div>
        )}
        <div className="content">{post.content}</div>
      </div>
    </Link>
  );

  return (
    <div className="pr-board-list-box">
      <div className="left">{boardListLeft.map((post, idx) => content(post, idx))}</div>
      <div className="right">{boardListRight.map((post, idx) => content(post, idx))}</div>
    </div>
  );
}
