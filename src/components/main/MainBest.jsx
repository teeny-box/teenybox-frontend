import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MainBest.scss";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { showUrl } from "../../apis/apiURLs";

function MainBest() {
  const [sliderIndex, setSliderIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(true);
  const [shows, setShows] = useState([]); // API로부터 가져온 공연 데이터를 저장할 상태
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);

  const navigate = useNavigate();

  // 해당연극 상세페이지로 이동
  const handleShowClick = (showId) => {
    navigate(`/play/${showId}`);
  };

  // 화면 너비 조절 이벤트를 듣도록 하기
  useEffect(() => {
    const resizeListener = () => {
      setInnerWidth(window.innerWidth);
    };
    window.addEventListener("resize", resizeListener);
  });

  const slideWidth =
    innerWidth > 1700
      ? 1300
      : innerWidth > 1300
        ? 1100
        : innerWidth > 1024
          ? innerWidth - 200
          : innerWidth > 768
            ? innerWidth - 80
            : innerWidth > 480
              ? innerWidth - 80
              : innerWidth - 40;

  // 무한루프 슬라이드 구현을 위해 isAnimating 상태에 따라 다른 스타일을 적용
  const wrapperStyles = isAnimating
    ? {
        transform: `translateX(-${sliderIndex * slideWidth}px)`,
        transition: "transform 0.4s ease",
      }
    : {
        transform: `translateX(-${sliderIndex * slideWidth}px)`,
      };

  useEffect(() => {
    if (sliderIndex === 4) {
      setTimeout(() => {
        setSliderIndex(1);
        setIsAnimating(false);
      }, 400);
    } else if (sliderIndex === 0) {
      setTimeout(() => {
        setSliderIndex(3);
        setIsAnimating(false);
      }, 400);
    }
  }, [sliderIndex]);

  // 슬라이드 좌 우 이동 헨들러
  const handleLeftClick = () => {
    setIsAnimating(true);
    setSliderIndex((prevIndex) => prevIndex - 1);
  };

  const handleRightClick = () => {
    setIsAnimating(true);
    setSliderIndex((prevIndex) => prevIndex + 1);
  };

  useEffect(() => {
    fetch(`${showUrl}/rank`)
      .then((res) => res.json())
      .then((data) => {
        const rankedShows = data.shows;
        // 연극을 rank에 따라 정렬
        rankedShows.sort((a, b) => a.rank - b.rank);

        // 상위 18개 항목 선택
        const top18Shows = rankedShows.slice(0, 18);

        // 각 연극에 인덱스 기반 순위 부여
        const showsWithRank = top18Shows.map((show, index) => ({
          ...show,
          newRank: index + 1,
        }));

        // 순서대로 재배열
        const reorderedShows = [
          ...showsWithRank.slice(12), // 13번부터 18번까지
          ...showsWithRank, // 1번부터 18번까지
          ...showsWithRank.slice(0, 6), // 1번부터 6번까지
        ];

        setShows(reorderedShows);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      {innerWidth > 1024 ? (
        <div className="main-layout-container">
          <div className="main-title-box">
            <div>
              <p className="main-sub-title">보고 또 봐도 좋은</p>
              <p className="main-title">국내 베스트 연극</p>
            </div>
            <div className="main-slide-btn-box">
              <ArrowBackIosNewIcon onClick={handleLeftClick} className="slide-icon" />
              <ArrowForwardIosIcon onClick={handleRightClick} className="slide-icon" />
            </div>
          </div>
          <div className="main-play-container">
            <div style={wrapperStyles} className="slide-wrapper">
              {shows.map((show, index) => (
                <div key={index} className="main-play-box" onClick={() => handleShowClick(show.showId)}>
                  <div className="main-play-img-box">
                    <img src={show.poster} alt={show.title} />
                    <p className="best-overlay-rank">{show.newRank}</p>
                  </div>
                  <p className="main-play-title">{show.title}</p>
                  <p className="main-play-period">{`${new Date(show.start_date).toLocaleDateString()} ~ ${new Date(show.end_date).toLocaleDateString()}`}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="slide-info-box">
            <p className={`slide-info ${sliderIndex === 4 || sliderIndex === 1 ? "active" : ""}`}>.</p>
            <p className={`slide-info ${sliderIndex === 2 ? "active" : ""}`}>.</p>
            <p className={`slide-info ${sliderIndex === 3 || sliderIndex === 0 ? "active" : ""}`}>.</p>
          </div>
        </div>
      ) : (
        <div className="main-layout-container">
          <div className="main-title-box">
            <div>
              <p className="main-sub-title">보고 또 봐도 좋은</p>
              <p className="main-title">국내 베스트 연극</p>
            </div>
          </div>
          <div className="main-play-container">
            <div className="slide-wrapper">
              {shows.slice(6, 24).map((show, index) => (
                <div key={index} className="main-play-box" onClick={() => handleShowClick(show.showId)}>
                  <div className="main-play-img-box">
                    <img src={show.poster} alt={show.title} />
                    <p className="best-overlay-rank">{show.newRank}</p>
                  </div>
                  <p className="main-play-title">{show.title}</p>
                  <p className="main-play-period">{`${new Date(show.start_date).toLocaleDateString()} ~ ${new Date(show.end_date).toLocaleDateString()}`}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MainBest;
