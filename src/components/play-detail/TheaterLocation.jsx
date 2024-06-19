/* global kakao */
import React, { useEffect } from "react";
import "./TheaterLocation.scss";

export default function TheaterLocation({ theaterLocation, locationName }) {
  const { lat, lng } = theaterLocation;

  useEffect(() => {
    kakao.maps.load(() => {
      const container = document.getElementById("play-detail-kakao-map");
      const options = {
        center: new kakao.maps.LatLng(lat, lng),
        level: 3,
      };
      const map = new kakao.maps.Map(container, options);

      const markerPosition = new kakao.maps.LatLng(lat, lng);
      const marker = new kakao.maps.Marker({
        position: markerPosition,
      });
      marker.setMap(map);

      const iwContent = `<div style="padding: 10px 5px 10px 5px; display: flex; flex-direction: column; height: 80px;"><div>🚩 ${locationName}</div><div style='padding-top: 10px;'><a href="https://map.kakao.com/link/map/${locationName},${lat},${lng}" style="color: blue;" target="_blank">🗺️ 큰지도보기</a></div><div style='padding-top: 10px;'><a href="https://map.kakao.com/link/to/${locationName},${lat},${lng}" style="color: blue;" target="_blank">🚕 길찾기</a></div></div>`;
      const iwPosition = new kakao.maps.LatLng(lat, lng);

      const infowindow = new kakao.maps.InfoWindow({
        position: iwPosition,
        content: iwContent,
      });

      infowindow.open(map);

      // 초기화 시 스크롤 비활성화
      map.setZoomable(false);

      // 지도 클릭 시 스크롤 활성화
      kakao.maps.event.addListener(map, "click", () => {
        map.setZoomable(true);
      });

      // 지도를 벗어났을 때 스크롤 비활성화
      container.addEventListener("mouseleave", () => {
        map.setZoomable(false);
      });
    });
  }, [lat, lng, locationName]);

  return (
    <div className="play-detail-kakao-map-container">
      <h3>극장 위치</h3>
      <h5>{locationName}</h5>
      <div id="play-detail-kakao-map" className="play-detail-kakao-map">
        <div></div>
      </div>
    </div>
  );
}
