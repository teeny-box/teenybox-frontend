import React, { useState, useEffect } from "react";
import "./MainReview.scss";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";
import { reviewUrl, showUrl } from "../../apis/apiURLs";

const MainReview = () => {
  const [sliderIndex, setSliderIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [shows, setShows] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviewData = async () => {
      try {
        const reviewResponse = await fetch(reviewUrl);
        if (!reviewResponse.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const reviewData = await reviewResponse.json();
        const filteredReviews = reviewData.data.filter((review) => review.rate >= 3);
        const limitedReviews = filteredReviews.slice(0, 10);

        const showIds = limitedReviews.map((review) => review.show_id);
        const showPromises = showIds.map((showId) => fetch(`${showUrl}/${showId}`));
        const showResponses = await Promise.all(showPromises);
        const showData = await Promise.all(showResponses.map((response) => response.json()));
        const showDetails = showData.reduce((acc, curr, index) => {
          acc[showIds[index]] = curr;
          return acc;
        }, {});

        // 순서대로 재배열
        const reorderedReviews = [
          ...limitedReviews.slice(8), // 9번,10번
          ...limitedReviews, // 1번부터 10번까지
          ...limitedReviews.slice(0, 2), // 1번,2번
        ];

        setReviews(reorderedReviews);
        setShows(showDetails); // 해당 리뷰들에 대한 연극 상세 정보
        
      } catch (error) {
        console.error(error);
      }
    };
    fetchReviewData();
  }, []);

  // 무한루프 슬라이드 구현을 위해 isAnimating 상태에 따라 다른 스타일을 적용
  const wrapperStyles = isAnimating
    ? {
        display: "flex",
        gap: "30px",
        paddingLeft: "277.5px",
        paddingRight: "277.5px",
        transform: `translateX(-${sliderIndex * 555}px)`,
        transition: "transform 0.4s ease",
      }
    : {
        display: "flex",
        gap: "30px",
        paddingLeft: "277.5px",
        paddingRight: "277.5px",
        transform: `translateX(-${sliderIndex * 555}px)`,
      };

  useEffect(() => {
    if (sliderIndex === 12) {
      setTimeout(() => {
        setSliderIndex(2);
        setIsAnimating(false);
      }, 400);
    } else if (sliderIndex === 0) {
      setTimeout(() => {
        setSliderIndex(10);
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

  const trimText = (text, maxLength) => (text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`);

  const handleClickMoreReview = (showId) => {
    navigate(`/play/${showId}?tab=reviews`);
  };

  const handleShowClick = (showId) => {
    navigate(`/play/${showId}`);
  };

  return (
    <div className="main-review-container">
      <div className="main-title-box-center">
        <div className="main-center-title">
          <p className="main-sub-title">따끈따끈한 후기</p>
          <p className="main-title">실시간 리뷰</p>
        </div>
      </div>
      <div className="review-slide-container">
        <ArrowBackIosIcon onClick={handleLeftClick} className="slide-left-icon" style={{ fontSize: 32 }} />
        <div className="review-box-wrap">
          <div style={wrapperStyles}>
            {reviews.map((review, index) => (
              <div key={index} className="review-box">
                <div className="review-img-box">
                  {shows[review.show_id] && shows[review.show_id].show && (
                    <img src={shows[review.show_id].show.poster} alt="review-thumbnail" onClick={() => handleShowClick(review.show_id)} />
                  )}
                </div>
                <div className="main-review-content">
                  <div className="main-review-header">
                    <p className="review-show-title">{trimText(review.show_title, 7)}</p>
                    {shows[review.show_id] && shows[review.show_id].show && (
                    <p className="review-show-period">
                      {`${new Date(shows[review.show_id].show.start_date).toLocaleDateString()} ~ ${new Date(shows[review.show_id].show.end_date).toLocaleDateString()}`}
                      </p>
                      )}
                  </div>
                  <div className="main-review-main" onClick={() => handleClickMoreReview(review.show_id)}>
                    <div className="review-main-top">
                      <p className="main-review-title">{trimText(review.title, 10)}</p>
                      <Rating
                        className="main-review-rating"
                        value={review.rate}
                        readOnly
                        precision={0.5}
                        size="inherit"
                        sx={{
                          "& .MuiRating-iconFilled": {
                            color: "#eee",
                          },
                          "& .MuiRating-iconEmpty": {
                            color: "#bbb",
                          },
                        }}
                      />
                    </div>
                    <p className="review-main-mid">{trimText(review.content, 70)}</p>
                    <div className="review-main-bottom">
                      <p>{trimText(review.user_nickname, 6)}</p>
                    </div>
                  </div>
                  <div className="main-review-footer">
                    <a
                      href={`https://tickets.interpark.com/contents/search?keyword=${review.show_title}&start=0&rows=20`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="contained" color="moreDarkGray" sx={{ width: "100px", height: "40px", color: "#eee", borderRadius: "7px" }}>
                        예매하기
                      </Button>
                    </a>
                    <Button
                      variant="contained"
                      color="darkGray"
                      sx={{ width: "100px", height: "40px", color: "#111111", borderRadius: "7px" }}
                      onClick={() => handleClickMoreReview(review.show_id)}
                    >
                      후기더보기
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <ArrowForwardIosIcon onClick={handleRightClick} className="slide-right-icon" style={{ fontSize: 32 }} />
      </div>
    </div>
  );
};

export default MainReview;
