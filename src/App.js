import "./App.scss";
import { useState, createContext } from "react";
import { Helmet } from "react-helmet-async";
import { ThemeProvider } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { theme } from "./themes/theme";
import LoginAlert from "./components/common/alert/LoginAlert";
import LoginAlertBack from "./components/common/alert/LoginAlertBack";
import AppRoutes from "./AppRoutes";
import FetchErrorAlert from "./components/common/alert/FetchErrorAlert";

export const AppContext = createContext();
export const AlertContext = createContext();

function App() {
  const [userData, setUserData] = useState(null);
  const [openLoginAlert, setOpenLoginAlert] = useState(false);
  const [openLoginAlertBack, setOpenLoginAlertBack] = useState(false);
  const [openFetchErrorAlert, setOpenFetchErrorAlert] = useState(false);
  const [prevPlayListQuery, setPrevPlayListQuery] = useState(null);

  // userData 상태가 변경될 때마다 실행되는 useEffect
  // useEffect(() => {
  //   console.log("업데이트 후 userData:", userData);
  // }, [userData]);

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
