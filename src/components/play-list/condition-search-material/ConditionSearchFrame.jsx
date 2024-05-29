import { useContext, useState, useCallback, useEffect } from "react";
import "./ConditionSearchFrame.scss";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import koLocale from "date-fns/locale/ko"; // 한국어 로케일 추가
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import ConditionCheckBox from "./ConditionCheckBox";
import { ConditionContext } from "../ConditionSearch";

const fullMarks = [
  { value: 0, label: "무료" },
  { value: 10, label: "1만원" },
  { value: 20, label: "2만원" },
  { value: 30, label: "3만원" },
  { value: 40, label: "4만원" },
  { value: 50, label: "5만원" },
  { value: 60, label: "6만원" },
  { value: 70, label: "7만원" },
  { value: 80, label: "8만원" },
  { value: 90, label: "9만원" },
  { value: 100, label: "10만원 이상" },
];

const mediumMarks = [
  { value: 0, label: "무료" },
  { value: 10, label: "1만원" },
  { value: 30, label: "3만원" },
  { value: 50, label: "5만원" },
  { value: 80, label: "8만원" },
  { value: 100, label: "10만원 이상" },
];

const smallMarks = [
  { value: 0, label: "무료" },
  { value: 10, label: "1만원" },
  { value: 30, label: "3만원" },
  { value: 50, label: "5만원" },
  { value: 100, label: "10만원 이상" },
];

const xsmallMarks = [
  { value: 0, label: "무료" },

  { value: 100, label: "10만원 이상" },
];

function valuetext(value) {
  return `${value}원`;
}

function priceLabelText(prices) {
  const startPrice = prices[0] / 1000;
  const endPrice = prices[1] / 1000;

  if (prices[0] === 0 && prices[1] === 100000) {
    return "가격 전체";
  }
  if (prices[1] === 100000) {
    return `${startPrice.toString().slice(0, -1)}만원 이상`;
  }
  return `${endPrice.toString().slice(0, -1)}만원 이하`;
}

export default function ConditionSearchFrame({ division, options, innerWidth }) {
  const { conditions, setConditions } = useContext(ConditionContext);
  const [values, setValues] = useState([conditions["가격"][0] ? conditions["가격"][0] / 1000 : 0, conditions["가격"][1] / 1000]);
  const [marks, setMarks] = useState(fullMarks);
  const [sliderStep, setSliderStep] = useState(null); // 초기에는 null로 설정

  const handleChangeSlider = useCallback((event, newValues) => {
    setValues(newValues);
  }, []);

  const handleCommitSlider = useCallback(
    (event, finalValues) => {
      const priceRange = finalValues.map((val) => val * 1000);
      setConditions((prev) => {
        const newObj = { ...prev };
        newObj["가격"] = priceRange;
        return newObj;
      });
    },
    [setConditions],
  );

  const handleChangeDatePicker = (date, info) => {
    const formattedDate = dayjs(date).format("YYYY-MM-DD");
    if (!info.validationError && date !== null) {
      setConditions((prev) => {
        const newObj = { ...prev };
        newObj["기간"] = formattedDate;
        return newObj;
      });
    }
  };

  const dateReset = () => {
    setConditions((prev) => {
      const newObj = { ...prev };
      newObj["기간"] = null;
      return newObj;
    });
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480) {
        setMarks(xsmallMarks);
        setSliderStep(10); // 480px 이하일 때 step을 10으로 설정
      } else if (window.innerWidth < 768) {
        setMarks(smallMarks);
      } else if (window.innerWidth < 1024) {
        setMarks(mediumMarks);
      } else {
        setMarks(innerWidth >= 1300 ? fullMarks : mediumMarks);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // 초기 로드 시에도 체크

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [innerWidth]);

  return (
    <div className="flex-layout">
      <span className="condition-label">{division}</span>
      {division === "구분" && (
        <div className="condition-checkbox">
          {options.map((option, idx) => (
            <ConditionCheckBox key={idx} division={division} option={option} />
          ))}
        </div>
      )}
      {division === "기간" && (
        <>
          <LocalizationProvider dateAdapter={AdapterDayjs} locale={koLocale}>
            <DemoContainer components={["DatePicker"]} sx={{ padding: "5px 0" }}>
              <DatePicker
                format="YYYY/MM/DD"
                onChange={handleChangeDatePicker}
                value={conditions["기간"] ? dayjs(conditions["기간"]) : null}
                className="date-picker"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#FFB400",
                    },
                    "&:hover fieldset": {
                      borderColor: "#FFB400",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#FFB400",
                    },
                  },
                }}
              />
            </DemoContainer>
          </LocalizationProvider>
          {conditions["기간"] ? (
            <Button color="secondary" sx={{ marginLeft: "10px" }} size="large" onClick={dateReset} readOnly>
              초기화
            </Button>
          ) : (
            <Button size="large" disabled sx={{ marginLeft: "10px" }}>
              초기화
            </Button>
          )}
        </>
      )}
      {division === "가격" && (
        <div className="condition-checkbox">
          <Box className="slider-box">
            <Slider
              value={values}
              onChange={handleChangeSlider}
              onChangeCommitted={handleCommitSlider}
              getAriaValueText={valuetext}
              marks={marks}
              min={0}
              max={100}
              step={sliderStep} // 단계별로 이동하지 않도록 설정
              color="secondary"
              valueLabelDisplay="off"
            />
          </Box>
          <span className="condition-price">{division === "가격" ? priceLabelText(values.map((value) => value * 1000)) : null}</span>
        </div>
      )}
    </div>
  );
}
