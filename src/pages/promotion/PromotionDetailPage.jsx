import "./PromotionDetailPage.scss";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CircularProgress, Backdrop } from "@mui/material";
import { Helmet } from "react-helmet-async";
import PromotionPost from "../../components/promotion/PromotionPost";
import { AlertCustom } from "../../components/common/alert/Alerts";
import { BoardSecondHeader, BoardNav, CommentForm, CommentsList, BoardRightContainer } from "../../components/board";
import { commentUrl, postUrl, promotionUrl, userUrl } from "../../apis/apiURLs";
import { NotFoundPage } from "../errorPage/NotFoundPage";
import { AlertContext, AppContext } from "../../App";
import { COMMENTS_LIMIT } from "../../utils/const";

export function PromotionDetailPage() {
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [state, setState] = useState("loading");
  const [commentState, setCommentState] = useState("loading");
  const nav = useNavigate();
  const params = useParams();
  const { userData, setUserData } = useContext(AppContext);
  const { setOpenLoginAlertBack, setOpenFetchErrorAlert } = useContext(AlertContext);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const getPromotion = async () => {
    setState("loading");

    try {
      const { postId } = params;
      const res = await fetch(`${promotionUrl}/${postId}?usage=view`);
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
      const res = await fetch(`${commentUrl}/promotions/${post._id}?page=${page}&limit=${COMMENTS_LIMIT}`);
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
          promotion: post._id,
        }),
      });
      const data = await res.json();
      const newComment = { ...data, user: { nickname: userData.nickname, profile_url: userData.profile_url, state: "가입", _id: userData._id } };

      if (res.ok) {
        setComments([newComment, ...comments]);
        setTotalCount(totalCount + 1);
      } else if (res.status === 401 || res.status === 403) {
        const loginRes = await fetch(`${userUrl}`, { credentials: "include" });
        if (loginRes.ok) {
          const _data = await loginRes.json();
          setUserData(_data.user);
        } else {
          setUserData(null);
          setOpenLoginAlertBack(true);
        }
      } else {
        console.error(data);
      }
    } catch (err) {
      setOpenFetchErrorAlert(true);
    }
  };

  const handleRefreshComments = async () => {
    setCommentState("loading");
    setComments([]);

    try {
      const res = await fetch(`${commentUrl}/promotions/${post._id}?page=1&limit=${COMMENTS_LIMIT}`);
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

  const deletePost = async () => {
    try {
      const res = await fetch(`${postUrl}/${post.post_number}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        nav(`/community`);
      } else {
        const data = await res.json();
        console.error(data);
      }
    } catch (e) {
      setOpenFetchErrorAlert(true);
    }
  };

  const handleEditButtonClick = () => {
    nav(`/community/edit/${post.post_number || post.promotion_number}`);
  };

  const handleDeleteButtonClick = () => {
    setOpenDeleteAlert(true);
  };

  useEffect(() => {
    if (post?._id) {
      getComments();
    }
  }, [post]);

  useEffect(() => {
    if (Number(params.postId) !== Number(post.promotion_number)) {
      getPromotion();
      setTotalCount(0);
      setPage(1);
      setComments([]);
    }
  }, [params]);

  return (
    <div className="promotion-detail-page page-layout">
      {state === "hasError" ? (
        <NotFoundPage prev={true} />
      ) : (
        <>
          <div className="board-left-container">
            <BoardSecondHeader header={"홍보게시판"} onclick={() => nav("/promotion")} />
            {state === "loading" ? (
              <div className="progress-box">
                <CircularProgress color="secondary" className="progress" />
              </div>
            ) : (
              <div className="body">
                <Helmet>
                  <title>{post.title?.replace(/\r/g, "")}</title>
                  <meta name="description" content={post.content?.slice(0, 50).replace(/\r/g, "")} />
                  <meta property="og:type" content="website" />
                  <meta property="og:title" content={post.title?.slice(0, 50).replace(/\r/g, "")} />
                  <meta property="og:site_name" content={post.title?.slice(0, 50).replace(/\r/g, "")} />
                  <meta property="og:description" content={post.description?.slice(0, 50).replace(/\r/g, "")} />
                  <meta property="og:image" content={post.image_url || "https://teeny-box.com/static/media/minilogo.c8da1ed0d7124e0acc3e.png"} />
                </Helmet>
                {post._id && <PromotionPost post={post} totalCommentCount={totalCount} />}
                <div className="comment-top">
                  <div className="button-box">
                    {userData?.nickname === post?.user_id.nickname && (
                      <>
                        <button className="black btn" onClick={handleEditButtonClick}>
                          수정
                        </button>
                        <button className="black btn" onClick={handleDeleteButtonClick}>
                          삭제
                        </button>
                      </>
                    )}
                    <button className="btn" onClick={() => nav(`/promotion`)}>
                      목록
                    </button>
                  </div>
                  <BoardNav point={totalCount.toLocaleString("ko-KR")} text="개의 댓글" onclick={handleRefreshComments} />
                  <CommentForm createComment={createComment} postId={post?._id} />
                </div>
                {!comments.length || (
                  <CommentsList comments={comments} totalCount={totalCount} getComments={getComments} setComments={setComments} setTotalCount={setTotalCount} />
                )}
                {commentState === "loading" && (
                  <div className="progress-box">
                    <CircularProgress color="secondary" className="progress-100" />
                  </div>
                )}
              </div>
            )}
          </div>
          <BoardRightContainer post={post} />
        </>
      )}
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
  );
}
