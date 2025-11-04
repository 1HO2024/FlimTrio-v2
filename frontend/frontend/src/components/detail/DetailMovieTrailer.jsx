import "../../style/detail/DetailMovieTrailer.css";
import useDetailMovieTrailer from "../../hooks/detail/useDetailMovieTrailer";

const DetailMovieTrailer = ({ movieName,releaseDate }) => {
  const { trailerUrl } = useDetailMovieTrailer({ movieName,releaseDate });

  return trailerUrl ? (
    <div className="DetailMovieTrailer">
      <iframe
        width="560"
        height="315"
        src={trailerUrl}
        frameBorder="0"
        allow="autoplay"
        allowFullScreen
        title="Movie Trailer"
      ></iframe>
    </div>
  ) : (
    <div className="NoDetailMovieTrailer">
    <p className="NoTrailerMessage">예고편을 찾을 수 없습니다.</p>
    </div>
  );
};

export default DetailMovieTrailer;
