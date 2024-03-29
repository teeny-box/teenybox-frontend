import "./MainBanner.scss";

function MainBanner() {
  return (
    <div className="banner-img-container">
      <img
        className="banner-img"
        src={process.env.PUBLIC_URL + "/banner.png"}
        alt="banner-image"
      ></img>
      <div className="banner-text-box">
        <p>
          요즘 볼 만한 연극 있나<span className="banner-point-text">?</span>
        </p>
        <p>
          티니박스에서 발견하세요<span className="banner-point-text">!</span>
        </p>
      </div>
    </div>
  );
}

export default MainBanner;
