import { useContext, useState, useEffect } from "react";
import "./ConditionSearchFrame.scss";
import ConditionCheckBox from "./ConditionCheckBox";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import { ConditionContext } from "../ConditionSearch";

const marks = [
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
  { value: 100, label: "전체" },
];

function valuetext(value) {
  return `${value}원`;
}

function valueLabelFormat(value) {
  return marks.findIndex((mark) => mark.value === value) + 1;
}

export default function ConditionSearchFrame({
  division,
  options,
  innerWidth,
  selectedRegion,
}) {
  const { setConditions } = useContext(ConditionContext);
  const [values, setValues] = useState([0, 100]);

  useEffect(() => {
    setValues([0, 100]);
  }, [selectedRegion]);

  const handleChange = (event, newValues) => {
    setValues(newValues);
    const priceRange = newValues.map((val) => val * 1000);
    setConditions((prev) => {
      const newObj = { ...prev };
      newObj["가격별"] = priceRange;
      return newObj;
    });
  };

  return (
    <div className="flex-layout">
      <span className="condition-label">{division}</span>
      {options && (
        <div className="condition-checkbox">
          {options.map((option, idx) => (
            <ConditionCheckBox key={idx} division={division} option={option} />
          ))}
        </div>
      )}
      {!options && (
        <div className="condition-checkbox">
          <Box sx={{ width: 700 }}>
            <Slider
              value={values}
              onChange={handleChange}
              getAriaValueText={valuetext}
              step={10}
              marks={marks}
              color="secondary"
            />
          </Box>
        </div>
      )}
    </div>
  );
}
