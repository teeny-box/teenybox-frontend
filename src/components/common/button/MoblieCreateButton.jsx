import React, { useEffect, useState } from "react";
import "./MoblieCreateButton.scss";
import moblie_edit_icon from "../../../assets/img/moblie_edit_icon.svg";

export function MoblieCreateButton({ y, onClick }) {
  const [showUpButton, setShowUpButton] = useState(window.scrollY > (y || 1));

  useEffect(() => {
    const handleShowButton = () => {
      if (window.scrollY > (y || 1)) {
        setShowUpButton(true);
      } else {
        setShowUpButton(false);
      }
    };

    window.addEventListener("scroll", handleShowButton);
    return () => {
      window.removeEventListener("scroll", handleShowButton);
    };
  }, []);

  return <img onClick={onClick} src={moblie_edit_icon} alt="글쓰기" className={`create-button-moblie pointer ${showUpButton ? "up" : "down"}`} />;
}
