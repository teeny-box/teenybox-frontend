import dayjs from "dayjs";
import React, { useEffect, useState } from "react";

export default function LiveTimeDiff({ time }) {
  const [now, setNow] = useState(dayjs());
  const [result, setResult] = useState();
  const [prev, setPrev] = useState(dayjs(time));
  const [timer, setTimer] = useState();

  const getTimeDiff = () => {
    if (now.diff(prev, "week")) {
      setResult(prev.format("YYYY-MM-DD"));
    } else if (now.diff(prev, "day")) {
      setResult(`${now.diff(prev, "day")}일 전`);
    } else if (now.diff(prev, "hour")) {
      setResult(`${now.diff(prev, "hour")}시간 전`);
    } else if (now.diff(prev, "minute")) {
      setResult(`${now.diff(prev, "minute")}분 전`);
    } else {
      setResult(`${now.diff(prev, "second")}초 전`);
    }
  };

  useEffect(() => {
    getTimeDiff();
  }, [now]);

  useEffect(
    () => () => {
      clearInterval(timer);
    },
    [timer],
  );

  useEffect(() => {
    setPrev(dayjs(time));
    setNow(dayjs());
    getTimeDiff();

    const interval = setInterval(() => {
      setNow(dayjs());
    }, 1000);

    setTimer(interval);
  }, [time]);

  return <>{result}</>;
}
