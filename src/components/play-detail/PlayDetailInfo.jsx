import React from "react";
import "./PlayDetailInfo.scss";

export default function PlayInfo({ title, cast, company, creator, detail_images, schedule, state }) {
  return (
    <div className="play-detail-info">
      {schedule && (
        <div className="play-time-info">
          <h3>공연 시간 정보</h3>
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
      {creator && (
        <div className="summary">
          <h3>제작진</h3>
          <p>{creator}</p>
        </div>
      )}
      {company && (
        <div className="summary">
          <h3>제작사</h3>
          <p>{company}</p>
        </div>
      )}
      {detail_images.length && (
        <div className="detail-poster">
          <h3>소개 포스터</h3>
          <div className="detail-poster-img">
            {detail_images.map((image, idx) => (
              <img src={image} alt={`${title} 소개 포스터 ${idx + 1}`} key={idx} /> // 여기서 수정: 화살표 함수 블록 제거
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
