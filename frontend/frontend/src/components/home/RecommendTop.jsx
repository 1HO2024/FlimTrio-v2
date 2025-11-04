import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import fetchRecommendTop from "../../api/movie/topRecommend";
import "../../style/home/TopHome.css";
import { FaFilm } from "react-icons/fa";

const RecommendTop = () => {
  const [recommendMovies, setRecommendMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const movies = await fetchRecommendTop();
        setRecommendMovies(movies);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // 로딩 완료 처리
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    if (recommendMovies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex >= recommendMovies.length - 5 ? 0 : prevIndex + 1
      );
    }, 1250);

    return () => clearInterval(interval);
  }, [recommendMovies]);

  if ( loading || recommendMovies.length === 0) {
    return null; // 로딩 중이거나 데이터가 없거나 로그인 안 되어 있을 때는 렌더링 X
  }

  return (
    <div className="topHome">
      <div className="titleContainer">
        <FaFilm className="titleIcon" />
        <div className="titleText">
          사용자 기반 TOP{recommendMovies.length} 영화
        </div>
      </div>
      <div
        className="posterGrid"
        style={{
          transform: `translateX(-${currentIndex * 220}px)`,
        }}
      >
        {recommendMovies.map((movie, index) => (
          <div
            key={index}
            className="posterContainer"
            onClick={() => navigate("/detail", { state: { result: movie } })}
          >
            <div className="rankingBadge">{index + 1}</div>
            {movie.posterPath ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                className="moviePoster"
                alt={`Movie ${index + 1}`}
              />
            ) : (
              <div className="noPoster">포스터 없음</div>
            )}
            <div className="movieTitle">{movie.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default RecommendTop;
