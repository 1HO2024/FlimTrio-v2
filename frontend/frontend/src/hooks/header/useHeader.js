import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import Swal from "sweetalert2";
import axiosInstance from "../../api/config/axiosConfig";

const useHeader = () => {
  const { isLoggedIn, user, logout } = useAuthStore();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isTransparent, setIsTransparent] = useState(false);
  const navigate = useNavigate();

 
  const handleLogout = async () => {
  try {
    await axiosInstance.post("/api/v1/signout"); // 로그아웃 API 호출

    // 상태 초기화 및 페이지 이동
    logout(); 
    navigate("/");

    Swal.fire({
      title: "로그아웃 성공!",
      text: `로그아웃 되었습니다.`,
      icon: "success",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "확인",
    });
  } catch (error) {
    console.error("로그아웃 실패:", error);
    Swal.fire({
      title: "로그아웃 실패",
      text: "다시 시도해주세요.",
      icon: "error",
    });
  }
};

  const handleIconClick = () => {
    if (isLoggedIn) navigate("/mypage");
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);
  const openSignupModal = () => setIsSignupModalOpen(true);
  const closeSignupModal = () => setIsSignupModalOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsTransparent(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return {
    isLoggedIn,
    user, 
    isLoginModalOpen,
    isSignupModalOpen,
    isTransparent,
    handleIconClick,
    openLoginModal,
    closeLoginModal,
    openSignupModal,
    closeSignupModal,
    handleLogout,
  };
};

export default useHeader;
