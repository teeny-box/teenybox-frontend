import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Backdrop, Button, Checkbox, FormControlLabel, IconButton, RadioGroup, Radio } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import "../promotion/PromotionForm.scss";
import { Editor } from "@toast-ui/react-editor";
import { AlertCustom } from "../common/alert/Alerts";
import { postUrl, presignedUrl } from "../../apis/apiURLs";
import { AlertContext } from "../../App";
// eslint-disable-next-line import/no-extraneous-dependencies
import "@toast-ui/editor/dist/toastui-editor.css";

export default function CommunityEditForm({ setInput, handleCancle, post, userRole }) {
  const [submit, setSubmit] = useState(false);
  const [openSubmit, setOpenSubmit] = useState(false);
  const [openComplete, setOpenComplete] = useState(false);

  const [inputCategory, setInputCategory] = useState(post.category);
  const [inputTitle, setInputTitle] = useState(post.title);
  const [errorTitle, setErrorTitle] = useState("");
  const [inputContent, setInputContent] = useState(post.content);
  const [errorContent, setErrorContent] = useState("");
  const [errorImage, setErrorImage] = useState("");
  const [tagList, setTagList] = useState(post.tags || []);
  const [inputTag, setInputTag] = useState();
  // 고정(관리자)
  const [fixed, setFixed] = useState(post.is_fixed === "고정");

  const editorRef = useRef();
  const { setOpenFetchErrorAlert } = useContext(AlertContext);
  const nav = useNavigate();

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${postUrl}/${post.post_number}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: inputTitle,
          content: inputContent,
          tags: tagList,
          category: inputCategory,
          is_fixed: fixed ? "고정" : "일반",
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setOpenComplete(true);
      } else {
        console.error(data);
      }
    } catch (e) {
      setOpenFetchErrorAlert(true);
      console.error(e);
    }
  };

  const handleClickSubmitButton = () => {
    setSubmit(true);
    if (errorTitle) {
      document.querySelector("#title").focus();
    } else if (errorContent) {
      // document.querySelector("#content").focus();
    } else {
      setOpenSubmit(true);
    }
  };

  const handleError = (error) => {
    if (submit && error) {
      return (
        <div className="error">
          <ErrorOutlineIcon fontSize="inherit" />
          {error}
        </div>
      );
    }
    return <></>;
  };

  const handleTitleChange = (e) => {
    setInputTitle(e.target.value);
    if (e.target.value.length < 3) {
      setErrorTitle("제목을 최소 3자 이상 입력해주세요.");
    } else {
      setErrorTitle("");
    }
  };

  const handleContentChange = () => {
    const editorMarkdown = editorRef.current.getInstance().getHTML();
    console.log(editorMarkdown);
    setInputContent(editorMarkdown);
    if (editorMarkdown.length < 1) {
      setErrorContent("내용을 입력해주세요.");
    } else {
      setErrorContent("");
    }
  };

  const uploadImage = async (file) => {
    try {
      let res = await fetch(presignedUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: file.name }),
      });
      const data = await res.json();

      if (!res.ok) {
        console.error(data);
        return false;
      }

      res = await fetch(data.presigned_url, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!res.ok) {
        return false;
      }
      return data.public_url;
    } catch (e) {
      console.error(e);
      setOpenFetchErrorAlert(true);
      return false;
    }
  };

  const handleChangeImage = async (file, callback) => {
    if (file.size > 1024 * 1024 * 5) {
      setErrorImage("사진은 최대 5MB까지 업로드 가능합니다.");
      return;
    }
    const imageUrl = await uploadImage(file);
    console.log(imageUrl);

    if (imageUrl) {
      setErrorImage("");
      callback(imageUrl);
    } else {
      setErrorImage("사진 업로드에 실패했습니다. 다시 시도해주세요");
    }
  };

  const handleChangeTag = (e) => {
    if (e.keyCode === 13) {
      if (!inputTag) return;
      setTagList((cur) => [...cur, inputTag]);
      setInputTag("");
    }
  };

  const handleRemoveTag = (e) => {
    const tagId = e.target.closest(".tag-box").id;
    const newList = [...tagList];
    newList.splice(tagId, 1);
    setTagList(newList);
  };

  useEffect(() => {
    if (inputTitle || inputContent || tagList) setInput(true);
    else setInput(false);
  }, [inputTitle, inputContent, tagList]);

  useEffect(() => {
    if (post) {
      setInputTitle(post.title);
      setInputContent(post.content);
      setTagList(post.tags);
    }
  }, [post]);

  return (
    <div className="post-form-box">
      <div className="form-header">
        <div className="title">게시글 수정하기</div>
      </div>

      {userRole === "admin" && (
        <>
          <div className="flex-box category">
            <div className="input">
              <label htmlFor="">카테고리</label>
              <RadioGroup name="controlled-radio-buttons-group" value={inputCategory} onChange={(e) => setInputCategory(e.target.value)}>
                <FormControlLabel value="자유" control={<Radio size="small" />} label="일반" />
                <FormControlLabel value="공지" control={<Radio size="small" />} label="공지" />
              </RadioGroup>
            </div>
          </div>
          <div className="flex-box fixed">
            <div className="input flex-center">
              <label htmlFor="">고정</label>
              <FormControlLabel label={fixed ? "고정 됨" : "고정 안 됨"} control={<Checkbox checked={fixed} onChange={(e) => setFixed(e.target.checked)} />} />
            </div>
          </div>
        </>
      )}

      <div className="flex-box title">
        <div className="input">
          <label htmlFor="title">제목*</label>
          <input
            type="text"
            id="title"
            name="title"
            value={inputTitle}
            onChange={handleTitleChange}
            maxLength={40}
            placeholder="제목을 작성해 주세요."
            required
          />
        </div>
        {handleError(errorTitle)}
      </div>

      <div className="input content flex-box">
        <label htmlFor="content">내용*</label>
        <Editor
          ref={editorRef}
          initialValue={inputContent}
          previewStyle="vertical"
          height="600px"
          initialEditType="wysiwyg"
          useCommandShortcut={true}
          hooks={{ addImageBlobHook: handleChangeImage }}
          onChange={handleContentChange}
        />
        {handleError(errorContent)}
        {handleError(errorImage)}
      </div>

      <div className="input tag flex-box">
        <div>
          <label htmlFor="tags">태그</label>
          <input
            type="text"
            id="tags"
            name="tags"
            onKeyDown={handleChangeTag}
            value={inputTag}
            onChange={(e) => setInputTag(e.target.value.trimStart())}
            placeholder="엔터를 입력하여 태그를 등록할 수 있습니다."
            maxLength={16}
          />
        </div>
        {tagList && (
          <div className="tag-list flex">
            {tagList.map((tag, idx) => (
              <div key={tag + idx} id={idx} className="tag-box flex">
                <span># {tag} </span>
                <IconButton onClick={handleRemoveTag} size="small" sx={{ padding: "2px", fontSize: 14, marginLeft: "4px" }}>
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="form-footer">
        <div className="notice">*표시가 되어 있는 항목은 필수 기재 항목입니다.</div>
        <div>
          <Button color="darkGray" size="large" variant="outlined" onClick={handleCancle} sx={{ marginRight: "14px" }}>
            취소
          </Button>
          <Button variant="contained" size="large" onClick={handleClickSubmitButton} disableElevation>
            수정
          </Button>
        </div>
      </div>

      <Backdrop open={openSubmit || openComplete} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <AlertCustom
          open={openSubmit}
          onclose={() => setOpenSubmit(false)}
          title={"teenybox.com 내용:"}
          content={"게시글을 수정하시겠습니까?"}
          onclick={handleSubmit}
          checkBtn={"확인"}
          closeBtn={"취소"}
          checkBtnColor={"#42BB48"}
        />
        <AlertCustom
          open={openComplete}
          onclose={() => {
            setOpenComplete(false);
            nav("/community");
          }}
          onclick={() => {
            setOpenComplete(false);
            nav("/community");
          }}
          title={"teenybox.com 내용:"}
          content={"글 수정이 완료되었습니다!"}
          btnCloseHidden={true}
          time={1000}
        />
      </Backdrop>
    </div>
  );
}
