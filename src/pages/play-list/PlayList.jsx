import React, { useState, useEffect, useContext, useRef, useMemo, useCallback } from "react";
import "./PlayList.scss";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import MovieIcon from "@mui/icons-material/Movie";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import dayjs from "dayjs";
import ConditionSearch from "../../components/play-list/ConditionSearch";
import PlayListHeader from "../../components/play-list/PlayListHeader";
import PlayBox from "../../components/play-list/PlayBox";
import PaginationBox from "../../components/play-list/PaginationBox";
import RegionSelectBar from "../../components/play-list/RegionSelectBar";
import { AlertCustom } from "../../../src/components/common/alert/Alerts";
import Loading from "../../components/common/state/Loading";
import { AppContext } from "../../App";
import Empty from "../../components/common/state/Empty";
import { showUrl } from "../../apis/apiURLs";

/**
 * 연극 목록을 보여주는 컴포넌트입니다.
 *
 * @returns {JSX.Element} 연극 목록 컴포넌트
 */
export function PlayList() {
  const { prevPlayListQuery, setPrevPlayListQuery } = useContext(AppContext);
  const queryParams = new URLSearchParams(prevPlayListQuery);

  const playListContainerRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true); // 데이터 로딩 상태
  const [plays, setPlays] = useState([]); // 연극 목록
  const [selectedRegion, setSelectedRegion] = useState(
    !queryParams.has("region") ? ["전체"] : queryParams.getAll("region").includes("대전") ? ["대전", "충청", "세종"] : queryParams.getAll("region"),
  ); // 선택된 지역
  const [sortStandard, setSortStandard] = useState(queryParams.get("order") ? queryParams.get("order") : "recent"); // 정렬 기준
  const [curPage, setCurPage] = useState(queryParams.get("page") ? Number(queryParams.get("page")) : 1); // 현재 페이지
  const [playTotalCnt, setPlayTotalCnt] = useState(0); // 연극 총 개수
  const [innerWidth, setInnerWidth] = useState(window.innerWidth); // 창 너비
  const [error, setError] = useState(""); // 에러 메시지
  const [isAlertOpen, setIsAlertOpen] = useState(false); // 알림창 열림 여부
  const [reqQuery, setReqQuery] = useState(""); // API 요청 쿼리
  const [isExpandClicked, setIsExpandClicked] = useState(false); // 확장 버튼 클릭 여부

  /**
   * 검색 조건 텍스트 및 옵션 설정
   */
  const conditionTexts = useMemo(
    () => [
      {
        division: "상태별",
        options: ["전체", "공연중", "공연예정", "공연완료"],
      },
      { division: "날짜별" },
      { division: "가격별" },
    ],
    [],
  );

  /**
   * 검색 조건 상태 설정
   */
  const [conditions, setConditions] = useState({
    가격별:
      queryParams.get("lowPrice") && queryParams.get("highPrice")
        ? [+queryParams.get("lowPrice"), +queryParams.get("highPrice")]
        : !+queryParams.get("lowPrice") && +queryParams.get("highPrice")
          ? [0, +queryParams.get("highPrice")]
          : !+queryParams.get("highPrice") && +queryParams.get("lowPrice")
            ? [+queryParams.get("lowPrice"), 100000]
            : [0, 100000],
    상태별: queryParams.has("state") ? queryParams.getAll("state") : ["공연중"],
    날짜별: queryParams.get("date") ? queryParams.get("date") : null,
  });

  /**
   * API에서 연극 데이터를 가져오는 함수
   */
  const fetchData = useCallback(() => {
    let queryParam = "";

    if (prevPlayListQuery) {
      queryParam = prevPlayListQuery;
      setReqQuery(queryParam);
    } else {
      const regionQuery =
        selectedRegion[0] === "전체"
          ? ""
          : selectedRegion.length === 1
            ? `region=${selectedRegion}&`
            : selectedRegion.map((region) => `region=${region}&`).reduce((acc, cur) => acc + cur);

      const stateQuery =
        conditions["상태별"][0] === "전체"
          ? ""
          : conditions["상태별"].length === 1
            ? `state=${conditions["상태별"][0]}&`
            : conditions["상태별"].map((state) => `state=${state}&`).reduce((acc, cur) => acc + cur);

      const lowPriceQuery = conditions["가격별"][0] === 0 ? "" : `lowPrice=${conditions["가격별"][0]}&`;

      const highPriceQuery = conditions["가격별"][1] === 100000 ? "" : `highPrice=${conditions["가격별"][1]}&`;

      const dateQuery = conditions["날짜별"] ? `&date=${conditions["날짜별"]}&` : "";

      queryParam = `?${regionQuery}${stateQuery}${lowPriceQuery}${highPriceQuery}order=${sortStandard}${dateQuery}&page=${curPage}&limit=24`;

      setReqQuery(queryParam);
    }

    fetch(`${showUrl}${queryParam}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        setError("연극 목록 가져오기에 실패하였습니다.");
        return null;
      })
      .then((data) => {
        setIsLoading(true);
        setPlays(data.shows);
        setPlayTotalCnt(data.total);
        setIsLoading(false);
        setError(null);
      })
      .finally(() => setPrevPlayListQuery(null))
      .catch(() => {
        setError("연극 목록 가져오기에 실패하였습니다.");
        setPlays(null);
        setPlayTotalCnt(0);
        setIsAlertOpen(true);
        setIsLoading(false);
      });
  }, [prevPlayListQuery, selectedRegion, sortStandard, curPage, conditions]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!prevPlayListQuery) {
      setSortStandard("recent");
      setConditions({
        가격별: [0, 100000],
        상태별: ["공연중"],
        날짜별: null,
      });
      setCurPage(1);
    }
  }, [selectedRegion]);

  useEffect(() => {
    if (!prevPlayListQuery) {
      setCurPage(1);
    }
  }, [conditions, sortStandard]);

  useEffect(() => {
    const resizeListener = () => {
      setInnerWidth(window.innerWidth);
    };
    window.addEventListener("resize", resizeListener);

    return () => {
      window.removeEventListener("resize", resizeListener);
    };
  }, []);

  /**
   * 선택된 지역 변경 시 실행되는 콜백 함수
   *
   * @param {Event} e 이벤트
   * @param {string[]} region 선택된 지역
   */
  const changeSelectedRegion = useCallback((e, region) => {
    setSelectedRegion(region);
    setSortStandard("recent");
    setCurPage(1);
    setConditions({
      가격별: [0, 100000],
      상태별: ["공연중"],
      날짜별: null,
    });
    setIsExpandClicked(false);
  }, []);

  return (
    <div className="play-list-container" ref={playListContainerRef}>
      {error ? <AlertCustom title="tennybox.com 내용:" content={error} open={isAlertOpen} onclose={() => setIsAlertOpen(false)} severity={"error"} /> : null}
      {isLoading && <Loading />}
      {!isLoading && (
        <>
          <RegionSelectBar changeSelectedRegion={changeSelectedRegion} selectedRegion={selectedRegion} />
          <ConditionSearch
            isExpandClicked={isExpandClicked}
            setIsExpandClicked={setIsExpandClicked}
            conditionTexts={conditionTexts}
            innerWidth={innerWidth}
            conditions={conditions}
            setConditions={setConditions}
            selectedRegion={selectedRegion}
          />
          <Stack direction="row" spacing={2} className="adapted-conditions">
            {conditions["상태별"][0] === "전체" ? (
              <Chip icon={<MovieIcon />} label="공연 상태 전체" />
            ) : (
              conditions["상태별"].map((state, idx) => <Chip icon={<MovieIcon />} label={state} key={idx} />)
            )}
            {conditions["날짜별"] ? <Chip icon={<CalendarMonthIcon />} label={conditions["날짜별"]} /> : null}
            {conditions["가격별"][0] === 0 && conditions["가격별"][1] === 100000 ? (
              <Chip icon={<LocalAtmIcon />} label="가격 전체" />
            ) : conditions["가격별"][1] === 100000 ? (
              <Chip icon={<LocalAtmIcon />} label={`${conditions["가격별"][0]}원 ~ 100000원 이상`} />
            ) : (
              <Chip icon={<LocalAtmIcon />} label={conditions["가격별"].map((price) => `${price}원`).join(" ~ ")} />
            )}
          </Stack>
          {!playTotalCnt || error === "연극 목록 가져오기에 실패하였습니다." ? (
            <>
              <PlayListHeader count={playTotalCnt} setSortStandard={setSortStandard} sortStandard={sortStandard} />
              <div className="play-no-exsist">
                <Empty />
              </div>
            </>
          ) : null}
          {playTotalCnt > 0 ? (
            <>
              <PlayListHeader count={playTotalCnt} setSortStandard={setSortStandard} sortStandard={sortStandard} />
              <div className="play-list-main">
                {plays.map((play) => (
                  <PlayBox
                    key={play.showId}
                    playInfo={{
                      playId: play.showId,
                      imgSrc: play.poster,
                      title: play.title,
                      place: play.location,
                      period: `${dayjs(play.start_date).format("YYYY-MM-DD")} ~ ${dayjs(play.end_date).format("YYYY-MM-DD")}`,
                      price: play.price,
                      state: play.state,
                    }}
                    query={reqQuery}
                    setPrevPlayListQuery={setPrevPlayListQuery}
                  />
                ))}
              </div>
              {playTotalCnt ? (
                <PaginationBox
                  innerWidth={innerWidth}
                  playsCount={playTotalCnt}
                  setCurPage={setCurPage}
                  curPage={curPage}
                  playListContainerRef={playListContainerRef}
                />
              ) : null}
            </>
          ) : null}
        </>
      )}
    </div>
  );
}
