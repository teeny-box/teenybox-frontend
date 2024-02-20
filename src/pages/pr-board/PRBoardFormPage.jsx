import React, { useContext, useEffect, useState } from "react";
import { PRBoardForm } from "../../components/board-pr/PRBoardForm";
import "./PRBoardFormPage.scss";
import { AlertCustom } from "../../components/common/alert/Alerts";
import { useNavigate } from "react-router-dom";
import useGetUser from "../../hooks/authoriaztionHooks/useGetUser";
import { AlertContext } from "../../App";
import { Backdrop } from "@mui/material";
import { PRBoardNoticeForm } from "../../components/board-pr/PRBoardNoticeForm";

export function PRBoardFormPage() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState(false);
  const [isNotice, setIsNotice] = useState(false);
  const nav = useNavigate();
  const user = useGetUser();
  const { setOpenLoginAlertBack } = useContext(AlertContext);

  const handleCancle = (e) => {
    if (input) setOpen(true);
    else nav("/promotion");
  };

  useEffect(() => {
    if (user && !user.isLoggedIn) {
      setOpenLoginAlertBack(true);
      if (user.user?.role === "admin") {
        setIsNotice(true);
      }
    }

    console.log(user);
  }, [user]);

  return (
    <div className="pr-board-form-page page-margin">
      <div className="body">
        {isNotice ? (
          <PRBoardNoticeForm setInput={(boolean) => setInput(boolean)} handleCancle={handleCancle} setIsNotice={setIsNotice} userRole={user?.user?.role} />
        ) : (
          <PRBoardForm setInput={(boolean) => setInput(boolean)} handleCancle={handleCancle} setIsNotice={setIsNotice} userRole={user?.user?.role} />
        )}
      </div>

      <Backdrop open={open} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <AlertCustom
          open={open}
          onclose={() => setOpen(false)}
          onclick={() => nav("/promotion")}
          closeBtn={"취소"}
          checkBtn={"확인"}
          checkBtnColor={"#ff9800"}
          severity={"warning"}
          title={"teenybox.com 내용:"}
          content={
            <>
              작성을 취소하시겠습니까?
              <br />
              작성 중인 내용은 저장되지 않습니다.
            </>
          }
        />
      </Backdrop>
    </div>
  );
}
