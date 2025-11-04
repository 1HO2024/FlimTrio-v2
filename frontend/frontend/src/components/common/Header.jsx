import { FaUserCircle } from "react-icons/fa";
import Modal from "react-modal";
import Signin from "../../components/auth/Signin";
import Signup from "../../components/auth/Signup";
import Logo from "../../components/common/Logo";
import useHeader from "../../hooks/header/useHeader";
import Search from "../search/Search";
import "../../style/common/Header.css";
import { useState } from "react";
import useSignin from "../../hooks/auth/useSignin";
import SearchPassword from "../../components/auth/SearchPassword";
import UserUpdate from "../auth/userUpdate";
import useUpdate from "../../hooks/auth/useUpdate";
Modal.setAppElement("#root");

const Header = () => {
  const {
    isLoggedIn,
    isLoginModalOpen,
    isSignupModalOpen,
    isTransparent,
    user,
    handleIconClick,
    openLoginModal,
    closeLoginModal,
    openSignupModal,
    closeSignupModal,
    handleLogout,
  } = useHeader();

  const {
    isSearchPasswordModalOpen,
    openSearchPasswordModal,
    closeSearchPasswordModal,
  } = useSignin();

  const { isUpdateModalOpen, openUpdateModal, closeUpdateModal } = useUpdate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const handleDropdownEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    setIsDropdownOpen(false);
  };

  return (
    <div className={`header ${isTransparent ? "transparent" : ""}`}>
      <div className="headerContent">
        <div style={{ marginLeft: "10px" }}>
          <Logo />
        </div>

        <div className="rightContainer">
          <div className="searchContainer">
            <Search />
          </div>
          <div className="userContainer">
            {isLoggedIn ? (
              <div
                className="userIconContainer"
                onMouseEnter={handleDropdownEnter}
                onMouseLeave={handleDropdownLeave}
              >
                <FaUserCircle className="userIcon" />
                {/* 드롭다운 메뉴 */}
                {isDropdownOpen && (
                  <div className="dropdownMenu">
                    <div className="dropdownItem2">
                      <FaUserCircle
                        style={{ fontSize: "32px", marginRight: "10px" }}
                      />
                      <div>{user?.nickname}님</div>
                    </div>
                    <hr className="HeaderDivider" />
                    <div
                      className="dropdownItem"
                      onClick={handleIconClick}
                      style={{ cursor: "pointer", textAlign: "center" }}
                    >
                      MY
                    </div>
                    <div
                      className="dropdownItem"
                      onClick={handleLogout}
                      style={{ cursor: "pointer" }}
                    >
                      로그아웃
                    </div>
                    <div
                      className="dropdownItem"
                      onClick={openUpdateModal}
                      style={{ cursor: "pointer" }}
                    >
                      회원정보수정
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="HeaderText">
                <div onClick={openLoginModal} className="HeaderTextItem">
                  로그인
                </div>
                <div onClick={openSignupModal} className="HeaderTextSignUpItem">
                  회원가입
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isLoginModalOpen}
        onRequestClose={closeLoginModal}
        contentLabel="Login Modal"
        className="modalContent loginModal"
        overlayClassName="modalOverlay"
      >
        <Signin
          closeModal={closeLoginModal}
          openSignupModal={openSignupModal}
          openSearchPasswordModal={openSearchPasswordModal}
        />
      </Modal>

      <Modal
        isOpen={isSignupModalOpen}
        onRequestClose={closeSignupModal}
        contentLabel="Signup Modal"
        className="modalContent"
        overlayClassName="modalOverlay"
      >
        <Signup closeModal={closeSignupModal} openLoginModal={openLoginModal} />
      </Modal>

      <Modal
        isOpen={isSearchPasswordModalOpen}
        onRequestClose={closeSearchPasswordModal}
        contentLabel="PasswordSearch Modal"
        className="modalContent searchPasswordModal"
        overlayClassName="modalOverlay"
      >
        <SearchPassword closeModal={closeSearchPasswordModal} />
      </Modal>

      <Modal
        isOpen={isUpdateModalOpen}
        onRequestClose={closeUpdateModal}
        contentLabel="Update Modal"
        className="modalContent updateModal"
        overlayClassName="modalOverlay"
      >
        <UserUpdate closeModal={closeUpdateModal} />
      </Modal>
    </div>
  );
};

export default Header;
