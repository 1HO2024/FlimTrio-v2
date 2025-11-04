import React, { useEffect, useState } from "react";
import fetchMyReviews from "../../api/mypage/MyReviews";
import "../../style/mypage/MyReviews.css";
import UpdateReviewModal from "./ReviewUpdateModal";
import DeleteMovieReviews from "../../api/review/DeleteMovieReview";
import { FaFilm } from "react-icons/fa";

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(null);  // 리뷰별로 모달 상태 관리

  const handleUpdateReviewSubmit = (review_comment) => {
    console.log("수정 작성된 리뷰:", review_comment);
  };

  useEffect(() => {
    const loadReviews = async () => {
      const data = await fetchMyReviews();
      setReviews(data);
      setLoading(false);
    };

    loadReviews();
  }, []);

  const toggleShowAll = () => {
    setShowAll(!showAll); 
  };

  const handleModalClose = () => {
    setShowReviewModal(null);  
  };

  const handleReviewUpdate = (reviewId) => {
    setShowReviewModal(reviewId);  
  };

  const handleReviewDelete = async (reviewId) => {
    try {
      const result = await DeleteMovieReviews(reviewId);
      if (result.success) {   
        setReviews((prevReviews) => prevReviews.filter(review => review.review_idx !== reviewId));
      } else {
        alert("리뷰 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("리뷰 삭제 실패:", error);
      alert("리뷰 삭제 중 오류가 발생했습니다.");
    }
  };


  if (loading) {
    return;
  }

  if (reviews.length === 0) {
    return (
      <div className="MyPageReviews" style={{marginTop:"150px"}}>
        <h2 className="MyReviewsHeader"><FaFilm className="MytitleIcon" />내가 작성한 리뷰</h2>
         <h5 style={{marginLeft:"35px"}}>현재 작성한 리뷰가 없습니다.</h5>
      </div>
    );
  }

  return (
    <div className="MyPageReviews">
      <h2 className="MyReviewsHeader"><FaFilm className="MytitleIcon" />내가 작성한 리뷰</h2>
      <div className="MyPageReviewsGrid">
        {(showAll ? reviews : reviews.slice(0, 8)).map((review) => (
          <div key={review.review_idx} className="Myreviewcard">
            <div className="ReviewContent">
              <img
                src={`https://image.tmdb.org/t/p/w500${review.poster_path}`}
                className="ReviewMoviePoster"
                alt={`Movie ${review.review_idx}`}
              />

              <div className="ReviewDetails">
                <h3 className="ReviewMovieTitle">{review.title || "영화 제목 없음"}</h3>

                <h2 className="ReviewStar">
                  {typeof review.review_rating === "number"
                    ? [...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={i < review.review_rating ? "filled-star" : "empty-star"}
                        >
                          {i < review.review_rating ? "★" : "☆"}
                        </span>
                      ))
                    : "No rating"}
                </h2>

                <strong className="ReviewComment">{review.review_comment}</strong>
                <small className="ReviewWriteDate">작성일: {review.write_date?.slice(0, 10)}</small>

                {/* 리뷰 수정 버튼 */}
                <button className="ReviewUpdate" onClick={() => handleReviewUpdate(review.review_idx)}>
                  리뷰 수정
                </button>

                <button className="ReviewDelete" onClick={() => handleReviewDelete(review.review_idx)}>
                  리뷰 삭제
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 8개 이상의 카드가 있을 경우에만 접기/펼치기 버튼을 보여줌 */}
      {reviews.length > 8 && (
        <button className="ToggleShowButton" onClick={toggleShowAll}>
          {showAll ? "접기" : "모두 보기"}
        </button>
      )}

      {/* 모달 오버레이 */}
      {showReviewModal && (
        <div className="ModalOverlay">
          <UpdateReviewModal
            onClose={handleModalClose}
            onSubmit={handleUpdateReviewSubmit}
            movieId={reviews.find(review => review.review_idx === showReviewModal)?.id}
            movieTitle={reviews.find(review => review.review_idx === showReviewModal)?.title}
            initialReviewComment={reviews.find(review => review.review_idx === showReviewModal)?.review_comment}
            initialReviewRating={reviews.find(review => review.review_idx === showReviewModal)?.review_rating}
            review_idx={reviews.find(review => review.review_idx === showReviewModal)?.review_idx}
            poster_path={reviews.find(review => review.review_idx === showReviewModal)?.poster_path}
          />
        </div>
      )}
    </div>
  );
};

export default MyReviews;
