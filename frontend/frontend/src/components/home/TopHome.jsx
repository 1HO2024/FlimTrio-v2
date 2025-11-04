import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import fetchTopMovie from "../../api/movie/topMovie";
import "../../style/home/TopHome.css";
import { FaFilm } from "react-icons/fa";

const TopHome = () => {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const moviePosters = await fetchTopMovie();
        setMovies(moviePosters);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    if (movies.length === 0) return;
  
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        if (prevIndex >= movies.length - 6) {
          return 0; // 10번이 보일때쯤 다시 처음으로 
        }
        return prevIndex + 1;
      });
    }, 1500);
  
    return () => clearInterval(interval);
  }, [movies.length]);

  return (
    <div className="topHome">
      <div className="titleContainer">
        <FaFilm className="titleIcon" />
        <div className="titleText">오늘의 Top10 영화</div>
      </div>
      {movies.length === 0 ? (
        <div>포스터를 불러오는 중...</div>
      ) : (
        <div>
          <div
            className="posterGrid"
            style={{
              transform: `translateX(-${currentIndex * 220}px)`,
            }}
          >
            {movies.map((movie, index) => (
              <div
              key={index}
              className="posterContainer"
              onClick={() => navigate("/detail", { state: { result:{...movie, movieId: movie.id}} })}
              >
                <div className="rankingBadge">{index + 1}</div>
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                  className="moviePoster"
                  alt={`Movie ${index + 1}`}
                />
                <div className="movieTitle">{movie.title}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopHome;
