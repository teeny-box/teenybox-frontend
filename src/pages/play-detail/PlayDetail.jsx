import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./PlayDetail.scss";
import { Helmet } from "react-helmet-async";
import Button from "@mui/material/Button"; // 추가된 부분
import PlayDetailTop from "../../components/play-detail/PlayDetailTop";
import PlayDetailNav from "../../components/play-detail/PlayDetailNav";
import PlayDetailInfo from "../../components/play-detail/PlayDetailInfo";
import PlayDetailImages from "../../components/play-detail/PlayDetailImages"; // 추가된 부분
import PlayReview from "../../components/play-detail/PlayReview";
import TheaterLocation from "../../components/play-detail/TheaterLocation";
import { UpButton } from "../../components/common/button/UpButton";
import { AlertCustom } from "../../components/common/alert/Alerts";
import Loading from "../../components/common/state/Loading";
import { AppContext } from "../../App";
import { NotFoundPage } from "../errorPage/NotFoundPage";
import { showUrl } from "../../apis/apiURLs";

export function PlayDetail() {
  const { userData } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const detailNavMenu = queryParams.get("tab") || "detail-info";
  const { playId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [playInfo, setPlayInfo] = useState({});
  const [error, setError] = useState(null);

  const getPlayDetailInfo = () => {
    fetch(`${showUrl}/${playId}`)
      .then((res) => res.json())
      .then((data) => {
        setPlayInfo(data.show);
        setTimeout(() => setIsLoading(false), 300);
      })
      .catch(() => {
        setIsLoading(false);
        setPlayInfo(null);
      });
  };

  useEffect(() => {
    getPlayDetailInfo();
  }, []);

  const handleDetailNavMenuClick = (e) => {
    const newQueryParams = new URLSearchParams(location.search);
    if (e.target.innerText === "상세정보") {
      newQueryParams.set("tab", "detail-info");
    } else if (e.target.innerText === "관람후기") {
      newQueryParams.set("tab", "reviews");
    } else if (e.target.innerText === "장소정보") {
      newQueryParams.set("tab", "location-info");
    }
    navigate(`?${newQueryParams.toString()}`);
  };

  const handleGoBack = () => {
    const previousPath = location.state?.from || "/play";
    navigate(previousPath);
  };

  return (
    <>
      <div className="play-detail-container">
        {error && <AlertCustom title="tennybox.com 내용:" content={error} open={true} onclose={() => setError(null)} severity={"error"} />}
        {!isLoading && playInfo && (
          <>
            <Helmet>
              <title>{playInfo.title?.replace(/\r/g, "")}</title>
              <meta name="description" content={playInfo.description?.slice(0, 50).replace(/\r/g, "")} />
              <meta property="og:type" content="website" />
              <meta property="og:title" content={playInfo.title?.slice(0, 50).replace(/\r/g, "")} />
              <meta property="og:site_name" content={playInfo.title?.slice(0, 50).replace(/\r/g, "")} />
              <meta property="og:description" content={playInfo.description?.slice(0, 50).replace(/\r/g, "")} />
              <meta property="og:image" content={playInfo.poster || "https://teeny-box.com/static/media/minilogo.c8da1ed0d7124e0acc3e.png"} />
            </Helmet>
            <UpButton />
            <PlayDetailTop
              showId={playInfo.showId}
              age={playInfo.age}
              start_date={playInfo.start_date}
              end_date={playInfo.end_date}
              location={playInfo.location}
              poster={playInfo.poster}
              price={playInfo.price}
              runtime={playInfo.runtime}
              state={playInfo.state}
              title={playInfo.title}
              reviews={playInfo.reviews}
              isLoggedIn={userData}
              averageRate={playInfo.avg_rating}
            />
            <PlayDetailNav selected={detailNavMenu} handleClick={handleDetailNavMenuClick} />
            <div className="play-detail-main-box">
              {detailNavMenu === "detail-info" && (
                <div className="play-detail-content">
                  <div className="play-detail-info-container">
                    <PlayDetailInfo
                      cast={playInfo.cast}
                      company={playInfo.company}
                      description={playInfo.description}
                      schedule={playInfo.schedule}
                      seat_cnt={playInfo.seat_cnt}
                      state={playInfo.state}
                    />
                  </div>
                  <div className="detail-poster-container">
                    <PlayDetailImages title={playInfo.title} detail_images={playInfo.detail_images} />
                  </div>
                  <div className="goback-container">
                    <Button
                      variant="contained"
                      onClick={handleGoBack}
                      sx={{
                        width: "100px",
                        color: "#333333",
                        background: "#fff",
                        "&:hover": {
                          background: "#cccccc", // hover 시 배경색
                          color: "#000000", // hover 시 텍스트 색상
                        },
                      }}
                    >
                      목록
                    </Button>
                  </div>
                </div>
              )}

              {detailNavMenu === "reviews" && (
                <PlayReview
                  showId={playInfo.showId}
                  isLoggedIn={userData}
                  author={userData?.nickname}
                  averageRate={playInfo.avg_rating}
                  state={playInfo.state}
                  userId={userData?.user_id}
                  getPlayDetailInfo={getPlayDetailInfo}
                />
              )}
              {detailNavMenu === "location-info" && (
                <TheaterLocation
                  theaterLocation={{
                    lat: playInfo.latitude,
                    lng: playInfo.longitude,
                  }}
                  locationName={playInfo.location}
                />
              )}
            </div>
          </>
        )}
        {!isLoading && !playInfo && (
          <div className="get-playInfo-error">
            <NotFoundPage />
          </div>
        )}
        {!error && isLoading && <Loading />}
      </div>
    </>
  );
}
