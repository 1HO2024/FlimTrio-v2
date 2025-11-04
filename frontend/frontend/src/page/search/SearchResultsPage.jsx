import { useLocation } from "react-router-dom";
import "../../style/search/SearchResults.css";
import { useNavigate } from "react-router-dom"; 
import DetailModal from "../../components/detail/DetailModal";

const SearchResults = () => {
  const location = useLocation();
  const { searchTerm, moviesResults } = location.state || {}; // moviesResults를 안전하게 읽음
  const navigate = useNavigate();

  // 안전한 접근을 위해 moviesResults를 빈 배열로 기본값 설정
  const results = moviesResults || [];

  // 중복 제거: movie.id를 기준으로 중복을 제거
  const uniqueResults = [
    ...new Map(results.map(movie => [movie.id, movie])).values()
  ];

  return (
    <div className="SRsearchResults">
      <div className="SRsearchHeader">
        <h1>"{searchTerm}" 검색 결과</h1>
      </div>
      <div className="SRposterGrid">
        {uniqueResults.length > 0 ? (
          uniqueResults.map((movie, index) => (
            <div className="SRposter" key={index}
            onClick={() => navigate("/detail", { state: { result:{...movie, movieId: movie.id}} })}>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                alt={movie.title}
              />
              <p>{movie.title}</p>
            </div>
          ))
        ) : (
          
          
          <div className="NoSRsearch">
            검색 결과가 없습니다.
          </div>
          
          
        )}
      </div>
    </div>
  );
};

export default SearchResults;
