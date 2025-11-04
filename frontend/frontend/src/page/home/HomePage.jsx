import "../../style/home/HomePage.css";
import RecommendTop from "../../components/home/RecommendTop";
import TopHome from "../../components/home/TopHome";
import ActionTopGenre from "../../components/home/ActionTopGenre";
import FantasyTopGenre from "../../components/home/FantasyTopGenre";

const HomePage = () => {
  return (
    <div className="homePage">
      <RecommendTop />
      <TopHome />
      <ActionTopGenre />
      <FantasyTopGenre />
    </div>
  );
};

export default HomePage;
