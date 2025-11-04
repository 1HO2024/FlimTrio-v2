import { useState } from "react";
import passwordApi from "../../api/auth/passwordSearch";
import requestVerificationCodeApi from "../../api/auth/requestVerification";
import checkVerifyCodeApi from "../../api/auth/checkVerifyCode";

const useSearchPassword = (closeModal) => {
  const [email, setEmail] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verificationStatusMessage, setVerificationStatusMessage] = useState("");

  const handleEmailChange = (e) => setEmail(e.target.value);


  // 1. 이메일 인증 요청
  const handleRequestVerificationCode = async () => {
    try {
      await requestVerificationCodeApi(email); 
      setShowVerificationInput(true);
      setVerificationStatusMessage("인증번호가 이메일로 전송되었습니다.");
    } catch (error) {
      setVerificationStatusMessage("이메일을 잘못 입력하셨거나 등록되지 않은 이메일 입니다.");
      console.error(error);
    }
  };

  //2. 인증번호 입력값 변경
  const handleVerificationCodeChange = (e) => {
    setVerificationCode(e.target.value);
  };

  //3. 인증번호 확인
  const handleVerifyCode = async () => {
    try {
      const res = await checkVerifyCodeApi(email, verificationCode); 
      if (res.success) {
        setIsEmailVerified(true);
        setVerificationStatusMessage("이메일 인증이 완료되었습니다.");
      } else {
        setVerificationStatusMessage("인증번호가 올바르지 않습니다.");
      }
    } catch (error) {
      setVerificationStatusMessage("인증 확인 중 오류 발생.");
      console.error(error);
    }
  };

  // 4. 비밀번호 찾기 수행 = 비밀번호 임시비밀번호로 초기화 후 제공함
  const handleSearchPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await passwordApi(email);
      setTempPassword(response.tempPassword);
    } catch (error) {
      console.error(error);
    }
  };

  // 5. 복사
  const handleCopyPassword = () => {
    if (tempPassword) {
      navigator.clipboard.writeText(tempPassword);
      alert("복사되었습니다.");
    }
  };

  return {
    email,
    tempPassword,
    verificationCode,
    showVerificationInput,
    isEmailVerified,
    verificationStatusMessage,
    handleEmailChange,
    handleSearchPassword,
    handleCopyPassword,
    handleRequestVerificationCode,
    handleVerifyCode,
    handleVerificationCodeChange,
  };
};

export default useSearchPassword;
