import { useContext, useEffect } from "react";
import { userUrl } from "../../apis/apiURLs";
import { AppContext } from "../../App";

/**
 * 1. 서버에서 api 호출하여 유저 데이터를 가져오는 함수.
 * 2. 최대 세 번까지 조건 처리하여 반복 처리 함.
 * 3. 마지막으로 전역 context에 유저 데이터를 업데이트
 */
export default function useGetUser() {
  const { userData, setUserData } = useContext(AppContext);

  const fetchUserData = async (attempt = 0) => {
    try {
      const res = await fetch(`${userUrl}`, { method: "GET", credentials: "include" });

      if (res.ok) {
        const data = await res.json();
        setUserData(data.user);
      } else if (attempt < 3) {
        // 최대 3번까지 재시도
        setTimeout(
          () => {
            fetchUserData(attempt + 1);
          },
          1000 * 2 ** attempt,
        ); // 지수 백오프 전략을 사용하여 지연 시간 증가
      } else {
        throw new Error("사용자 데이터를 불러오지 못했습니다.");
      }
    } catch (err) {
      console.error(err);
      setUserData(null); // 사용자 데이터가 없음을 나타냅니다.
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // 사용자 데이터 반환.
  return userData;
}
