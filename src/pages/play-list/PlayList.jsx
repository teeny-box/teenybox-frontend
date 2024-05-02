import { useState, useEffect, useContext, useCallback, useMemo, useRef } from "react";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import MovieIcon from "@mui/icons-material/Movie";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import dayjs from "dayjs";
import "./PlayList.scss";
import { Helmet } from "react-helmet-async";
import ConditionSearch from "../../components/play-list/ConditionSearch";
import PlayListHeader from "../../components/play-list/PlayListHeader";
import PlayBox from "../../components/play-list/PlayBox";
import PaginationBox from "../../components/play-list/PaginationBox";
import RegionSelectBar from "../../components/play-list/RegionSelectBar";
import { AlertCustom } from "../../../src/components/common/alert/Alerts";
import Loading from "../../components/common/state/Loading";
import Empty from "../../components/common/state/Empty";
import { AppContext } from "../../App";
import { showUrl } from "../../apis/apiURLs";

/**
 * PlayList 컴포넌트는 다양한 연극을 탐색하고 표시하는 주요 기능을 제공합니다.
 * 사용자가 설정한 검색 조건에 따라 연극 데이터를 조회하고, 결과를 화면에 표시합니다.
 * 이 컴포넌트는 여러 하위 컴포넌트들과 상태들을 관리하면서, 사용자의 조건에 맞는 연극 정보를 제공합니다.
 *
 * @useContext AppContext - 전역 상태 관리 컨텍스트에서 연극 검색에 필요한 이전 쿼리 상태를 가져옵니다.
 * @useRef playListContainerRef - 컴포넌트의 DOM 참조를 저장하여, 필요시 스크롤 위치 조정 등에 사용합니다.
 * @useState 각종 상태 관리 - isLoading, plays, selectedRegion 등 다양한 상태를 관리합니다.
 * @useMemo buildQuery - 선택된 지역, 상태, 가격, 날짜 등의 사용자 조건을 바탕으로 API 호출을 위한 쿼리 문자열을 생성합니다.
 * @useCallback fetchPlays - 생성된 쿼리 문자열을 사용하여 서버로부터 연극 데이터를 비동기적으로 가져옵니다.
 *                          이 함수는 쿼리 문자열이 변경될 때만 재생성되어 불필요한 리렌더링을 방지합니다.
 * @useEffect - 컴포넌트 마운트 및 업데이트 시 필요한 부수 효과를 처리합니다. 예를 들어, 데이터 패칭, 이벤트 리스너 설정 등이 이에 해당합니다.
 */

