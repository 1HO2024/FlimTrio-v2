import React from "react";
import Logo from "../../components/common/Logo";
import "../../style/auth/Signup.css";
import useSignup from "../../hooks/auth/useSignup";

const Signup = ({ closeModal, openLoginModal }) => {
  const {
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
    handleSubmit,
    handleRequestVerificationCode,
    handleVerificationCodeChange,
    handleVerifyCode,
  } = useSignup(closeModal);

  return (
    <div>
      <div className="modalLogo">
        <Logo />
      </div>

      <form onSubmit={handleSubmit} className="signupForm">
        <h2 className="signuph2">회원가입</h2>

        {/* 이메일 입력 */}
        <div className="EmailInputField">
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleEmailChange}
            required
            placeholder="이메일"
          />
        {/* 이메일 인증 요청 버튼 */}
        <div className="inputField verificationField">
          <button type="button" className="verificationButton" onClick={handleRequestVerificationCode}>
            인증 요청
          </button>
        </div>
        </div>

        {verificationStatusMessage && (
                  <p className="signupVerificationMessage">{verificationStatusMessage}</p>
                )}

        {/* 인증번호 입력창 */}
        {showVerificationInput && (
          <div className="EmailInputField">
            <input
              type="text"
              placeholder="인증번호 입력"
              value={verificationCode}
              onChange={handleVerificationCodeChange}
            />
            <div className="inputField verificationField">
            <button type="button" className="verificationButton" onClick={handleVerifyCode}>
              인증 확인
            </button>
            </div>
          </div>
        )}

        {/* 나머지 회원가입 입력 필드 */}
        <div className="inputField">
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            required
            placeholder="비밀번호"
          />
        </div>

        <div className="inputField">
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
            placeholder="비밀번호 확인"
          />
        </div>

        <div className="inputField">
          <input
            type="text"
            id="nickname"
            name="nickname"
            value={nickname}
            onChange={handleNicknameChange}
            required
            placeholder="닉네임"
          />
        </div>

        <div className="inputField">
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            required
            placeholder="전화번호"
          />
        </div>

        {/* 회원가입 버튼 - 이메일 인증이 완료되어야 활성화 */}
        <button type="submit" className="modalButton" disabled={!isEmailVerified}>
          회원가입
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      <div className="loginPrompt">
        <span>이미 계정이 있으신가요? </span>
        <button
          onClick={() => {
            closeModal();
            openLoginModal();
          }}
          className="loginButton"
        >
          로그인
        </button>
      </div>
    </div>
  );
};

export default Signup;
