import { FiCopy } from "react-icons/fi";
import Logo from "../common/Logo";
import useSearchPassword from "../../hooks/auth/useSearchPassword";
import "../../style/auth/SearchPassword.css";

const SearchPassword = ({ closeModal }) => {
  const {
    email,
    tempPassword,
    verificationCode,
    showVerificationInput,
    isEmailVerified,
    handleEmailChange,
    handleSearchPassword,
    handleCopyPassword,
    handleRequestVerificationCode,
    handleVerifyCode,
    handleVerificationCodeChange,
    verificationStatusMessage,
  } = useSearchPassword(closeModal);

  return (
    <div>
      <div className="modalLogo">
        <Logo />
      </div>
      <form onSubmit={handleSearchPassword} className="searchPasswordForm">
        <h2 className="searchPasswordh2">비밀번호 찾기</h2>

        {/* 이메일 입력 */}
        <div className="inputFieldSearchPass">
          <input
            type="email"
            name="email"
            placeholder="이메일 입력"
            value={email}
            onChange={handleEmailChange}
            required
          />

          {/* 인증 요청 버튼 */}
          <div className="inputField verificationField">
          <button className="verificationButton" type="button" onClick={handleRequestVerificationCode}>
          인증 요청
          </button>
          </div>

        </div>

        {/* 경고문 , 인증성공 메세지 */}
        {verificationStatusMessage && (
                        <p className="verificationMessage">{verificationStatusMessage}</p>
                      )}

        {/* 인증번호 입력칸 */}
        {showVerificationInput && (
          <div className="inputFieldSearchPass">
            <input
              type="text"
              placeholder="인증번호 입력"
              value={verificationCode}
              onChange={handleVerificationCodeChange}
            />
            <div className="inputField verificationField">
            <button className="verificationButton" type="button" onClick={handleVerifyCode}>
              인증 확인
            </button>
            </div>
            
          </div>
        )}

        {/* 임시 비밀번호 출력 */}
        {tempPassword && (
          <div onClick={handleCopyPassword} style={{ cursor: "pointer" }}>
            <p className="noticeTempPass">임시 비밀번호가 발급되었습니다. 비밀번호 변경후 사용해 주십시오</p>
            <p>
              임시 비밀번호 :
              <strong>
                <>
                  <FiCopy className="copyIcon" />
                  {tempPassword}
                </>
              </strong>
            </p>
          </div>
        )}

        {/* 비밀번호 찾기 버튼 (인증 전에는 비활성화) */}
        <button type="submit" className="modalButton" disabled={!isEmailVerified}>
          비밀번호 찾기
        </button>
      </form>
    </div>
  );
};

export default SearchPassword;
