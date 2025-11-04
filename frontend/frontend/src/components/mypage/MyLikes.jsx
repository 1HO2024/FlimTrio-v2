import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import fetchMyLikes from "../../api/mypage/MyLikes"; // 경로 확인 필요
import "../../style/mypage/MyLikes.css";
import ToggleLike from "../../api/Like/toggleLike";
import { FaFilm} from "react-icons/fa";

const MyLikes = () => {
  const [likedMovies, setLikedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false); // 접기/펼치기 상태 관리
  const navigate = useNavigate();

  useEffect(() => {
    const loadLikedMovies = async () => {
      const data = await fetchMyLikes();
      setLikedMovies(data);
      setLoading(false);
    };

    loadLikedMovies();
  }, []);

  const toggleShowAll = () => {
    setShowAll(!showAll); // "펼치기/접기" 상태 토글
  };

  const handleUnlike = async (movieId) => {
  try {
    // 실제 API 호출로 교체 필요
    await ToggleLike(movieId); 
    setLikedMovies((prev) => prev.filter((movie) => movie.id !== movieId));
  } catch (error) {
    console.error("좋아요 삭제 실패:", error);
  }
  };

  if (loading) {
    return;
  }

  if (likedMovies.length === 0) {
    return <div className="MyPageLikes">
             <h2 className="MyLikesHeader"><FaFilm className="MytitleIcon" />좋아요 표시한 영화</h2>
              <h5 style={{marginLeft:"35px"}}>좋아요 표시한 영화가 없습니다</h5>
             </div>;
  }

  return (
    <div className="MyPageLikes">
      <h2 className="MyLikesHeader"><FaFilm className="MytitleIcon" />좋아요 표시한 영화</h2>
      <div className="MyLikeseReviewsGrid">
        {(showAll ? likedMovies : likedMovies.slice(0, 12)).map((movie, index) => (
          <div key={movie.id} className="MyLikeCard"
          onClick={() => navigate("/detail", { state: { result:{...movie, movieId: movie.id}} })}>
            <button className="HeartCancleButton"
             onClick={(e) => {
             e.stopPropagation();
             handleUnlike(movie.id); 
            }}>   
              <a className="TrashIcon">x</a>
            </button>
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              className="LikeMoviePoster"
              alt={`Movie ${index + 1}`}
            />
            <h3 className="LikeMovieTitle">{movie.title}</h3>
          </div>
        ))}
      </div>

      {/* 8개 이상의 카드가 있을 경우에만 접기/펼치기 버튼을 보여줌 */}
      {likedMovies.length > 12 && (
        <button
          className="ToggleShowButton"
          onClick={toggleShowAll}
        >
          {showAll ? "접기" : "모두 보기"}
        </button>
      )}
    </div>
  );
};

export default MyLikes;
