import { Link } from "react-router-dom";
import "./FixedTopBanner.scss";

export function FixedTopBanner({ linkTo }) {
  return (
    <div className="fixed-top-banner-outbox">
      <Link to={linkTo} className="fixed-top-banner">
        <p className="h2">📢 티니박스(TeenyBox) 서비스 오픈!</p>
        <div className="description">
          <p>
            안녕하세요😊 개발자 취준생이 모여서 만든 연극 정보 사이트 “티니박스”를 소개합니다! 티니박스는 연극인들을 위한 활발한 커뮤니티를 만들자는 목적으로
            제작되었으며, 연극을 사랑하는 사람들이 연극을 찾고 홍보할 수 있는 소규모 연극 커뮤니티 사이트입니다.
          </p>
        </div>
      </Link>
    </div>
  );
}
