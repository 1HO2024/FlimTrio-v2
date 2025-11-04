import "../../style/common/Logo.css";

const Logo = () => {
  const handleLogoClick = () => {
    window.location.href = "/";
  };

  return (
    <div className="logo" onClick={handleLogoClick}>
      <span>Flim</span>
      <span>Trio</span>
    </div>
  );
};

export default Logo;
