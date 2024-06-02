import { useNavigate } from "react-router-dom/dist";
import "./BoardHeader.scss";
import { KeyboardDoubleArrowLeftOutlined } from "@mui/icons-material";

export function CommunityTabBar({ selected, setSelected, setPage, setReload }) {
  const handleClickTab = (e) => {
    setSelected(e.currentTarget.id);
    setPage(1);
    setReload((cur) => cur + 1);
  };

  return (
    <div className="community-tap-bar">
      <div className={`tab-menu pointer ${selected === "자유" && "selected"}`} onClick={handleClickTab} id="자유">
        <h2 className="text">
          자유게시글
          <div className="new-icon">N</div>
        </h2>
      </div>
      <div className={`tab-menu pointer ${selected === "공지" && "selected"}`} onClick={handleClickTab} id="공지">
        <h2 className="text">
          공지사항
          <div className="new-icon">N</div>
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
