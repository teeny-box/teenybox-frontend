import React, { useState, createContext } from "react";
import { Helmet } from "react-helmet-async";
import { ThemeProvider } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { theme } from "./components/common/themes/theme";
import LoginAlert from "./components/common/alert/LoginAlert";
import LoginAlertBack from "./components/common/alert/LoginAlertBack";
import AppRoutes from "./AppRoutes";
import FetchErrorAlert from "./components/common/alert/FetchErrorAlert";
import MobileMenu from "./components/common/header/mobile-menu/MobileMenu";

export const AppContext = createContext();
export const AlertContext = createContext();

function App() {
  const [userData, setUserData] = useState(null);
  const [openLoginAlert, setOpenLoginAlert] = useState(false);
  const [openLoginAlertBack, setOpenLoginAlertBack] = useState(false);
  const [openFetchErrorAlert, setOpenFetchErrorAlert] = useState(false);
  const [prevPlayListQuery, setPrevPlayListQuery] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLightHeader, setIsLightHeader] = useState(false);

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
            mobileMenuOpen,
            setMobileMenuOpen,
            isLightHeader,
            setIsLightHeader,
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
              {mobileMenuOpen ? (
                <MobileMenu onClose={() => setMobileMenuOpen(false)} />
              ) : (
                <>
                  <AppRoutes setPrevPlayListQuery={setPrevPlayListQuery} />
                  <LoginAlert />
                  <LoginAlertBack />
                  <FetchErrorAlert />
                </>
              )}
            </BrowserRouter>
          </AlertContext.Provider>
        </AppContext.Provider>
      </ThemeProvider>
    </div>
  );
}

export default App;
