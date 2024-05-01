import { useSearchParams } from "react-router-dom/dist";
import "./SearchResultTab.scss";
import { useState } from "react";

export default function SearchResultTab({ selectedTabMenu, setSelectedTabMenu }) {
  const [openTab, setOpenTab] = useState("close");
  const [searchParams, setSearchParams] = useSearchParams();

  const handleChangeTabMenu = (menu) => {
    setSelectedTabMenu(menu);
    if (searchParams.get("type") !== "tag") {
      searchParams.delete("type");
      setSearchParams(searchParams);
    }
  };

  const handleClickTab = () => {
    if (openTab === "open") setOpenTab("close");
    else setOpenTab("open");
  };

  return (
    <section className={`search-result-tab-container ${openTab}`} onClick={handleClickTab}>
      <div className={`menu p1 ${selectedTabMenu === "연극" ? "active-tab" : null}`} onClick={() => handleChangeTabMenu("연극")}>
        연극
      </div>
      <div className={`menu p1 ${selectedTabMenu === "홍보게시판" ? "active-tab" : null}`} onClick={() => handleChangeTabMenu("홍보게시판")}>
        홍보게시판
      </div>
      <div className={`menu p1 ${selectedTabMenu === "커뮤니티" ? "active-tab" : null}`} onClick={() => handleChangeTabMenu("커뮤니티")}>
        커뮤니티
      </div>
      <div className="dropdown-icon">▼</div>
    </section>
  );
}
