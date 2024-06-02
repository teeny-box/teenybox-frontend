import React, { useState, useEffect, useContext, useRef, useMemo, useCallback } from "react";
import "./PlayList.scss";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import MovieIcon from "@mui/icons-material/Movie";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Button from "@mui/material/Button";
import dayjs from "dayjs";
import { Helmet } from "react-helmet-async";
import ConditionSearch from "../../components/play-list/ConditionSearch";
import PlayListHeader from "../../components/play-list/PlayListHeader";
import PlayBox from "../../components/play-list/PlayBox";
import PaginationBox from "../../components/play-list/PaginationBox";
import RegionSelectBar from "../../components/play-list/RegionSelectBar";
import { AlertCustom } from "../../../src/components/common/alert/Alerts";
import Loading from "../../components/common/state/Loading";
import { AppContext } from "../../App";
import Empty from "../../components/common/state/Empty";
import { ResetUpButton } from "../../components/common/button/ResetUpButton";
import { showUrl } from "../../apis/apiURLs";

export function PlayList() {
  const { prevPlayListQuery, setPrevPlayListQuery } = useContext(AppContext);
  const queryParams = new URLSearchParams(prevPlayListQuery);

  const PlayBoxMemo = React.memo(PlayBox);
  const playListContainerRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [plays, setPlays] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(
    !queryParams.has("region") ? ["전체"] : queryParams.getAll("region").includes("대전") ? ["대전", "충청", "세종"] : queryParams.getAll("region"),
  );
  const [sortStandard, setSortStandard] = useState(queryParams.get("order") ? queryParams.get("order") : "recent");
  const [curPage, setCurPage] = useState(queryParams.get("page") ? Number(queryParams.get("page")) : 1);
  const [playTotalCnt, setPlayTotalCnt] = useState(0);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [error, setError] = useState("");
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [reqQuery, setReqQuery] = useState("");
  const [isRegionExpandClicked, setIsRegionExpandClicked] = useState(false);
  const [isConditionExpandClicked, setIsConditionExpandClicked] = useState(false);
  const [isLoadMore, setIsLoadMore] = useState(false);

  const conditionTexts = useMemo(
    () => [
      {
        division: "구분",
        options: ["전체", "공연중", "공연예정", "공연완료"],
      },
      { division: "기간" },
      { division: "가격" },
    ],
    [],
  );

  const [conditions, setConditions] = useState({
    가격:
      queryParams.get("lowPrice") && queryParams.get("highPrice")
        ? [+queryParams.get("lowPrice"), +queryParams.get("highPrice")]
        : !+queryParams.get("lowPrice") && +queryParams.get("highPrice")
          ? [0, +queryParams.get("highPrice")]
          : !+queryParams.get("highPrice") && +queryParams.get("lowPrice")
            ? [+queryParams.get("lowPrice"), 100000]
            : [0, 100000],
    구분: queryParams.has("state") ? queryParams.getAll("state") : ["공연중"],
    기간: queryParams.get("date") ? queryParams.get("date") : null,
  });

  const createQueryParams = useCallback(() => {
    const regionQuery = selectedRegion[0] === "전체" ? "" : selectedRegion.map((region) => `region=${region}`).join("&");
    const stateQuery = conditions["구분"][0] === "전체" ? "" : conditions["구분"].map((state) => `state=${state}`).join("&");
    const priceQuery = `lowPrice=${conditions["가격"][0]}&highPrice=${conditions["가격"][1]}`;
    const dateQuery = conditions["기간"] ? `date=${conditions["기간"]}` : "";
    const queries = [regionQuery, stateQuery, priceQuery, dateQuery].filter((q) => q).join("&");

    return `?${queries}&order=${sortStandard}&page=${curPage}&limit=24`;
  }, [selectedRegion, conditions, sortStandard, curPage]);

  const fetchData = useCallback(() => {
    const queryParam = createQueryParams(selectedRegion, conditions, sortStandard, curPage);
    setReqQuery(queryParam);
    fetch(`${showUrl}${queryParam}`)
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false);
        setPlays((prevPlays) => (curPage === 1 ? data.shows : [...prevPlays, ...data.shows])); // 페이지에 따라 데이터 추가
        setPlayTotalCnt(data.total);
        setIsLoadMore(curPage < Math.ceil(data.total / 24)); // 더보기 버튼 표시 여부 결정
      })
      .catch((e) => {
        setError(`연극 목록 가져오기에 실패하였습니다. ${e.message}`);
        setIsAlertOpen(true);
      });
  }, [selectedRegion, conditions, sortStandard, curPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!prevPlayListQuery) {
      setSortStandard("recent");
      setConditions({
        가격: [0, 100000],
        구분: ["공연중"],
        기간: null,
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

  const resetFilters = useCallback(() => {
    setSortStandard("recent");
    setCurPage(1);
    setConditions({
      가격: [0, 100000],
      구분: ["공연중"],
      기간: null,
    });
    setIsRegionExpandClicked(false);
    setIsConditionExpandClicked(false);
  }, []);

  const changeSelectedRegion = useCallback(
    (e, region) => {
      setSelectedRegion(region);
      resetFilters();
    },
    [resetFilters],
  );

  const handleLoadMore = () => {
    setCurPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="play-list-container" ref={playListContainerRef}>
      <Helmet>
        <title>Teeny Box - 연극찾기</title>
        <title>티니박스(TeenyBox) 연극찾기</title>
        <meta name="description" content="티니박스에서 다양한 연극을 찾아보세요!" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="TeenyBox(티니박스) - 연극" />
        <meta property="og:title" content="티니박스(TeenyBox) 연극찾기" />
        <meta property="og:description" content="티니박스에서 다양한 연극을 찾아보세요!" />
      </Helmet>
      {error ? <AlertCustom title="tennybox.com 내용:" content={error} open={isAlertOpen} onclose={() => setIsAlertOpen(false)} severity={"error"} /> : null}
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <RegionSelectBar
            changeSelectedRegion={changeSelectedRegion}
            selectedRegion={selectedRegion}
            isExpandClicked={isRegionExpandClicked}
            setIsExpandClicked={setIsRegionExpandClicked}
            innerWidth={innerWidth}
          />
          <ConditionSearch
            isExpandClicked={isConditionExpandClicked}
            setIsExpandClicked={setIsConditionExpandClicked}
            conditionTexts={conditionTexts}
            innerWidth={innerWidth}
            conditions={conditions}
            setConditions={setConditions}
          />

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
              <Stack direction="row" spacing={2} className="adapted-conditions">
                {conditions["구분"][0] === "전체" ? (
                  <Chip icon={<MovieIcon />} label="공연 상태 전체" className="chip" />
                ) : (
                  conditions["구분"].map((state, idx) => <Chip icon={<MovieIcon />} label={state} key={idx} className="chip" />)
                )}
                {conditions["가격"][0] === 0 && conditions["가격"][1] === 100000 ? (
                  <Chip icon={<LocalAtmIcon />} label="가격 전체" className="chip" />
                ) : conditions["가격"][1] === 100000 ? (
                  <Chip icon={<LocalAtmIcon />} label={`${conditions["가격"][0]}원 ~ 100000원 이상`} className="chip" />
                ) : (
                  <Chip icon={<LocalAtmIcon />} label={conditions["가격"].map((price) => `${price}원`).join(" ~ ")} className="chip" />
                )}
                {conditions["기간"] ? <Chip icon={<CalendarMonthIcon />} label={conditions["기간"]} className="chip" /> : null}
              </Stack>
              <div className="play-list-main">
                {plays.map((play) => (
                  <PlayBoxMemo
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
              {innerWidth <= 768 ? (
                <div className="load-more-button-container">
                  <div className="load-more-button">
                    {isLoadMore && (
                      <Button variant="contained" onClick={handleLoadMore} sx={{ width: 200, backgroundColor: "#ffb400" }}>
                        더보기
                      </Button>
                    )}
                  </div>
                  <ResetUpButton setCurPage={setCurPage} />
                </div>
              ) : (
                <PaginationBox
                  innerWidth={innerWidth}
                  playsCount={playTotalCnt}
                  setCurPage={setCurPage}
                  curPage={curPage}
                  playListContainerRef={playListContainerRef}
                />
              )}
            </>
          ) : null}
        </>
      )}
    </div>
  );
}
