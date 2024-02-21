import React, { useContext, useEffect, useState } from "react";
import "./FreeBoardFormPage.scss";
import { useNavigate, useParams } from "react-router-dom";
import { AlertCustom } from "../../components/common/alert/Alerts";
import { FreeBoardEditForm } from "../../components/board-free/FreeBoardEdit";
import { postUrl } from "../../apis/apiURLs";
import { AlertContext } from "../../App";
import { Backdrop } from "@mui/material";
import useGetUser from "../../hooks/authoriaztionHooks/useGetUser";

export function FreeBoardEdit() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState(false);
  const [post, setPost] = useState();
  const params = useParams();
  const nav = useNavigate();
  const user = useGetUser();
  const { setOpenLoginAlertBack } = useContext(AlertContext);

  const handleCancle = (e) => {
    if (input) setOpen(true);
    else nav(-1);
  };

  const getPost = async () => {
    try {
      const res = await fetch(`${postUrl}/${params.postId}`);
      const data = await res.json();

      if (!res.ok) {
        console.error(data);
        nav("/not-found");
        return;
      }
      if (data.user_id.nickname !== user.user.nickname) {
        nav("/forbidden");
        return;
      }
      setPost(data);
    } catch (err) {
      nav("/not-found");
      console.error(err);
    }
  };

  useEffect(() => {
    if (user && !user.isLoggedIn) {
      setOpenLoginAlertBack(true);
    } else {
      getPost();
    }
  }, [user]);

  return (
    <div className="free-board-form-page page-margin">
      <div className="body">{post && <FreeBoardEditForm setInput={(boolean) => setInput(boolean)} handleCancle={handleCancle} post={post} userRole={user?.user?.role} />}</div>

      <Backdrop open={open} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <AlertCustom
          open={open}
          onclose={() => setOpen(false)}
          onclick={() => nav("/community")}
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
