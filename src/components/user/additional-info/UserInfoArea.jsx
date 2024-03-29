import ProfileImgContainer from "./ProfileImgContainer";
import NicknameContainer from "./NicknameContainer";
import "./UserInfoArea.scss";

export default function UserInfoArea({
  selectedImg,
  setSelectedImg,
  nicknameInfo,
  setNicknameInfo,
  profileUrl,
  user_id,
  setToDeleteImg,
}) {
  return (
    <>
      <div className="user-info-area">
        <ProfileImgContainer
          selectedImg={selectedImg}
          setSelectedImg={setSelectedImg}
          profileUrl={profileUrl}
          setToDeleteImg={setToDeleteImg}
        />
        <NicknameContainer
          nicknameInfo={nicknameInfo}
          setNicknameInfo={setNicknameInfo}
          user_id={user_id}
        />
      </div>
      <hr />
    </>
  );
}
