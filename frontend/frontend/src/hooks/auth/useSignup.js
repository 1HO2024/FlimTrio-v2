import { useState } from "react";
import signupApi from "../../api/auth/signup";
import requestVerificationCodeApi from "../../api/auth/signupRequestVerification";
import verifyCodeApi from "../../api/auth/singnupCheckVerifyCode";
import Swal from "sweetalert2";

const useSignup = (closeModal) => {
  // 사용자 입력 상태
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // 오류 및 이메일 인증 상태
  const [error, setError] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verificationStatusMessage, setVerificationStatusMessage] = useState("");

  // 입력 핸들러
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setIsEmailVerified(false); // 이메일 바꾸면 인증 다시 받아야 함
  };

  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);
  const handleNicknameChange = (e) => setNickname(e.target.value);

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    const formattedPhone = value
      .replace(/[^0-9]/g, "")
      .replace(/^(\d{3})(\d{3,4})(\d{4})$/, "$1-$2-$3");
    setPhoneNumber(formattedPhone);
  };

  // 이메일 인증 요청
  const handleRequestVerificationCode = async () => {
    try {
      if (!email) {
        setVerificationStatusMessage("이메일을 먼저 입력하세요.");
        return;
      }

      await requestVerificationCodeApi(email); // 서버 호출
      setShowVerificationInput(true);
      setVerificationStatusMessage("인증번호가 이메일로 전송되었습니다.");
    } catch (error) {
      setVerificationStatusMessage("이메일을 잘못 입력하셨거나 등록되어 있은 이메일 입니다.");
    }
  };

  // 인증번호 입력 핸들러
  const handleVerificationCodeChange = (e) => {
    setVerificationCode(e.target.value);
  };

  // 인증번호 검증
  const handleVerifyCode = async () => {
    try {
      const res = await verifyCodeApi(email, verificationCode);
      if (res.success) {
        setIsEmailVerified(true);
        setVerificationStatusMessage("이메일 인증이 완료되었습니다.");
      } else {
        setVerificationStatusMessage("인증번호가 올바르지 않습니다.");
      }
    } catch (error) {
      setVerificationStatusMessage("인증 실패: " + error.message);
    }
  };

  // 회원가입 제출
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword || !nickname || !phoneNumber) {
      setError("모든 입력창을 입력해주세요.");
      return;
    }

    if (!isEmailVerified) {
      setError("이메일 인증을 완료해주세요.");
      return;
    }

    if (!/^[a-zA-Z0-9]{8,15}$/.test(password)) {
      setError("비밀번호는 8자 이상 15자 이하의 영문과 숫자 조합이어야 합니다.");
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("이메일 형식으로 입력해주세요.");
      return;
    }

    setError("");

    try {
      await signupApi(nickname, email, password, phoneNumber);
      closeModal();

      Swal.fire({
        icon: "success",
        title: "회원가입 완료",
        text: "회원가입이 완료되었습니다!",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "확인",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    email,
    password,
    confirmPassword,
    nickname,
    phoneNumber,
    error,
    verificationCode,
    showVerificationInput,
    isEmailVerified,
    verificationStatusMessage,
    handleEmailChange,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handleNicknameChange,
    handlePhoneNumberChange,
    handleRequestVerificationCode,
    handleVerificationCodeChange,
    handleVerifyCode,
    handleSubmit,
  };
};

export default useSignup;
