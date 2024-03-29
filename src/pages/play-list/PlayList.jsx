import { useState, useEffect, useContext, useRef } from "react";
import "./PlayList.scss";
import ConditionSearch from "../../components/play-list/ConditionSearch";
import PlayListHeader from "../../components/play-list/PlayListHeader";
import PlayBox from "../../components/play-list/PlayBox";
import PaginationBox from "../../components/play-list/PaginationBox";
import RegionSelectBar from "../../components/play-list/RegionSelectBar";
import { AlertCustom } from "../../../src/components/common/alert/Alerts";
import Loading from "../../components/common/state/Loading";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import MovieIcon from "@mui/icons-material/Movie";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { AppContext } from "../../App";
import dayjs from "dayjs";
import Empty from "../../components/common/state/Empty";
import { showUrl } from "../../apis/apiURLs";

// 홍보, 커뮤니티, 마이페이지, 검색 페이지, 로그인 페이지, 홈 페이지 접속 시 setPrevPlayListQuery(null)로 설정하기
export function PlayList() {
  const { prevPlayListQuery, setPrevPlayListQuery } = useContext(AppContext);
  const queryParams = new URLSearchParams(prevPlayListQuery);

  const playListContainerRef = useRef(null);

  // 로딩중 여부
  const [isLoading, setIsLoading] = useState(true);
  // 전체 연극들
  const [plays, setPlays] = useState([]);
  // 선택된 지역
  const [selectedRegion, setSelectedRegion] = useState(
    !queryParams.has("region")
      ? ["전체"]
      : queryParams.getAll("region").includes("대전")
      ? ["대전", "충청", "세종"]
      : queryParams.getAll("region")
  );
  // 선택된 정렬 기준 (최신순, 낮은 가격순, 종료 임박순, 인기순)
  const [sortStandard, setSortStandard] = useState(
    queryParams.get("order") ? queryParams.get("order") : "recent"
  );
  // 현재 페이지
  const [curPage, setCurPage] = useState(
    queryParams.get("page") ? Number(queryParams.get("page")) : 1
  );
  // 가져와지는 총 연극 개수
  const [playTotalCnt, setPlayTotalCnt] = useState(0);
  // 현재 화면 너비에 따라 다르게 UI가 보여져야 하므로 innerWidth 상태도 정의
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  // fetch시 에러 상태 저장
  const [error, setError] = useState("");
  // 에러 발생 시 창을 띄우기 위한 상태
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  // 요청을 보내는 url
  const [reqQuery, setReqQuery] = useState("");

  // 화면에 띄울 조건 검색 텍스트
  const conditionTexts = [
    {
      division: "상태별",
      options: ["전체", "공연중", "공연예정", "공연완료"],
    },
    { division: "날짜별" },
    { division: "가격별" },
  ];

  // 조건 검색 상태 정의
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

  // 지역이 바뀌면 조건검색 부분 초기화
  useEffect(() => {
    if (!prevPlayListQuery) {
      setConditions({ 가격별: [0, 100000], 상태별: ["공연중"] });
      setSortStandard("recent");
      setCurPage(1);
    }
  }, [selectedRegion]);

  // 연극 데이터 받아오기
  useEffect(() => {
    let reqQuery = "";

    if (prevPlayListQuery) {
      reqQuery = prevPlayListQuery;
      setReqQuery(reqQuery);
    } else {
      const regionQuery =
        selectedRegion[0] === "전체"
          ? ""
          : selectedRegion.length === 1
          ? `region=${selectedRegion}&`
          : selectedRegion
              .map((region) => `region=${region}&`)
              .reduce((acc, cur) => acc + cur);

      const stateQuery =
        conditions["상태별"][0] === "전체"
          ? ""
          : conditions["상태별"].length === 1
          ? `state=${conditions["상태별"][0]}&`
          : conditions["상태별"]
              .map((state) => `state=${state}&`)
              .reduce((acc, cur) => acc + cur);

      const lowPriceQuery =
        conditions["가격별"][0] === 0
          ? ""
          : `lowPrice=${conditions["가격별"][0]}&`;

      const highPriceQuery =
        conditions["가격별"][1] === 100000
          ? ""
          : `highPrice=${conditions["가격별"][1]}&`;

      const dateQuery = conditions["날짜별"]
        ? `&date=${conditions["날짜별"]}&`
        : "";

      reqQuery = `?${regionQuery}${stateQuery}${lowPriceQuery}${highPriceQuery}order=${sortStandard}${dateQuery}&page=${curPage}&limit=24`;

      setReqQuery(reqQuery);
    }

    fetch(`${showUrl}${reqQuery}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          setError("연극 목록 가져오기에 실패하였습니다.");
        }
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
  }, [selectedRegion, sortStandard, curPage, conditions]);

  // 지역이 바뀌면 클릭되어 있는 날짜 상태를 null로 다시 초기화하기 + 정렬 기준 초기화 + 조건검색 초기화
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

  // 페이지네이션 초기화
  useEffect(() => {
    if (!prevPlayListQuery) {
      setCurPage(1);
    }
  }, [selectedRegion, conditions, sortStandard]);

  // 화면 너비 조절 이벤트를 듣도록 하기
  useEffect(() => {
    const resizeListener = () => {
      setInnerWidth(window.innerWidth);
    };
    window.addEventListener("resize", resizeListener);
  });

  // 지역을 누를 경우 (캘린더가 보기가 아닐 경우) selectedRegion state를 변경
  const changeSelectedRegion = (e, region) => {
    setSelectedRegion(region);
    setSortStandard("recent");
    setCurPage(1);
    setConditions({
      가격별: [0, 100000],
      상태별: ["공연중"],
      날짜별: null,
    });
  };

  return (
    <div className="play-list-container" ref={playListContainerRef}>
      {error ? (
        <AlertCustom
          title="tennybox.com 내용:"
          content={error}
          open={isAlertOpen}
          onclose={() => setIsAlertOpen(false)}
          severity={"error"}
        />
      ) : null}
      {isLoading && <Loading />}
      {!isLoading && (
        <>
          <RegionSelectBar
            changeSelectedRegion={changeSelectedRegion}
            selectedRegion={selectedRegion}
          />
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
              conditions["상태별"].map((state, idx) => (
                <Chip icon={<MovieIcon />} label={state} key={idx} />
              ))
            )}
            {conditions["날짜별"] ? (
              <Chip icon={<CalendarMonthIcon />} label={conditions["날짜별"]} />
            ) : null}
            {conditions["가격별"][0] === 0 &&
            conditions["가격별"][1] === 100000 ? (
              <Chip icon={<LocalAtmIcon />} label="가격 전체" />
            ) : conditions["가격별"][1] === 100000 ? (
              <Chip
                icon={<LocalAtmIcon />}
                label={`${conditions["가격별"][0]}원 ~ 100000원 이상`}
              />
            ) : (
              <Chip
                icon={<LocalAtmIcon />}
                label={conditions["가격별"]
                  .map((price) => price + "원")
                  .join(" ~ ")}
              />
            )}
          </Stack>
          {!playTotalCnt || error === "연극 목록 가져오기에 실패하였습니다." ? (
            <>
              <PlayListHeader
                count={playTotalCnt}
                setSortStandard={setSortStandard}
                sortStandard={sortStandard}
              />
              <div className="play-no-exsist">
                <Empty />
              </div>
            </>
          ) : null}
          {playTotalCnt > 0 ? (
            <>
              <PlayListHeader
                count={playTotalCnt}
                setSortStandard={setSortStandard}
                sortStandard={sortStandard}
              />
              <div className="play-list-main">
                {plays.map((play) => (
                  <PlayBox
                    key={play.showId}
                    playInfo={{
                      playId: play.showId,
                      imgSrc: play.poster,
                      title: play.title,
                      place: play.location,
                      period:
                        dayjs(play.start_date).format("YYYY-MM-DD") +
                        " ~ " +
                        dayjs(play.end_date).format("YYYY-MM-DD"),
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
