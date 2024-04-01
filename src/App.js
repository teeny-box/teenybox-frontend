import "./App.scss";
import { useState, createContext } from "react";
import { Helmet } from "react-helmet";
import { ThemeProvider } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { theme } from "./components/common/themes/theme";
import LoginAlert from "./components/common/alert/LoginAlert";
import LoginAlertBack from "./components/common/alert/LoginAlertBack";
import AppRoutes from "./AppRoutes";
import FetchErrorAlert from "./components/common/alert/FetchErrorAlert";
import useGetUser from "./hooks/authoriaztionHooks/useGetUser";

export const AppContext = createContext({
  userData: null, // 기본 사용자 데이터 : userGetUser() 훅에서는 userData를 직접참조하지 않고 AppContext에 담긴 값을 업데이트 해주고 있기 때문.
  setUserData: () => {}, // 기본 함수
});
export const AlertContext = createContext();

function App() {
  const [userData, setUserData] = useState(null);
  const [openLoginAlert, setOpenLoginAlert] = useState(false);
  const [openLoginAlertBack, setOpenLoginAlertBack] = useState(false);
  const [openFetchErrorAlert, setOpenFetchErrorAlert] = useState(false);
  const [prevPlayListQuery, setPrevPlayListQuery] = useState(null);

  useGetUser();

  return (
    <div className="App">
      <Helmet>
        <script type="text/javascript" defer src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_MAP_API_KEY}&autoload=false`} />
      </Helmet>
      <ThemeProvider theme={theme}>
        <AppContext.Provider
          value={{
            userData,
            setUserData,
            prevPlayListQuery,
            setPrevPlayListQuery,
          }}
        >
          <AlertContext.Provider
            value={{
              openLoginAlert,
              setOpenLoginAlert,
              openLoginAlertBack,
              setOpenLoginAlertBack,
              openFetchErrorAlert,
              setOpenFetchErrorAlert,
            }}
          >
            <BrowserRouter>
              <AppRoutes setPrevPlayListQuery={setPrevPlayListQuery} />
              <LoginAlert />
              <LoginAlertBack />
              <FetchErrorAlert />
            </BrowserRouter>
          </AlertContext.Provider>
        </AppContext.Provider>
      </ThemeProvider>
    </div>
  );
}

export default App;
