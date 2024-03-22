import { useState } from "react";
import { Modal, Backdrop, Box } from "@mui/material";
import { Close } from "@mui/icons-material";

export default function ImageExpandModal({ imgSrc, setClickedPhoto }) {
  const [open, setOpen] = useState(true);

  const boxStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const imgStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "100%",
    maxHeight: "100%",
  };

  const closeIconStyle = {
    position: "absolute",
    top: "10px",
    right: "10px",
    cursor: "pointer",
  };

  const handleClose = () => {
    setOpen(false);
    setClickedPhoto(null);
  };

  return (
    <Modal
      open={open}
      BackdropComponent={(props) => <Backdrop {...props} onClick={() => handleClose()} />}
      style={{
        backgroundColor: "rgb(0, 0, 0, 0.43)",
      }}
    >
      <Box sx={{ boxStyle }}>
        <img src={imgSrc} alt="확대된 리뷰 이미지" style={imgStyle} />
        <Close fontSize="large" color="ourGray" style={closeIconStyle} onClick={() => handleClose()} />
      </Box>
    </Modal>
  );
}
