import "../../style/detail/DetailRecommendMoviePoster.css";

const DetailRecommendMoviePoster = ({ posterUrl }) => {
  return (
    <div className="DetailRecommendMoviePoster">
      <img src={`https://image.tmdb.org/t/p/w500${posterUrl}`} alt="Movie Poster" />
    </div>
  );
};

export default DetailRecommendMoviePoster;
