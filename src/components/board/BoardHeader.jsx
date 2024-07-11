import { useNavigate } from "react-router-dom/dist";
import "./BoardHeader.scss";
import { KeyboardDoubleArrowLeftOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { postUrl } from "../../apis/apiURLs";

const LAST_VIEW_ALL_STORE_NAME = "lastViewPostOnAll";
const LAST_VIEW_NOTICE_STORE_NAME = "lastViewPostOnNotice";

export function CommunityTabBar({ selected, setSelected, setPage, reload, setReload, setSort }) {
  const [newInAll, setNewInAll] = useState(false);
  const [newInNoti, setNewInNoti] = useState(false);

  const handleClickTab = (e) => {
    setSelected(e.currentTarget.id);
    setPage(1);
    setReload((cur) => cur + 1);
    setSort("최신순");
  };

  const isNewCheck = async () => {
    try {
      const resAll = await fetch(`${postUrl}?category=자유&page=1&limit=1&sortBy=time&sortOrder=desc`);
      const lastPostOnAll = await resAll.json();
      if (resAll.ok) {
        const storeLastNum = JSON.parse(localStorage.getItem(LAST_VIEW_ALL_STORE_NAME)) || 0;
        setNewInAll(Number(lastPostOnAll.posts[0].post_number) > Number(storeLastNum));
      }

      const resNoti = await fetch(`${postUrl}?category=공지&page=1&limit=1&sortBy=time&sortOrder=desc`);
      const lastPostOnNoti = await resNoti.json();
      if (resNoti.ok) {
        const storeLastNum = localStorage.getItem(LAST_VIEW_NOTICE_STORE_NAME) || 0;
        setNewInNoti(Number(lastPostOnNoti.posts[0].post_number) > Number(storeLastNum));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    isNewCheck();
  }, [selected, reload]);

  return (
    <div className="community-tap-bar">
      <div className={`tab-menu pointer ${selected === "자유" && "selected"}`} onClick={handleClickTab} id="자유">
        <h2 className="text">
          자유게시글
          {newInAll && <div className="new-icon">N</div>}
        </h2>
      </div>
      <div className={`tab-menu pointer ${selected === "공지" && "selected"}`} onClick={handleClickTab} id="공지">
        <h2 className="text">
          공지사항
          {newInNoti && <div className="new-icon">N</div>}
        </h2>
      </div>
    </div>
  );
}

export function BoardSecondHeader({ header }) {
  const nav = useNavigate();

  return (
    <div className="board-second-header">
      <div className="click-box pointer" onClick={() => nav(-1)}>
        <KeyboardDoubleArrowLeftOutlined sx={{ fontSize: 18 }} />
        <span className="header-title">{header}</span>
      </div>
    </div>
  );
}
