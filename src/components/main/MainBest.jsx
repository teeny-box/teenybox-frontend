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
  const [clientWidth, setClientWidth] = useState(document.documentElement.clientWidth);

  const navigate = useNavigate();

  const handleShowClick = (showId) => {
    navigate(`/play/${showId}`);
  };

  useEffect(() => {
    const resizeListener = () => {
      setClientWidth(document.documentElement.clientWidth);
    };
    window.addEventListener("resize", resizeListener);

    return () => window.removeEventListener("resize", resizeListener);
  }, []);

  const slideWidth =
    clientWidth > 1700
      ? 1300
      : clientWidth > 1300
        ? 1100
        : clientWidth > 1024
          ? clientWidth - 200
          : clientWidth > 768
            ? clientWidth - 80
            : clientWidth > 480
              ? clientWidth - 80
              : clientWidth - 40;

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
        rankedShows.sort((a, b) => a.rank - b.rank);

        const top18Shows = rankedShows.slice(0, 18);
        const showsWithRank = top18Shows.map((show, index) => ({
          ...show,
          newRank: index + 1,
        }));

        const reorderedShows = [...showsWithRank.slice(12), ...showsWithRank, ...showsWithRank.slice(0, 6)];

        setShows(reorderedShows);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      {clientWidth > 1024 ? (
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
