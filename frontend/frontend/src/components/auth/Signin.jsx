import React from "react";
import Logo from "../../components/common/Logo";
import "../../style/auth/Signin.css";
import useSignin from "../../hooks/auth/useSignin";

const Signin = ({ closeModal, openSignupModal, openSearchPasswordModal }) => {
  const {
    email,
    password,
    handleEmailChange,
    handlePasswordChange,
    handleLogin,
  } = useSignin(closeModal);

  return (
    <div>
      <div className="modalLogo">
        <Logo />
      </div>

      <form onSubmit={handleLogin} className="signinForm">
        <h2 className="signinh2">로그인</h2>
        <div className="inputField">
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleEmailChange}
            required
            placeholder="이메일"
          />
        </div>
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
        <button type="submit" className="modalButton">
          로그인
        </button>
        <div
          onClick={() => {
            closeModal();
            openSearchPasswordModal();
          }}
          className="forgotPassword"
        >
          <a>비밀번호를 잊어버리셨나요?</a>
        </div>
        <div className="signupPrompt">
          <span>계정이 없으신가요?</span>
          <button
            onClick={() => {
              closeModal();
              openSignupModal();
            }}
            className="signupLink"
          >
            회원가입
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signin;
