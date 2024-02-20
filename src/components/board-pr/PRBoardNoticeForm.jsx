import { Backdrop, Button, Checkbox, FormControlLabel, IconButton, Radio, RadioGroup } from "@mui/material";
import React, { Children, useContext, useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import "./PRBoardForm.scss";
import { AlertCustom } from "../common/alert/Alerts";
import { useNavigate } from "react-router-dom";
import { presignedUrl, promotionUrl } from "../../apis/apiURLs";
import dayjs from "dayjs";
import empty_img from "../../assets/img/empty_img.svg";
import { Close } from "@mui/icons-material";
import { AlertContext } from "../../App";

export function PRBoardNoticeForm({ setInput, handleCancle, setIsNotice, userRole }) {
  const [submit, setSubmit] = useState(false);
  const [openSubmit, setOpenSubmit] = useState(false);
  const [openComplete, setOpenComplete] = useState(false);

  // 카테고리
  const [inputCategory, setInputCategiry] = useState("연극");
  // 글제목
  const [inputTitle, setInputTitle] = useState();
  const [errorTitle, setErrorTitle] = useState("제목을 최소 3자 이상 입력해주세요.");
  // 내용
  const [inputContent, setInputContent] = useState();
  const [errorContent, setErrorContent] = useState("내용을 최소 3자 이상 입력해주세요.");
  // 태그
  const [tagList, setTagList] = useState([]);
  const [inputTag, setInputTag] = useState();
  // 사진
  const [mainImageURL, setMainImageURL] = useState(""); // 0인덱스 대표이미지
  const [errorMainImage, setErrorMainImage] = useState("");
  const [imageURL, setImageURL] = useState([]); // 0인덱스 대표이미지
  const [errorImage, setErrorImage] = useState("");
  const [warningMainImage, setWarningMainImage] = useState("");
  // 고정(관리자)
  const [fixed, setFixed] = useState(true);

  const { setOpenFetchErrorAlert } = useContext(AlertContext);
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    try {
      const res = await fetch(`${promotionUrl}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: inputTitle,
          content: inputContent,
          tags: tagList,
          image_url: [mainImageURL, ...imageURL],
          start_date: dayjs(),
          end_date: dayjs(),
          category: inputCategory,
          play_title: "공지사항",
          runtime: 0,
          location: "",
          host: "",
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
    }
  };

  const handleClickSubmitButton = (e) => {
    setSubmit(true);
    if (!mainImageURL) {
      setErrorMainImage("사진을 선택해주세요.");
    }

    if (errorTitle) {
      document.querySelector("#title").focus();
    } else if (errorContent) {
      document.querySelector("#content").focus();
    } else if (!mainImageURL) {
      document.querySelector("#imageBtn").focus();
    } else {
      setOpenSubmit(true);
    }
  };

  const handleErrorPlaceholder = (error) => {
    if (submit && error) {
      return (
        <div className="error">
          <ErrorOutlineIcon fontSize="inherit" />
          {error}
        </div>
      );
    }
  };

  const handleChangeTitle = (e) => {
    if (e.target.value.trim().length > 40) return;
    setInputTitle(e.target.value.trimStart());
    if (e.target.value.length < 3) {
      setErrorTitle("제목을 최소 3자 이상 입력해주세요.");
    } else {
      setErrorTitle("");
    }
  };

  const handleChangeContent = (e) => {
    setInputContent(e.target.value);
    if (e.target.value.trim().length < 3) {
      setErrorContent("내용을 최소 3자 이상 입력해주세요.");
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
    }
  };

  const handleChangeMainImage = async (e) => {
    if (!e.target.files.length) return;
    const file = e.target.files[0];

    if (file.size > 1024 * 1024 * 5) {
      return setErrorMainImage("사진은 최대 5MB까지 업로드 가능합니다.");
    }
    const data = await uploadImage(file);

    if (data) {
      setMainImageURL(data);
      setErrorMainImage("");

      let image = new Image();
      image.src = data;
      image.onload = function () {
        if (image.width > image.height) {
          setWarningMainImage("red");
        } else {
          setWarningMainImage("");
        }
      };
    } else {
      setErrorMainImage("사진 업로드에 실패했습니다. 다시 시도해주세요");
    }
    e.target.value = null;
  };

  const handleRemoveMainImage = async (e) => {
    setMainImageURL();
    setErrorMainImage("");
    setWarningMainImage("");
  };

  const handleChangeImage = async (e) => {
    if (!e.target.files.length) return;

    let newImg = [];
    let error = "";

    let newImage = Array.from(e.target.files);
    for (let file of newImage) {
      if (file.size > 1024 * 1024 * 5) {
        error = "사진은 최대 5MB까지 업로드 가능합니다.";
        continue;
      }
      const data = await uploadImage(file);

      if (data) {
        newImg.push(data);
      } else {
        error = error || "사진 업로드에 실패했습니다. 다시 시도해주세요.";
      }
    }

    setImageURL([...imageURL, ...newImg]);
    setErrorImage(error);
    e.target.value = null;
  };

  // 선택한 이미지 하나씩 삭제하는 기능
  const handleRemoveImage = async (e) => {
    const idx = Number(e.currentTarget.id);
    const newImageURL = imageURL.filter((url, _idx) => idx !== _idx);
    setImageURL(newImageURL);
  };

  const handleOnKeyDownTag = (e) => {
    if (e.keyCode === 13) {
      if (!inputTag) return;
      setTagList((cur) => [...cur, inputTag]);
      setInputTag("");
    }
  };

  const handleChangeTag = (e) => {
    if (e.target.value.trim().length <= 15) {
      setInputTag(e.target.value.trimStart());
    }
  };

  const handleRemoveTag = (e) => {
    const tagId = e.target.closest(".tag-box").id;
    let newList = [...tagList];
    newList.splice(tagId, 1);
    setTagList(newList);
  };

  useEffect(() => {
    if (inputTitle || inputContent || imageURL || tagList) setInput(true);
    else setInput(false);
  }, [inputTitle, inputContent, imageURL, tagList]);

  return (
    <div className="post-form-box">
      <div className="form-header">
        <h2 className="title">
          홍보 게시글 작성하기
          {userRole === "admin" && (
            <Button onClick={() => setIsNotice(false)} size="large" color="secondary" sx={{ margin: "4px 8px" }}>
              (공지사항)
            </Button>
          )}
        </h2>
      </div>

      <div className="flex-box category">
        <div className="input flex-center">
          <label htmlFor="">카테고리</label>
          <RadioGroup name="controlled-radio-buttons-group" value={inputCategory} onChange={(e) => setInputCategiry(e.target.value)}>
            <FormControlLabel value="연극" control={<Radio size="small" />} label="연극" />
            <FormControlLabel value="기타" control={<Radio size="small" />} label="기타" />
          </RadioGroup>
        </div>
      </div>

      <div className="flex-box fixed">
        <div className="input flex-center">
          <label htmlFor="">고정</label>
          <FormControlLabel label={fixed ? "고정 됨" : "고정 안 됨"} control={<Checkbox checked={fixed} onChange={(e) => setFixed(e.target.checked)} />} />
        </div>
      </div>

      <div className="flex-box title">
        <div className="input">
          <label htmlFor="title">
            글 제목<span className="star">*</span>
          </label>
          <input type="text" id="title" name="title" value={inputTitle} onChange={handleChangeTitle} maxLength={40} placeholder="제목을 작성해 주세요." required />
        </div>
        {handleErrorPlaceholder(errorTitle)}
      </div>

      <div className="input content flex-box">
        <label htmlFor="content">
          내용<span className="star">*</span>
        </label>
        <textarea id="content" name="content" value={inputContent} onChange={handleChangeContent} placeholder="내용을 작성해 주세요." required></textarea>
        {handleErrorPlaceholder(errorContent)}
      </div>

      <div className="input tag flex-box">
        <div>
          <label htmlFor="tags">태그</label>
          <input
            type="text"
            id="tags"
            name="tags"
            onKeyDown={handleOnKeyDownTag}
            value={inputTag}
            onChange={handleChangeTag}
            placeholder="엔터를 입력하여 태그를 등록할 수 있습니다."
            maxLength={15}
          />
        </div>
        {tagList && (
          <div className="tag-list flex">
            {tagList.map((tag, idx) => (
              <div id={idx} key={tag + idx} className="tag-box flex">
                <span># {tag} </span>
                <IconButton onClick={handleRemoveTag} size="small" sx={{ padding: "2px", fontSize: 14, marginLeft: "4px" }}>
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="input image">
        <div>
          <label htmlFor="main-image">
            대표이미지<span className="star">*</span>
          </label>
          <Button id="imageBtn" color="darkGray" variant="outlined" size="small" startIcon={<DriveFolderUploadIcon />}>
            <label className="pointer" htmlFor="main-image">
              파일 찾기
            </label>
          </Button>
          <span className={"placeholder " + warningMainImage}>(세로 이미지 권장)</span>
          <input type="file" id="main-image" name="main-image" accept="image/*" onChange={handleChangeMainImage} required />
        </div>
        {errorMainImage && (
          <div className="error">
            <ErrorOutlineIcon fontSize="inherit" />
            {errorMainImage}
          </div>
        )}
        {mainImageURL && (
          <div className="main image">
            <img src={mainImageURL} onError={(e) => (e.target.src = empty_img)} />
            <IconButton className="icon" onClick={handleRemoveMainImage}>
              <Close />
            </IconButton>
          </div>
        )}
      </div>

      <div className="input image">
        <div>
          <label htmlFor="image">추가이미지</label>
          <Button id="imageBtn" color="darkGray" variant="outlined" size="small" startIcon={<DriveFolderUploadIcon />}>
            <label className="pointer" htmlFor="image">
              파일 찾기
            </label>
          </Button>
          <input type="file" id="image" name="image" accept="image/*" multiple onChange={handleChangeImage} required />
        </div>
        {errorImage && (
          <div className="error">
            <ErrorOutlineIcon fontSize="inherit" />
            {errorImage}
          </div>
        )}
        {imageURL[0] && (
          <div className="preview-box">
            {Children.toArray(
              imageURL.map((url, idx) => (
                <div className="image">
                  <img src={url} />
                  <IconButton id={idx.toString()} className="icon" onClick={handleRemoveImage}>
                    <Close />
                  </IconButton>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="form-footer">
        <div className="notice">
          <span className="star">*</span>표시가 되어 있는 항목은 필수 기재 항목입니다.
        </div>
        <div>
          <Button color="darkGray" size="large" variant="outlined" onClick={handleCancle} sx={{ marginRight: "14px" }}>
            취소
          </Button>
          <Button variant="contained" size="large" onClick={handleClickSubmitButton} disableElevation>
            등록
          </Button>
        </div>
      </div>

      <Backdrop open={openSubmit || openComplete} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <AlertCustom
          open={openSubmit}
          onclose={() => setOpenSubmit(false)}
          title={"teenybox.com 내용:"}
          content={"게시글을 작성하시겠습니까?"}
          onclick={() => {
            handleSubmit();
          }}
          checkBtn={"등록"}
          closeBtn={"취소"}
          checkBtnColor={"#42BB48"}
        />
        <AlertCustom
          open={openComplete}
          onclose={() => {
            setOpenComplete(false);
            nav("/promotion");
          }}
          onclick={() => {
            setOpenComplete(false);
            nav("/promotion");
          }}
          title={"teenybox.com 내용:"}
          content={"글 등록이 완료되었습니다!"}
          btnCloseHidden={true}
          time={1000}
        />
      </Backdrop>
    </div>
  );
}
