import { Children, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ThumbUpOutlined, VisibilityOutlined } from "@mui/icons-material";
import "./BoardRightContainer.scss";
import dayjs from "dayjs";
import { commentUrl, postUrl, promotionUrl } from "../../apis/apiURLs";
import LiveTimeDiff from "../common/time/LiveTimeDiff";
import setStoreViewList from "../../utils/setStoreRecentViewList";
import numberFormat from "../../utils/numberFormat";
import { AlertContext } from "../../App";

export function BoardRightContainer({ post }) {
  const [viewList, setViewList] = useState([]);
  const [popularList, setPopularList] = useState([]);
  const [latestList, setLatestList] = useState([]);
  const [latestCommentList, setLatestCommentList] = useState([]);
  const { setOpenFetchErrorAlert } = useContext(AlertContext);

  const getStoreViewList = () => {
    const recentViewPosts = JSON.parse(localStorage.getItem("recentViewPosts")) || [];
    setViewList(recentViewPosts);
  };

  const getPopularList = async () => {
    let newList = [];
    // 홍보 조회순 top 3
    let res = await fetch(`${promotionUrl}?limit=5&sortBy=views&sortOrder=desc`);
    let data = await res.json();
    if (res.ok) {
      newList = data.promotions;
    }

    // 홍보 추천순 top 3
    res = await fetch(`${promotionUrl}?limit=5&sortBy=likes&sortOrder=desc`);
    data = await res.json();
    if (res.ok) {
      newList = [...newList, ...data.promotions];
    }

    // 홍보 조회순 top 3
    res = await fetch(`${postUrl}?limit=5&sortBy=views&sortOrder=desc`);
    data = await res.json();
    if (res.ok) {
      newList = [...newList, ...data.posts];
    }

    // 홍보 추천순 top 3
    res = await fetch(`${postUrl}?limit=5&sortBy=likes&sortOrder=desc`);
    data = await res.json();
    if (res.ok) {
      newList = [...newList, ...data.posts];
    }

    newList = newList.reduce((newArr, current) => {
      if (newArr.findIndex(({ _id }) => _id === current._id) === -1) {
        newArr.push(current);
      }
      return newArr;
    }, []);

    // 조회수, 추천 둘 다 없으면 제거
    newList = newList.filter((_post) => _post.likes + _post.views > 0);

    // (조회수 + 추천수) 높은 순 정렬
    newList.sort((a, b) => b.views + b.likes - (a.views + a.likes));

    setPopularList(newList.slice(0, 5));
  };

  const getLatestList = async () => {
    let newList = [];
    // 홍보
    let res = await fetch(`${promotionUrl}?limit=5&sortBy=promotion_number&sortOrder=desc`);
    let data = await res.json();
    if (res.ok) {
      newList = data.promotions;
    }

    // 커뮤니티
    res = await fetch(`${postUrl}?limit=5&sortBy=post_number&sortOrder=desc`);
    data = await res.json();
    if (res.ok) {
      newList = [...newList, ...data.posts];
    }

    newList = newList.reduce((newArr, current) => {
      if (newArr.findIndex(({ _id }) => _id === current._id) === -1) {
        newArr.push(current);
      }
      return newArr;
    }, []);

    // 최신순 정렬
    newList.sort((a, b) => {
      if (dayjs(a.createdAt).isBefore(dayjs(b.createdAt))) {
        return 1;
      }
      return -1;
    });

    setLatestList(newList.slice(0, 5));
  };

  const getLatesTCommentList = async () => {
    let newList = [];
    // 홍보
    let res = await fetch(`${commentUrl}/admins/promotions?limit=5`);
    let data = await res.json();
    if (res.ok) {
      newList = data.comments;
    }

    // 커뮤니티
    res = await fetch(`${commentUrl}/admins/posts?limit=5`);
    data = await res.json();
    if (res.ok) {
      newList = [...newList, ...data.comments];
    }

    newList.sort((a, b) => {
      if (dayjs(a.createdAt).isBefore(dayjs(b.createdAt))) {
        return 1;
      }
      return -1;
    });

    setLatestCommentList(newList.slice(0, 5));
  };

  useEffect(() => {
    try {
      getPopularList();
      getLatestList();
      getLatesTCommentList();
      getStoreViewList();
    } catch (e) {
      setOpenFetchErrorAlert(true);
    }
  }, []);

  useEffect(() => {
    try {
      if (post?._id) {
        setStoreViewList(post);
        getStoreViewList();
      }
    } catch (e) {
      setOpenFetchErrorAlert(true);
    }
  }, [post]);

  return (
    <div className="free-board-right-container">
      <div className="right-box">
        <h4>최근 본 글</h4>
        <ul>
          {viewList.length ? (
            Children.toArray(
              viewList.map((_post) => (
                <Link to={`${_post.category ? `/promotion/${_post.promotion_number}` : `/community/${_post.post_number}`}`}>
                  <li>
                    <span className={`category ${_post.category ? "promotion" : "community"}`}>
                      {_post.category ? `[홍보/${_post.category}]` : "[커뮤니티]"}
                    </span>
                    <p>{_post.title}</p>
                    <div className="right">
                      <VisibilityOutlined sx={{ fontSize: 12 }} />
                      <span>{numberFormat(_post.views || 0)}</span>
                      <ThumbUpOutlined sx={{ fontSize: 12 }} />
                      <span>{numberFormat(_post.likes || 0)}</span>
                    </div>
                  </li>
                </Link>
              )),
            )
          ) : (
            <li>아직 본 글이 없습니다. </li>
          )}
        </ul>
      </div>

      {!popularList.length || (
        <div className="right-box">
          <h4>인기 글</h4>
          <ul>
            {Children.toArray(
              popularList.map((_post, idx) => (
                <Link to={`${_post.category ? `/promotion/${_post.promotion_number}` : `/community/${_post.post_number}`}`}>
                  <li>
                    <span>{idx + 1}.&nbsp;</span>
                    <span className={`category ${_post.category ? "promotion" : "community"}`}>
                      {_post.category ? `[홍보/${_post.category}]` : "[커뮤니티]"}
                    </span>
                    <p>{_post.title}</p>
                    <div className="right">
                      <VisibilityOutlined sx={{ fontSize: 12 }} />
                      <span>{numberFormat(_post.views || 0)}</span>
                      <ThumbUpOutlined sx={{ fontSize: 12 }} />
                      <span>{numberFormat(_post.likes || 0)}</span>
                    </div>
                  </li>
                </Link>
              )),
            )}
          </ul>
        </div>
      )}

      {!latestList.length || (
        <div className="right-box">
          <h4>최신 글</h4>
          <ul>
            {Children.toArray(
              latestList.map((_post) => (
                <Link to={`${_post.category ? `/promotion/${_post.promotion_number}` : `/community/${_post.post_number}`}`}>
                  <li>
                    <span className={`category ${_post.category ? "promotion" : "community"}`}>
                      {_post.category ? `[홍보/${_post.category}]` : "[커뮤니티]"}
                    </span>
                    <p>{_post.title}</p>
                    <div className="right">
                      <LiveTimeDiff time={_post.createdAt} />
                    </div>
                  </li>
                </Link>
              )),
            )}
          </ul>
        </div>
      )}

      <div className="right-box">
        <h4>최근 댓글</h4>
        <ul>
          {latestCommentList.length ? (
            Children.toArray(
              latestCommentList.map((_post) => (
                <Link
                  to={
                    _post.promotion === null
                      ? "/promotion/not-found"
                      : _post.promotion
                        ? `/promotion/${_post.promotion.promotion_number}`
                        : _post.post === null
                          ? "/community/not-found"
                          : `/community/${_post.post.post_number}`
                  }
                >
                  <li>
                    <span className={`category ${_post.promotion === null || _post.promotion ? "promotion" : "community"}`}>
                      {_post.promotion === null ? "[홍보]" : _post.promotion ? `[홍보/${_post.promotion.category}]` : "[커뮤니티]"}
                    </span>
                    <p>{_post.content}</p>
                    <div className="right">
                      <LiveTimeDiff time={_post.createdAt} />
                    </div>
                  </li>
                </Link>
              )),
            )
          ) : (
            <li>아직 댓글이 없습니다. </li>
          )}
        </ul>
      </div>
    </div>
  );
}
