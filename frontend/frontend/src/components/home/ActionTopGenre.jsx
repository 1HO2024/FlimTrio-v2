import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import fetchTopGenre from "../../api/movie/topGenre";
import "../../style/home/TopHome.css";
import { FaFilm } from "react-icons/fa";

const ActionTopGenre = () => {
  const [genreMovies, setGenreMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [genreName, setGenreName] = useState("액션");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const movies = await fetchTopGenre(genreName);
        setGenreMovies(movies);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMovies();
  }, [genreName]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        if (prevIndex >= genreMovies.length - 6) {
          return 0; // 10번이 보일때쯤 다시 처음으로 
        }
        return prevIndex + 1;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [genreMovies]);

  return (
    <div className="topHome">
      <div className="titleContainer">
        <FaFilm className="titleIcon" />
        <div className="titleText">
          {genreName} Top {genreMovies.length} 영화
        </div>
      </div>
      <div
        className="posterGrid"
        style={{
          transform: `translateX(-${currentIndex * 220}px)`,
        }}
      >
        {genreMovies.map((movie, index) => (
          <div
            key={index}
            className="posterContainer"
            onClick={() => navigate("/detail", { state: { result:{...movie, movieId: movie.id}} })}
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

export default ActionTopGenre;
