/* 마이페이지 - 회원정보 조회/수정/탈퇴 컴포넌트 */
import React, { useEffect, useState } from "react";
import "./MemberInfo.scss";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import { userUrl, uploadImgUrl } from "../../apis/apiURLs";
import { Alert, TextField } from "@mui/material";
import { EditAttributes, ImageSearchRounded } from "@mui/icons-material";
import { AlertCustom } from "../common/alert/Alerts";

const regex = /[!@#$%^&*(),.?":{}|<>0-9]/;

function MemberInfo({ user, setUserData }) {
  const [inputNickname, setInputNickname] = useState(user?.nickname);
  const [profileURL, setProfileURL] = useState(user?.profile_url);
  const [selectedRegion, setSelectedRegion] = useState(user?.interested_area);
  const [errorNickname, setErrorNickname] = useState("");
  const [isUnique, setIsUnique] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [openComplete, setOpenComplete] = useState(false);

  const handleChangeProfile = async (e) => {
    if (e.target.files?.[0]) {
      let formData = new FormData();
      formData.append("image_url", e.target.files[0]);

      const res = await fetch(`${uploadImgUrl}`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      console.log(data);

      if (res.ok) {
        setProfileURL(data.imageUrl);
      } else {
        console.log(data);
      }
    } else {
      setProfileURL(user.profile_url);
    }
    setIsHovered(false);
  };

  const handleChangeNickname = (e) => {
    const input = e.target.value;
    setInputNickname(input);
    setIsUnique(false);

    if (regex.test(input)) {
      setErrorNickname("특수 문자 및 숫자는 사용이 불가합니다.");
    } else if (input.length < 1) {
      setErrorNickname("최소 1자 이상 적어주세요.");
    } else {
      setErrorNickname("");
    }
  };

  const handleCheckNickname = async (e) => {
    const res = await fetch(`${userUrl}/nickname`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.user_id,
        nickname: inputNickname,
      }),
    });
    const data = await res.json();
    console.log(data);
    if (res.ok) {
      setIsUnique(true);
    }
  };

  const handleSubmit = async () => {
    const bodyData = {
      user_id: user.user_id,
      nickname: inputNickname,
      social_provider: user.social_provider,
      profile_url: profileURL,
      interested_area: selectedRegion,
    };
    const res = await fetch(`${userUrl}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(bodyData),
    });
    const data = await res.json();

    console.log(data);
    if (res.ok) {
      setUserData({ isLoggedIn: true, user: { ...user, ...bodyData } });
      setOpenComplete(true);
    }
  };

  const validateSubmit = () => {
    if (inputNickname === user.nickname && profileURL === user.profile_url && selectedRegion === user.interested_area) return false;
    if (inputNickname && profileURL && selectedRegion) {
      if (inputNickname === user.nickname || isUnique) return true;
    }
    return false;
  };

  return (
    <>
      {user && (
        <div className="member-info-container">
          <h1>회원정보 수정</h1>
          <div className="member-info-profile-box">
            <div className="profile-photo" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
              {user && <img src={profileURL} />}
              {isHovered && (
                <label className="profile-edit" htmlFor="inputFile">
                  <ImageSearchRounded className="icon" fontSize="large" />
                </label>
              )}
              <input type="file" id="inputFile" onChange={handleChangeProfile} />
            </div>
            <div className="profile-nickname">
              <p>"{user?.nickname || "user"}"님의 회원정보 페이지 입니다.</p>
            </div>
          </div>
          <div className="member-info-box">
            <div className="member-id-box">
              <p>연동 계정</p>
              <div className="member-id">{user?.social_provider}</div>
            </div>
            <div className="member-nickname-box">
              <p>닉네임</p>
              <span>
                <TextField
                  size="small"
                  error={Boolean(errorNickname)}
                  helperText={errorNickname}
                  value={inputNickname}
                  onChange={handleChangeNickname}
                  color="orange"
                  inputProps={{ maxLength: 10 }}
                />
                <Button
                  onClick={handleCheckNickname}
                  variant="outlined"
                  color="orange"
                  disabled={isUnique || errorNickname || user?.nickname === inputNickname}
                  sx={{ margin: "3px 0 0 8px" }}
                >
                  중복 확인
                </Button>
                {isUnique && (
                  <Alert severity={"success"} sx={{ padding: 0, border: "none" }} variant="outlined">
                    사용 가능한 닉네임 입니다.
                  </Alert>
                )}
              </span>
            </div>
            <div className="member-preferred-region-box">
              <p>선호지역</p>
              <div className="member-preferred-region-check-list">
                <FormControl
                  required
                  // error={error}
                  component="fieldset"
                  variant="standard"
                >
                  <FormGroup
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      flexDirection: "row",
                    }}
                  >
                    {["서울", "경기/인천", "대전/충청", "강원", "대구/경상", "부산/울산", "광주/전라", "제주"].map((region, idx) => (
                      <FormControlLabel
                        key={idx}
                        control={<Checkbox name={region} checked={region === selectedRegion} onClick={() => setSelectedRegion(region)} color="secondary" />}
                        sx={{ marginRight: "16px" }}
                        label={region}
                      />
                    ))}
                  </FormGroup>
                  <FormHelperText sx={{ fontSize: "15px" }}>변경하고자 하는 선호 지역을 체크해주세요.</FormHelperText>
                </FormControl>
              </div>
            </div>
          </div>
          <div className="member-info-btn-box">
            <Button onClick={handleSubmit} disabled={!validateSubmit()} variant="contained" sx={{ width: "120px", height: "48px" }}>
              회원정보 수정
            </Button>
          </div>
          <AlertCustom
            open={openComplete}
            onclose={() => setOpenComplete(false)}
            onclick={() => setOpenComplete(false)}
            title={"teenybox.com 내용:"}
            content={"회원정보 수정이 완료되었습니다!"}
            btnCloseHidden={true}
            time={1000}
          />
        </div>
      )}
    </>
  );
}

export default MemberInfo;
