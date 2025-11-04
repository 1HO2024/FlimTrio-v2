import useUpdate from "../../hooks/auth/useUpdate";
import "../../style/auth/UserUpdate.css";
import Logo from "../../components/common/Logo";
const UserUpdate = ({ closeModal }) => {
  const {
    handleUpdate,
    nickname,
    password,
    setNickname,
    setPassword,
    onSubmit,
  } = useUpdate(closeModal);

  return (
    <div>
      <div className="modalLogo">
        <Logo />
      </div>

      <form onSubmit={onSubmit} className="userUpdateForm">
        <h2 className="userUpdateh2">회원정보수정</h2>
        <div className="inputField">
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임"
            required
          />
        </div>
        <div className="inputField">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="비밀번호"
          />
        </div>
        <div className="modalButtonContainer">
          <button type="submit" onClick={handleUpdate} className="modalButton">
            수정
          </button>
          <button type="button" onClick={closeModal} className="modalButton">
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserUpdate;
