import "./PaginationBox.scss";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

export default function PaginationBox({ innerWidth, playsCount, setCurPage, curPage, playListContainerRef }) {
  const handlePageNumberChange = (e, number) => {
    setCurPage(number);
    playListContainerRef.current.scrollIntoView({ behavior: "auto" });
  };

  return (
    <div className="play-list-pagenation">
      <Stack spacing={2}>
        <Pagination
          count={Math.ceil(playsCount / 24)}
          color="secondary"
          page={curPage}
          size={innerWidth >= 481 ? "large" : "small"}
          onChange={handlePageNumberChange}
        />
      </Stack>
    </div>
  );
}
