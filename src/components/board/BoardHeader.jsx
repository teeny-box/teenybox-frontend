import { useNavigate } from "react-router-dom/dist";
import "./BoardHeader.scss";
import { KeyboardDoubleArrowLeftOutlined } from "@mui/icons-material";

export function CommunityTabBar({ selected, setSelected }) {
  const handleClickTab = (e) => {
    console.log(e.currentTarget.id);
    setSelected(e.currentTarget.id);
  };
  return (
    <div className="community-tap-bar">
      <div className={`tab-menu pointer ${selected === "post" && "selected"}`} onClick={handleClickTab} id="post">
        <h2 className="text">
          자유게시글
          <div className="new-icon">N</div>
        </h2>
      </div>
      <div className={`tab-menu pointer ${selected === "notice" && "selected"}`} onClick={handleClickTab} id="notice">
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
      <hr />
    </div>
  );
}
