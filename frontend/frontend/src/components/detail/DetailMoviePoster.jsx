import "../../style/detail/DetailMoviePoster.css";

const DetailMoviePoster = ({ posterUrl }) => {
  return (
    <div className="DetailMoviePoster">
      <img src={`https://image.tmdb.org/t/p/w500${posterUrl}`} alt="Movie Poster" />
    </div>
  );
};

export default DetailMoviePoster;
