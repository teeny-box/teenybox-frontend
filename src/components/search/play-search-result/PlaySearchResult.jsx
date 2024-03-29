import "./PlaySearchResult.scss";
import PlaySearchHeader from "./PlaySearchHeader";
import PlaySearchContentBox from "./PlaySearchContentBox";
import PlaySearchPagination from "./PlaySearchPagination";
import EmptySearchResult from "../../common/state/EmptySearchResult";
import ServerError from "../../common/state/ServerError";

export default function PlaySearchResult({
  playSearchResult,
  setPlaySearchResult,
  curPage,
  setCurPage,
  playTotalCnt,
  searchKeyword,
  setAlert,
  setSortStandard,
  getPlaySearchResult,
}) {
  return (
    <>
      <section className="play-search-result-container">
        <PlaySearchHeader
          setSortStandard={setSortStandard}
          setCurPage={setCurPage}
          resultCnt={playTotalCnt}
        />
        <div className="play-search-content">
          {playSearchResult === "error" ? (
            <div style={{ margin: "80px auto" }}>
              <ServerError onClickBtn={() => getPlaySearchResult()} />
            </div>
          ) : playSearchResult.length ? (
            <>
              {playSearchResult.map((play, idx) => (
                <PlaySearchContentBox
                  showId={play.showId}
                  imgSrc={play.poster}
                  location={play.location}
                  title={play.title}
                  startDate={play.start_date}
                  endDate={play.end_date}
                  price={play.price}
                  state={play.state}
                  key={idx}
                />
              ))}
              <PlaySearchPagination
                curPage={curPage}
                setCurPage={setCurPage}
                playTotalCnt={playTotalCnt}
                keyword={searchKeyword}
                setPlaySearchResult={setPlaySearchResult}
                setAlert={setAlert}
              />
            </>
          ) : (
            <div className="no-result">
              <EmptySearchResult play={true} />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
