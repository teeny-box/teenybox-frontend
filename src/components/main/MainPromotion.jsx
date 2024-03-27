import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MainPromotion.scss";
import { promotionUrl } from "../../apis/apiURLs";

function MainPromotion() {
  const [promotions, setPromotions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        // 소규모 연극 조회순 top 10
        const resViews = await fetch(`${promotionUrl}?limit=10&sortBy=views&sortOrder=desc&category=연극`);
        const dataViews = await resViews.json();
        if (!resViews.ok) {
          throw new Error("Failed to fetch promotions by views");
        }
        let newList = dataViews.promotions;

        // 소규모 연극 추천순 top 10
        const resLikes = await fetch(`${promotionUrl}?limit=10&sortBy=likes&sortOrder=desc&category=연극`);
        const dataLikes = await resLikes.json();
        if (!resLikes.ok) {
          throw new Error("Failed to fetch promotions by likes");
        }
        newList = [...newList, ...dataLikes.promotions];

        // 중복 제거
        newList = newList.reduce((newArr, current) => {
          if (newArr.findIndex(({ _id }) => _id === current._id) === -1) {
            newArr.push(current);
          }
          return newArr;
        }, []);

        // (조회수 + 추천수)가 0보다 큰 것만 필터링
        newList = newList.filter((promotion) => promotion.likes + promotion.views > 0);

        // 이미지가 있는 프로모션만 필터링
        newList = newList.filter((promotion) => promotion.image_url && promotion.image_url[0]);

        // (조회수 + 추천수) 높은 순으로 정렬
        newList.sort((a, b) => b.views + b.likes - (a.views + a.likes));

        setPromotions(newList);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  // 날짜 형식을 조정
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}`;
  };

  // 타이틀을 최대 14글자로 제한
  const limitTitleLength = (title, maxLength) => {
    if (title.length > maxLength) {
      return `${title.slice(0, maxLength)}...`;
    }
    return title;
  };

  // promotion-product 클릭 시 라우팅 처리
  const handleProductClick = (promotionNumber) => {
    const route = `/promotion/${promotionNumber}`;
    navigate(route);
  };

  // newList가 5개 이하인 경우에만 MainPromotion 컴포넌트를 숨깁니다
  if (promotions.length <= 5) {
    return null;
  }

  return (
    <div className="main-layout-container">
      <div className="main-title-box">
        <p className="main-title">소규모 추천 연극</p>
      </div>
      <div className="main-promotion-container">
        <div>
          <div className="promotion-box1">
            {promotions.length > 0 && (
              <div className="promotion-product1" onClick={() => handleProductClick(promotions[0].promotion_number)}>
                <div className="main-promotion1-img-box">
                  {promotions[0]?.image_url && <img src={promotions[0]?.image_url[0]} alt={promotions[0]?.play_title} />}
                </div>
                <p className="promotions-title">{limitTitleLength(promotions[0]?.play_title, 20)}</p>
                <p className="promotions-period">
                  {formatDate(promotions[0]?.start_date)} ~ {formatDate(promotions[0]?.end_date)}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="promotion-box2">
          {promotions.length > 1 &&
            promotions.slice(1, 4).map((promotion, index) => (
              <div key={index} className="promotion-product" onClick={() => handleProductClick(promotion.promotion_number)}>
                <div className="main-promotion-img-box">
                  {promotion.image_url && promotion.image_url[0] && <img src={promotion.image_url[0]} alt={promotion.play_title} />}
                </div>
                <p className="promotions-title">{limitTitleLength(promotion.play_title, 14)}</p>
                <p className="promotions-period">
                  {formatDate(promotion.start_date)} ~ {formatDate(promotion.end_date)}
                </p>
              </div>
            ))}
        </div>
        <div className="promotion-box3">
          {promotions.slice(4, 7).map((promotion, index) => (
            <div key={index} className="promotion-product" onClick={() => handleProductClick(promotion.promotion_number)}>
              <div className="main-promotion-img-box">
                {promotion.image_url && promotion.image_url[0] && <img src={promotion.image_url[0]} alt={promotion.play_title} />}
              </div>
              <p className="promotions-title">{limitTitleLength(promotion.play_title, 14)}</p>
              <p className="promotions-period">
                {formatDate(promotion.start_date)} ~ {formatDate(promotion.end_date)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MainPromotion;
