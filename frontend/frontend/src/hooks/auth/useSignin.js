import { useState } from "react";
import Swal from "sweetalert2";
import signinApi from "../../api/auth/signin";
import useAuthStore from "../../store/authStore";

const useSignin = (closeModal) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isSearchPasswordModalOpen, setIsSearchPasswordModalOpen] = useState(false);
  const login = useAuthStore((state) => state.login);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);


  const openSearchPasswordModal = () => setIsSearchPasswordModalOpen(true);
  const closeSearchPasswordModal = () => setIsSearchPasswordModalOpen(false);


  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await signinApi(email, password);

      login(response.data); 
      closeModal();

      Swal.fire({
        title: "로그인 성공!",
        text: `${response.data.nickname}님, 환영합니다!`,
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "확인",
      }).then(() => {
        window.location.reload();  // 확인 누르면 새로고침
      });;

    } catch (err) {
      setError(err.message);
      Swal.fire({
        title: "로그인 실패",
        text: "이메일 또는 비밀번호를 확인해주세요.",
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "닫기",
      });     
       closeModal();
    }
  };

 

  return {
    email,
    password,
    isSearchPasswordModalOpen,
    handleEmailChange,
    handlePasswordChange,
    handleLogin,
    openSearchPasswordModal,
    closeSearchPasswordModal,
    error,
  };
};

export default useSignin;
