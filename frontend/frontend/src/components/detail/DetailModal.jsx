import { useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa"; 
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import DetailMoviePoster from "../../components/detail/DetailMoviePoster";
import DetailRecommendMoviePoster from "./DetailRecommendMoviePoster ";
import DetailMovieInfo from "../../components/detail/DetailMovieInfo";
import DetailMovieTrailer from "../../components/detail/DetailMovieTrailer";
import DetailMovieCastPoster from "./DetailMovieCastPoster";
import fetchMovieDetails from "../../api/movie/detailMovie";
import fetchMovieReviews from "../../api/movie/detailMovieReviews"; 
import DetailReviewModal from "./DetailReviewModal";
import DetailReviewViewModal from "./DetailReviewViewModal";
import fetchLikeStatus from "../../api/movie/detailMovieLike";
import ToggleLike from "../../api/Like/toggleLike";
import "../../style/detail/DetailModal.css";
import TimeAgo from "../../components/detail/TimeAgo";
import Swal from "sweetalert2";


const DetailModal = ({ closeModal }) => {
  const location = useLocation();
  const { result } = location.state || {};
  const navigate = useNavigate();
  const [movieData, setMovieData] = useState(null);
  const [movieReviews, setMovieReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likeStatus, setLikeStatus] = useState("none");
  const [reviewsError, setReviewsError] = useState(null); 
  const [showAllCast, setShowAllCast] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false); 
  const [showAllRecommendations, setShowAllRecommendations] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReviewViewModal, setShowReviewViewModal] = useState(false); 
  const [selectedReview, setSelectedReview] = useState(null);



  // 영화 데이터 가져오기
  useEffect(() => {
    const loadMovieDetails = async () => {
      if (!result?.movieId) {
        setError("movieId가 없습니다.");
        setLoading(false);
        return;
      }
      try {
        const data = await fetchMovieDetails(result.movieId);
        const likeStatus = await fetchLikeStatus(result.movieId);
        setMovieData(data);
        setLikeStatus(likeStatus);
      } catch (e) {
        setError("영화 정보를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    loadMovieDetails();
  }, [result]);



  
  // 리뷰 가져오기
  useEffect(() => {
    const loadMovieReviews = async () => {
      if (!result?.movieId) return;
      const reviews = await fetchMovieReviews(result.movieId);
      if (reviews?.error) {
        setReviewsError(reviews.error); 
      } else {
        setMovieReviews(reviews); 
        setReviewsError(null); 
      }
    };
    loadMovieReviews();
  }, [result]);

  //리뷰 자세히 보기 (리뷰 클릭으로 작동)
  const handleReviewClick = (review) => {
    setSelectedReview(review);   //현재 리뷰의 상태를 저장해서 가져감 
    setShowReviewViewModal(true);  
  };

  //리뷰 작성폼 버튼
  const handleReviewWriteClick = () => {
    const token = localStorage.getItem("token"); 
    if (!token) {
      Swal.fire({
        title: "로그인이 필요합니다",
        text: "리뷰 작성 기능을 사용하려면 로그인이 필요합니다.",
        icon: "warning",
        confirmButtonText: "확인",
        confirmButtonColor: "#3085d6" 
      }).then(() => {
      });
      return;
    }
    setShowReviewModal(true);  
  };

  //확인
  const handleReviewSubmit = (review_comment) => {
    console.log("작성된 리뷰:", review_comment);
  };

    // 좋아요 토글
    const handleLikeClick = async () => {
      const token = localStorage.getItem("token");  
    if (!token) {
      Swal.fire({
        title: "로그인이 필요합니다",
        text: "좋아요 기능을 사용하려면 로그인이 필요합니다.",
        icon: "warning",
        confirmButtonText: "확인",
        confirmButtonColor: "#3085d6" 
      }).then(() => {
      });
      return;
    }
    if (likeStatus === "UnLike" || likeStatus === null) {
      await ToggleLike(movie.id);
      setLikeStatus("liked");
    } else if (likeStatus === "liked") {
       await ToggleLike(movie.id);
      setLikeStatus("UnLike");
    } 
  };


    if (loading) return;
    if (error || !movieData) return <div>{error || "데이터 없음"}</div>;
    const { movie, cast, crew, recommendedMovies } = movieData;
    const displayedCast = showAllCast ? cast : cast.slice(0, 6);
    const displayedReviews = showAllReviews ? movieReviews : movieReviews.slice(0, 4); 
    const displayedRecommendations = showAllRecommendations
      ? recommendedMovies
      : recommendedMovies.slice(0, 10);

  console.log('releaseDate prop:', movie.releaseDate);
  return (
  
    <div className="DetailModalOverlay" onClick={closeModal}>
      <div className="DetailModal" onClick={(e) => e.stopPropagation()}>
        <div className="DetailModalHeader">
        <button className="BackButton" onClick={() => navigate(-1)}>
          <FaArrowLeft size={18} />뒤로가기
        </button>
        </div>    
        <div className="DetailPageMainContent">
          <div className="DetailPageMoviePoster">
            <DetailMoviePoster posterUrl={movie.posterPath}  />
          </div>   
          <div className="DetailPageTrailer">
            <DetailMovieTrailer movieName={movie.title} releaseDate={movie.releaseDate}/>
          </div>
        </div>

          <div className="DetailMovieHeader">
            <strong>{movie.title}</strong>
             <button 
              className="DetailLikeButton" 
              onClick={handleLikeClick} 
              >         
              {/* 좋아요 o 상태 */}
              {likeStatus === "liked" && (
              <span className="like-icon">❤️</span>
              )}
              {/* 좋아요 x 상태 */}
              {(likeStatus === "UnLike" || likeStatus === null) && (
                <span className="Writelike-icon">🤍</span>
              )}
            </button> 
          </div>
          

        <div className="DetailPageMovieInfoSection">
          <h3>줄거리</h3>

          <div className="DetailPageMovieInfoGrid">
            <a style={{fontWeight:'400'}}>
            <DetailMovieInfo description={movie.overview || "저장된 줄거리가 없습니다."} />
            </a>       
          </div> 
        </div>

        <div className="DetailCastSection">
          <div className="DetailCastSectionHeader">
            <h3>출연진</h3>
            {cast.length > 6 && (
              <button
                className="ShowMoreButton"
                onClick={() => setShowAllCast(!showAllCast)}
              >
                {showAllCast ? "접기" : "+ 더보기"}
              </button>
            )}
          </div>

          <div className="DetailCastGrid">
            {displayedCast.map((actor, index) => (
              <div key={index} className="CastCard">
                <DetailMovieCastPoster posterUrl={actor.profilePath} />
                <strong style={{fontSize:'14px'}}>{actor.name} ({actor.character})</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="DetailPageReviews">
          <div className="DetailPageReviewsHeader">
            <h3>리뷰</h3>
            <div className="ReviewButton">
              <button
                className="ReviewWriteButton"
                onClick={handleReviewWriteClick}
              >
                <p>리뷰 작성</p>
              </button>
               {showReviewModal && (
                <DetailReviewModal
                  onClose={() => setShowReviewModal(false)}
                  onSubmit={handleReviewSubmit}
                  movieId={movie.id}       
                  movieTitle={movie.title}
                  posterPath={movie.posterPath}
                />
              )}

            {movieReviews.length > 4 && (
              <button
                className="ShowMoreReviewButton"
                onClick={() => setShowAllReviews(!showAllReviews)}
              >
                
                {showAllReviews ? "접기" : "+ 더보기"}
              </button>
            )}
            </div>
          </div>

          <div className="DetailPageReviewsGrid">
            {movieReviews.length > 0 ? (
              displayedReviews.map((review, index) => (
                <div key={index} className="ReviewCard" onClick={() => handleReviewClick(review)}>
                    <div className="ReviewUserInfo">
                    <FaUserCircle style={{ fontSize: "20px", marginRight: "5px" }} />
                    <a style={{fontSize: "12px",fontWeight:"bold"}}>{review.nickname}</a>
                    </div>
                     <div style={{ display: 'flex', alignItems: 'center'}}>
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          style={{
                            color: i < review.review_rating ? '#ffcc00' : '#e0e0e0',
                            fontSize: '10px',
                          }}
                        >
                          ★
                        </span>
                        
                      ))}
                      <div className="DetailTimeAgo">
                      <TimeAgo updateDate={review.update_date} />
                      </div>
                    </div>
                  <hr />
                    <div className="ReviewComment">
                    <a>
                      {review.review_comment.length > 30
                        ? `${review.review_comment.slice(0, 30)}...`
                        : review.review_comment}
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <strong style={{ marginLeft: "33%" }}>현재 작성된 리뷰가 없습니다.</strong>
            )}
          </div>
        </div>


         {showReviewViewModal && selectedReview && (
          <DetailReviewViewModal
            onClose={() => setShowReviewViewModal(false)} 
            movieId={movie.id}
            movieTitle={movie.title}
            initialReviewComment={selectedReview.review_comment}
            initialReviewRating={selectedReview.review_rating}
            review_idx={selectedReview.review_idx}
            nickname={selectedReview.nickname}
            update_date={selectedReview.update_date}
            poster_path={movie.posterPath}
          />
        )}


        <div className="Recommend">
          <div className="DetailRecommendHeader">
            <h3>비슷한 영화</h3>
          </div>
          <div className="RecommendGrid">
            {displayedRecommendations.map((movie,index) => (
              <div 
              key={index} 
              className="RecommendCard"
              onClick={() => navigate("/detail", { state: { result:{...movie, movieId: movie.id}}})}
              >
                <DetailRecommendMoviePoster posterUrl={movie.poster_path} />
                <strong >{movie.title}</strong>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DetailModal;