export function PlayList() {
  const { prevPlayListQuery, setPrevPlayListQuery } = useContext(AppContext);
  const queryParams = new URLSearchParams(prevPlayListQuery);

  const playListContainerRef = useRef(null);

  // 로딩 상태 관리
  const [isLoading, setIsLoading] = useState(true);
  // 조회된 연극 데이터를 저장하는 상태
  const [plays, setPlays] = useState([]);
  // 사용자가 선택한 지역을 관리하는 상태
  const [selectedRegion, setSelectedRegion] = useState(
    !queryParams.has("region") ? ["전체"] : queryParams.getAll("region").includes("대전") ? ["대전", "충청", "세종"] : queryParams.getAll("region"),
  );
  // 사용자가 선택한 정렬 기준을 관리하는 상태
  const [sortStandard, setSortStandard] = useState(queryParams.get("order") ? queryParams.get("order") : "recent");
  // 현재 페이지 번호 관리
  const [curPage, setCurPage] = useState(queryParams.get("page") ? Number(queryParams.get("page")) : 1);
  // 총 연극 개수 상태
  const [playTotalCnt, setPlayTotalCnt] = useState(0);
  // 브라우저 화면의 너비를 관리하는 상태
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  // 발생 가능한 에러 상태
  const [error, setError] = useState("");
  // 에러 발생 시 알림을 표시할지 결정하는 상태
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  // 서버에 요청할 쿼리 문자열 상태
  // const [reqQuery, setReqQuery] = useState("");

  // 화면에 표시될 검색 조건 텍스트 및 옵션 정의
  const conditionTexts = [
    {
      division: "상태별",
      options: ["전체", "공연중", "공연예정", "공연완료"],
    },
    { division: "날짜별" },
    { division: "가격별" },
  ];

  // 사용자의 검색 조건을 관리하는 상태
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

  // 지역 선택 변경 시 검색 조건을 초기화하는 효과
  useEffect(() => {
    if (!prevPlayListQuery) {
      setConditions({ 가격별: [0, 100000], 상태별: ["공연중"] });
      setSortStandard("recent");
      setCurPage(1);
    }
  }, [selectedRegion]);

  const buildQuery = useMemo(() => {
    if (prevPlayListQuery) return prevPlayListQuery;

    const regionQuery = selectedRegion[0] === "전체" ? "" : selectedRegion.map((region) => `region=${region}`).join("&");

    const stateQuery = conditions["상태별"][0] === "전체" ? "" : conditions["상태별"].map((state) => `state=${state}`).join("&");

    const priceQuery = `lowPrice=${conditions["가격별"][0]}&highPrice=${conditions["가격별"][1]}`;

    const dateQuery = conditions["날짜별"] ? `date=${conditions["날짜별"]}` : "";

    return `?${[regionQuery, stateQuery, priceQuery, dateQuery].filter(Boolean).join("&")}&order=${sortStandard}&page=${curPage}&limit=24`;
  }, [prevPlayListQuery, selectedRegion, conditions, sortStandard, curPage]);

  const fetchPlays = useCallback(() => {
    setIsLoading(true);
    fetch(`${showUrl}${buildQuery}`)
      .then((res) => {
        if (!res.ok) throw new Error("연극 목록 가져오기에 실패하였습니다.");
        return res.json();
      })
      .then((data) => {
        setPlays(data.shows);
        setPlayTotalCnt(data.total);
        setError(null);
      })
      .catch((e) => {
        setError(e.message);
        setIsAlertOpen(true);
        setPlays([]);
        setPlayTotalCnt(0);
      })
      .finally(() => {
        setIsLoading(false);
        setPrevPlayListQuery(null);
      });
  }, [buildQuery]);

  useEffect(() => {
    fetchPlays();
  }, [fetchPlays]);

  // 화면 너비 조절 이벤트 리스너 설정
  useEffect(() => {
    const resizeListener = () => {
      setInnerWidth(window.innerWidth);
    };
    window.addEventListener("resize", resizeListener);
    return () => window.removeEventListener("resize", resizeListener);
  });

  // 지역 변경 함수
  const changeSelectedRegion = useCallback((e, region) => {
    setSelectedRegion(region);
    setSortStandard("recent");
    setCurPage(1);
    setConditions({
      가격별: [0, 100000],
      상태별: ["공연중"],
      날짜별: null,
    });
  }, []);

  return (
    <div className="play-list-container" ref={playListContainerRef}>
      <Helmet>
        <title>티니박스(TeenyBox) 연극찾기</title>
        <meta name="description" content="티니박스에서 다양한 연극을 찾아보세요!" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="티니박스(TeenyBox) 연극찾기" />
        <meta property="og:description" content="티니박스에서 다양한 연극을 찾아보세요!" />
      </Helmet>
      {error ? <AlertCustom title="tennybox.com 내용:" content={error} open={isAlertOpen} onclose={() => setIsAlertOpen(false)} severity={"error"} /> : null}
      {isLoading && <Loading />}
      {!isLoading && (
        <>
          <RegionSelectBar changeSelectedRegion={changeSelectedRegion} selectedRegion={selectedRegion} />
          <ConditionSearch
            sortStandard={sortStandard}
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
              <Chip icon={<LocalAtmIcon />} label={conditions["가격별"].map((price) => `${price} 원`).join(" ~ ")} />
            )}
          </Stack>
          {!playTotalCnt || error === "연극 목록 가져오기에 실패하였습니다." ? (
            <>
              <ConditionSearch count={playTotalCnt} setSortStandard={setSortStandard} sortStandard={sortStandard} />
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
                    query={buildQuery}
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
