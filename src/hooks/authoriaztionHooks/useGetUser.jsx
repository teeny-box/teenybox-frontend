import { useContext, useEffect } from "react";
import { AppContext } from "../../App";
import { userUrl } from "../../apis/apiURLs";

export default function useGetUser() {
  const { setUserData } = useContext(AppContext);

  const fetchUserData = async (attempt = 0) => {
    try {
      const res = await fetch(userUrl, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setUserData({ user: data.user });
      } else if (attempt < 1) {
        // 최대 한 번 더 시도
        fetchUserData(attempt + 1);
      } else {
        throw new Error("Unauthorized");
      }
    } catch (err) {
      console.error(err);
      setUserData({ user: null }); // 사용자 데이터가 없음을 나타냅니다.
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // 사용자 데이터 반환 로직은 제거됨. 상태는 전역 컨텍스트(AppContext)를 통해 관리됩니다.
}
