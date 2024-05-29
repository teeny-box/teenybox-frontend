import React, { createContext } from "react";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import ConditionSearchFrame from "./condition-search-material/ConditionSearchFrame";
import "./ConditionSearch.scss";

// 조건 검색 시 사용할 context (컴포넌트 바깥에 따로 적어주어 export 해야지 undefined로 뜨지 않는다.)
export const ConditionContext = createContext();

export default function ConditionSearch({ isExpandClicked, setIsExpandClicked, conditionTexts, innerWidth, conditions, setConditions }) {
  const handleConditionSearchExpand = () => {
    setIsExpandClicked(!isExpandClicked);
  };

  return (
    <>
      <div className="condition-search-header">
        <ManageSearchIcon sx={{ fontSize: 32 }} />
        <span>&nbsp;조건 검색</span>
      </div>
      <div className="condition-search-main">
        <>
          <div
            className="condition-search-accordian"
            style={isExpandClicked ? { borderBottom: "1px solid #FFB400" } : {}}
            onClick={() => handleConditionSearchExpand()}
          >
            <p>{!isExpandClicked ? "조건 검색 펼치기" : "조건 검색 접기"}&nbsp;</p>
            {!isExpandClicked ? <KeyboardDoubleArrowDownIcon /> : <KeyboardDoubleArrowUpIcon />}
          </div>
          {isExpandClicked && (
            <div>
              {conditionTexts.map((conditionText, idx) => (
                <ConditionContext.Provider
                  value={{
                    conditions,
                    setConditions,
                  }}
                  key={idx}
                >
                  <ConditionSearchFrame key={idx} division={conditionText.division} options={conditionText.options} innerWidth={innerWidth} />
                </ConditionContext.Provider>
              ))}
            </div>
          )}
        </>
      </div>
    </>
  );
}
