import React, { useRef } from "react";
import "./RegionSelectBar.scss";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

export default function RegionSelectBar({ changeSelectedRegion, selectedRegion, isExpandClicked, setIsExpandClicked, innerWidth }) {
  const containerRef = useRef(null);

  const handleConditionSearchExpand = () => {
    if (innerWidth <= 768) {
      setIsExpandClicked(!isExpandClicked);
    }
  };

  const handleRegionClick = (e, region) => {
    e.stopPropagation();
    changeSelectedRegion(e, region);
    setIsExpandClicked(true);
  };

  const regionSelectComponent = (
    <div className="play-region-select">
      {[["전체"], ["서울"], ["경기/인천"], ["대전", "충청", "세종"], ["강원"], ["부산", "울산"], ["대구", "경상"], ["광주", "전라"], ["제주"]].map((region) => (
        <span
          key={region[0]}
          onClick={(e) => handleRegionClick(e, region)}
          className={`${selectedRegion[0] === region[0] ? "play-region-selected-design" : "non-selected-design"} ${
            selectedRegion[0] === region[0] && region[0] === "전체"
              ? "all-region-border"
              : selectedRegion[0] === region[0] && region[0] === "제주"
                ? "jeju-border"
                : ""
          }`}
        >
          {region.length === 1 ? region[0] : region.includes("세종") ? "대전/충청" : region.join("/")}
        </span>
      ))}
    </div>
  );

  return (
    <div className="responsive-container">
      <div className="play-region-select-container" ref={containerRef}>
        {innerWidth <= 768 ? (
          <>
            <div className="play-region-select-accordian" onClick={() => handleConditionSearchExpand()}>
              <p>{!isExpandClicked ? "전체" : "닫기"}&nbsp;</p>
              <div className="icon-wrapper">{!isExpandClicked ? <ArrowDropDownIcon sx={{ fontSize: 40 }} /> : <ArrowDropUpIcon sx={{ fontSize: 40 }} />}</div>
            </div>
            {isExpandClicked && regionSelectComponent}
          </>
        ) : (
          regionSelectComponent
        )}
      </div>
    </div>
  );
}
