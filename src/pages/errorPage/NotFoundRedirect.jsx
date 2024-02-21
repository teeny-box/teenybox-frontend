import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function NotFoundRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/not-found");
  }, []);
}
