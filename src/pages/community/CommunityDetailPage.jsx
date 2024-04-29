import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, CircularProgress } from "@mui/material";
import { Helmet } from "react-helmet-async";
import CommunityPost from "../../components/community/CommunityPost";
import "./CommunityDetailPage.scss";
import { BoardSecondHeader, BoardNav, CommentForm, CommentsList, BoardRightContainer } from "../../components/board";
import { commentUrl, postUrl, userUrl } from "../../apis/apiURLs";
import setStoreViewList from "../../utils/setStoreRecentViewList";
import { NotFoundPage } from "../errorPage/NotFoundPage";
import { AlertContext, AppContext } from "../../App";
import { COMMENTS_LIMIT } from "../../utils/const";

export function CommunityDetailPage() {
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [state, setState] = useState("loading");
  const [commentState, setCommentState] = useState("loading");
  const nav = useNavigate();
  const params = useParams();
  const { userData, setUserData } = useContext(AppContext);
  const { setOpenLoginAlert, setOpenFetchErrorAlert } = useContext(AlertContext);

  const getPost = async () => {
    setState("loading");
    try {
      const { postId } = params;
      const res = await fetch(`${postUrl}/${postId}&usage=view`);
      const data = await res.json();

      if (res.ok) {
        setPost(data);
        setState("hasValue");
      } else {
        setPost();
        setState("hasError");
        console.error(data);
      }
    } catch (err) {
      setState("hasError");
    }
  };

  const getComments = async () => {
    if (totalCount !== 0 && totalCount <= comments.length) return;
    setCommentState("loading");

    try {
      const res = await fetch(`${commentUrl}/posts/${post._id}?page=${page}&limit=${COMMENTS_LIMIT}`);
      const data = await res.json();

      if (res.ok) {
        setComments([...comments, ...data.comments]);
        setTotalCount(data.totalComments);
        setPage(page + 1);
        setCommentState("hasValue");
      } else {
        setCommentState("hasError");
        console.error(data);
      }
    } catch (err) {
      setCommentState("hasError");
    }
  };

  const createComment = async (inputText) => {
    try {
      const res = await fetch(`${commentUrl}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: inputText,
          post: post._id,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        const newComment = {
          ...data,
          user: { nickname: userData.nickname, profile_url: userData.profile_url, state: "가입", _id: userData._id },
        };
        setComments([newComment, ...comments]);
        setTotalCount(totalCount + 1);
      } else if (res.status === 401 || res.status === 403) {
        const loginRes = await fetch(`${userUrl}`, { credentials: "include" });
        if (loginRes.ok) {
          const _data = await loginRes.json();
          createComment(inputText);
          setUserData(_data.user);
        } else {
          setUserData(null);
          setOpenLoginAlert(true);
        }
      } else {
        console.error(data);
      }
    } catch (e) {
      setOpenFetchErrorAlert(true);
      console.error(e);
    }
  };

  const handleRefreshComments = async () => {
    setCommentState("loading");
    setComments([]);

    try {
      const res = await fetch(`${commentUrl}/posts/${post._id}?page=1&limit=${COMMENTS_LIMIT}`);
      const data = await res.json();

      if (res.ok) {
        setComments(data.comments);
        setTotalCount(data.totalComments);
        setPage(2);
        setCommentState("hasValue");
      } else {
        setCommentState("hasError");
        console.error(data);
      }
    } catch (err) {
      setCommentState("hasError");
    }
  };

  useEffect(() => {
    if (post?._id) {
      getComments();
      setStoreViewList(post);
    }
  }, [post]);

  useEffect(() => {
    if (Number(params.postId) !== Number(post.post_number)) {
      getPost();
      setTotalCount(0);
      setPage(1);
      setComments([]);
    }
  }, [params]);

  return (
    <div className="Community-detail page-margin">
      {state === "hasError" ? (
        <NotFoundPage prev={true} />
      ) : (
        <>
          <div className="Community-left-container">
            <Helmet>
              <title>{post.title}</title>
              <meta name="description" content={post.content.slice(0, 50)} />
              <meta property="og:type" content="website" />
              <meta property="og:title" content={post.title.slice(0, 50)} />
              <meta property="og:site_name" content={post.title.slice(0, 50)} />
              <meta property="og:description" content={post.description.slice(0, 50)} />
              <meta property="og:image" content={post.image_url || "https://teeny-box.com/static/media/minilogo.c8da1ed0d7124e0acc3e.png"} />
            </Helmet>
            <BoardSecondHeader header="커뮤니티" onclick={() => nav("/community")} />
            {state === "loading" ? (
              <div className="progress-box">
                <CircularProgress color="secondary" className="progress" />
              </div>
            ) : (
              <div className="body">
                {post._id && <CommunityPost data={post} totalCommentCount={totalCount} />}
                <BoardNav point={totalCount.toLocaleString("ko-KR")} text="개의 댓글" onclick={handleRefreshComments} />
                <CommentForm createComment={createComment} postId={post?._id} />
                {!comments.length || (
                  <CommentsList comments={comments} setComments={setComments} totalCount={totalCount} getComments={getComments} setTotalCount={setTotalCount} />
                )}
                {commentState === "loading" && (
                  <div className="progress-box">
                    <CircularProgress color="secondary" className="progress-100" />
                  </div>
                )}
                <Button className="back-btn" color="inherit" variant="contained" onClick={() => nav(`/community`)}>
                  목록보기
                </Button>
              </div>
            )}
          </div>
          <BoardRightContainer post={post} />
        </>
      )}
    </div>
  );
}
