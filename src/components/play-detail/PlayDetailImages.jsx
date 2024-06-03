import React from "react";
import "./PlayDetailImages.scss";

export default function PlayDetailImages({ title, detail_images }) {
  return (
    <div>
      {detail_images.length && (
        <div className="detail-poster">
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
