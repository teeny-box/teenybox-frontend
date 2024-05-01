import React from "react";
import "./SearchResultHeader.scss";
import search_icon from "../../../assets/img/search_icon.svg";

export default function SearchResultHeader({ searchKeyword }) {
  return (
    <div className="search-result-header">
      <img src={search_icon} />
      <p className="t1">
        &apos;{searchKeyword}&apos; <span>검색 결과</span>
      </p>
    </div>
  );
}
