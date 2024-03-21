import React, { useContext } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import { ConditionContext } from "../ConditionSearch";

export default function ConditionCheckBox({ division, option }) {
  // 체크박스를 클릭하면 조건 객체에 들어있는 상태가 바뀌어야 하므로 ContextAPI로 상태 변경을 위한 함수를 가져옴.
  const conditionContext = useContext(ConditionContext);
  const { conditions, setConditions } = conditionContext;

  const handleCheckboxChange = (changedDivision, changedOption) => {
    setConditions((prevConditions) => {
      let updatedConditions;

      if (changedOption === "전체") {
        // '전체'를 클릭한 경우, 다른 조건들의 체크를 모두 해제하고 '전체'를 토글
        updatedConditions = Object.fromEntries(
          Object.entries(prevConditions).map(([key, value]) => [key, key === changedDivision ? (value.includes("전체") ? [] : ["전체"]) : []]),
        );
      } else {
        // 다른 조건을 클릭한 경우, '전체'와 해당 조건을 토글
        updatedConditions = {
          ...prevConditions,
          [changedDivision]: prevConditions[changedDivision].includes("전체")
            ? [changedOption]
            : prevConditions[changedDivision].includes(changedOption)
              ? prevConditions[changedDivision].filter((item) => item !== changedOption)
              : [changedOption, ...prevConditions[changedDivision]],
        };
      }

      // Check if all checkboxes for the current division are unchecked
      const allUnchecked = updatedConditions[changedDivision].every((opt) => opt !== "전체" && opt === "");

      // If all checkboxes are unchecked, automatically check '전체'
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
          color="secondary"
          checked={option === "전체" ? conditions[division].includes("전체") : conditions[division].includes(option)}
          value={option}
          onChange={() => (option === "전체" ? handleCheckAll(division) : handleCheckboxChange(division, option))}
        />
      }
      label={<Typography>{option}</Typography>}
    />
  );
}
