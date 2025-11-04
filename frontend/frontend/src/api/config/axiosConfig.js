import axios from "axios";
import Swal from "sweetalert2";
import useAuthStore from "../../store/authStore";

// axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",  // 백엔드 서버 URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,  // 크로스 도메인 쿠키 자동 포함
});

let isLogoutModalOpen = false;
// 액세스 토큰 재발급 함수
const refreshAccessToken = async () => {
  try {
  
    const response = await axiosInstance.post("/api/v1/refresh");
    return true;
  } catch (error) {
    console.error("리프레시 요청 실패:", error.response?.data || error.message);  
 
    if (error.response?.status == 498) {
      if (!isLogoutModalOpen) {
        isLogoutModalOpen = true;  // 모달 중복 방지 플래그 설정

        await Swal.fire({
          icon: "warning",
          title: "세션 종료 안내",
          text: "다른 기기에서 로그인되어 자동 로그아웃되었습니다.",
          confirmButtonText: "확인",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        logout();
        isLogoutModalOpen = false; // 플래그 해제
        window.location.href = "/";
      }

      return new Promise(() => {}); // 무한대기 상태
    }

    return Promise.reject(error);
  }
};

     
// 요청 인터셉터: 더 이상 Authorization 헤더 추가 필요 없음
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// 응답 인터셉터: 401 또는 403 처리
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    const { isLoggedIn, logout } = useAuthStore.getState();

    // 403: accessToken 만료 → 재발급 시도
    if (status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshed = await refreshAccessToken();

      if (refreshed) {
        return axiosInstance(originalRequest);  // 재시도
      } else {
        return; // 재발급 실패
      }
    }

    // 401: 인증 실패 + 로그인 상태 → 로그아웃 처리
   if (status === 401 && isLoggedIn) {
      if (!isLogoutModalOpen) {
        isLogoutModalOpen = true;  // 모달 중복 방지 플래그 설정

        await Swal.fire({
          icon: "warning",
          title: "로그아웃 안내",
          text: "인증 정보가 만료되어 자동 로그아웃되었습니다.",
          confirmButtonText: "확인",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });

        logout();
        isLogoutModalOpen = false; // 플래그 해제
        window.location.href = "/";
      }

      // 모달 뜬 상태에서는 요청을 멈춤
      return new Promise(() => {}); // 무한대기 상태
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
