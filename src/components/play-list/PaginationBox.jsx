import "./PaginationBox.scss";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useEffect } from "react";

export default function PaginationBox({ innerWidth, playsCount, setCurPage, curPage, playListContainerRef }) {
  const totalPages = Math.ceil(playsCount / 24);

  useEffect(() => {
    if (curPage < 1) {
      setCurPage(1);
    } else if (curPage > totalPages) {
      setCurPage(totalPages);
    }
  }, [curPage, totalPages, setCurPage]);

  const handlePageNumberChange = (e, number) => {
    setCurPage(number);
    playListContainerRef.current.scrollIntoView({ behavior: "auto" });
  };

  return (
    <div className="play-list-pagenation">
      <Stack spacing={2}>
        <Pagination
          count={totalPages}
          color="secondary"
          page={curPage}
          size={innerWidth >= 481 ? "large" : "small"}
          onChange={handlePageNumberChange}
          showFirstButton
          showLastButton
        />
      </Stack>
    </div>
  );
}
