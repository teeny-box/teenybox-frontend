import React, { useContext } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import { ConditionContext } from "../ConditionSearch";

export default function ConditionCheckBox({ division, option }) {
  const conditionContext = useContext(ConditionContext);
  const { conditions, setConditions } = conditionContext;

  const handleCheckboxChange = (changedDivision, changedOption) => {
    setConditions((prevConditions) => {
      let updatedConditions;

      if (changedOption === "전체") {
        updatedConditions = Object.fromEntries(
          Object.entries(prevConditions).map(([key, value]) => [key, key === changedDivision ? (value.includes("전체") ? [] : ["전체"]) : []]),
        );
      } else {
        updatedConditions = {
          ...prevConditions,
          [changedDivision]: prevConditions[changedDivision].includes("전체")
            ? [changedOption]
            : prevConditions[changedDivision].includes(changedOption)
              ? prevConditions[changedDivision].filter((item) => item !== changedOption)
              : [changedOption, ...prevConditions[changedDivision]],
        };
      }

      const allUnchecked = updatedConditions[changedDivision].every((opt) => opt !== "전체" && opt === "");

      if (allUnchecked) {
        updatedConditions[changedDivision] = ["전체"];
      }

      return updatedConditions;
    });
  };

  const handleCheckAll = (changedDivision) => {
    setConditions((prevConditions) => ({
      ...prevConditions,
      [changedDivision]: ["전체"],
    }));
  };

  return (
    <FormControlLabel
      control={
        <Checkbox
          sx={{
            color: "#FFB400",
            "&.Mui-checked": {
              color: "#FFB400",
            },
            "@media (max-width: 400px)": {
              width: "40%",
              margin: "0 0 0 5px",
            },
          }}
          checked={option === "전체" ? conditions[division].includes("전체") : conditions[division].includes(option)}
          value={option}
          onChange={() => (option === "전체" ? handleCheckAll(division) : handleCheckboxChange(division, option))}
        />
      }
      label={
        <Typography
          sx={{
            "@media (max-width: 420px)": {
              fontSize: "0.8rem",
            },
          }}
        >
          {option}
        </Typography>
      }
    />
  );
}
