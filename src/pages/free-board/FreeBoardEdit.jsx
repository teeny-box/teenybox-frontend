import React, { useEffect, useState } from "react";
import { BoardSecondHeader } from "../../components/board";
import "./FreeBoardFormPage.scss";
import { useNavigate, useParams } from "react-router-dom";
import { AlertCustom } from "../../components/common/alert/Alerts";
import { FreeBoardEditForm } from "../../components/board-free/FreeBoardEdit";
import { postUrl } from "../../apis/apiURLs";
import useGetUser from "../../hooks/authoriaztionHooks/useGetUser";

export function FreeBoardEdit() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState(false);
  const [post, setPost] = useState();
  const params = useParams();
  const user = useGetUser();
  const nav = useNavigate();

  const handleCancle = (e) => {
    if (input) setOpen(true);
    else nav("/community");
  };

  const getPost = async () => {
    const res = await fetch(`${postUrl}/${params.postId}`);
    const data = await res.json();
    console.log(data);
    if (data.user_id.nickname !== user.nickname) {
      console.log("접근제한");
      // 403페이지로 리다이랙트
    }
    setPost(data);
  };

  useEffect(() => {
    getPost();
  }, []);

  return (
    <div className="free-board-form-page page-margin-bottom">
      <BoardSecondHeader header="자유게시판" onclick={handleCancle} />
      <div className="body">
        <FreeBoardEditForm setInput={(boolean) => setInput(boolean)} handleCancle={handleCancle} />
      </div>

      <AlertCustom
        open={open}
        onclose={() => setOpen(false)}
        onclick={() => nav("/community")}
        closeBtn={"취소"}
        checkBtn={"확인"}
        checkBtnColor={"red"}
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
    </div>
  );
}
