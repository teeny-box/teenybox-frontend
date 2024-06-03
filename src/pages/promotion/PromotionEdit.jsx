import "./PromotionFormPage.scss";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Backdrop } from "@mui/material";
import { AlertCustom } from "../../components/common/alert/Alerts";
import { PromotionEditForm } from "../../components/promotion/PromotionEdit";
import { promotionUrl } from "../../apis/apiURLs";
import { AlertContext } from "../../App";
import useGetUser from "../../hooks/authoriaztionHooks/useGetUser";

export function PromotionEdit() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState(false);
  const [post, setPost] = useState();
  const params = useParams();
  const nav = useNavigate();
  const user = useGetUser();
  const { setOpenLoginAlertBack } = useContext(AlertContext);

  const handleCancle = () => {
    if (input) setOpen(true);
    else nav("/promotion");
  };

  const getPost = async () => {
    try {
      const res = await fetch(`${promotionUrl}/${params.postId}`);
      const data = await res.json();

      if (!res.ok) {
        console.error(data);
        nav("/not-found");
        return;
      }
      if (data.user_id.nickname !== user.nickname) {
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
    if (!user) {
      setOpenLoginAlertBack(true);
    } else {
      setOpenLoginAlertBack(false);
      getPost();
    }
  }, [user]);

  return (
    <div className="promotion-form-page page-layout">
      <div className="body">{post && <PromotionEditForm setInput={(boolean) => setInput(boolean)} handleCancle={handleCancle} post={post} />}</div>

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
