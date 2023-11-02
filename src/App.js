import { ThemeProvider } from "@mui/material";
import "./App.scss";
import { theme } from "./components/common/themes/theme";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import FreeBoardListPage from "./pages/free-board-list/FreeBoardListPage";
import PRBoardListPage from "./pages/pr-board-list/PRBoardListPage";
import FreeBoardDetailPage from "./pages/free-board-detail/FreeBoardDetailPage";
import Header from "./components/common/header/Header";
import Footer from "./components/common/footer/Footer";
import PlayList from "./pages/play-list/PlayList";
import PlayDetail from "./pages/play-detail/PlayDetail";
import Main from "./pages/main/Main";

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Header />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/free-board" element={<FreeBoardListPage />} />
            <Route path="/free-board/detail" element={<FreeBoardDetailPage />} />
            <Route path="/PR-board" element={<PRBoardListPage />} />
            <Route path="/play-list" element={<PlayList />} />
            <Route path="/play-detail/:playId" element={<PlayDetail />} />
          </Routes>
        </BrowserRouter>
        <Footer />
      </ThemeProvider>
    </div>
  );
}

export default App;
