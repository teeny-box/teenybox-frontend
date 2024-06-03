import React from "react";
import "./PlayDetailInfo.scss";

export default function PlayInfo({ cast, company, schedule, state }) {
  return (
    <div className="play-detail-info">
      {schedule && (
        <div className="play-time-info">
          <h3>공연 시간 </h3>
          <p>{schedule}</p>
        </div>
      )}
      {state && (
        <div>
          <h3>공연 상태</h3>
          <p>{state}</p>
        </div>
      )}
      {cast[0] && (
        <div className="summary">
          <h3>출연진</h3>
          {cast.map((actor, idx) => (
            <p key={idx}>{actor}</p>
          ))}
        </div>
      )}

      {company && (
        <div className="summary">
          <h3>제작사</h3>
          <p>{company}</p>
        </div>
      )}
    </div>
  );
}
