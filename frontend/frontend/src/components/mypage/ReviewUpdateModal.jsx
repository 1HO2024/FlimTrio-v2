import React, { useState, useEffect } from 'react';
import { FaUserCircle } from "react-icons/fa";
import "../../style/detail/DetailReviewModal.css";
import UpdateMovieReviews from '../../api/review/UpdateMovieReviews';
import useHeader  from "../../hooks/header/useHeader";

const StarRating = ({ maxStars = 5, rating, onRatingChange }) => {
  const handleClick = (starIndex) => {
    const newRating = starIndex + 1;
    onRatingChange(newRating);  
  };

  return (
    <div className="StarRating">
      {Array.from({ length: maxStars }, (_, index) => (
        <span
          key={index}
          className={`star ${index < rating ? 'filled' : 'empty'}`}
          onClick={() => handleClick(index)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const UpdateReviewModal = ({ onClose, movieId, movieTitle, initialReviewComment, initialReviewRating, review_idx ,poster_path}) => {
  const [review_comment, setReviewText] = useState(initialReviewComment || ''); 
  const [review_rating, setRating] = useState(initialReviewRating || 0); 
  const [loading, setLoading] = useState(false);  
  const [error, setError] = useState(null); 
  const [successMessage, setSuccessMessage] = useState(null);  
  const { user } = useHeader();

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await UpdateMovieReviews(movieId, review_comment, review_rating,review_idx);

      if (result.error) {
        if (result.error) {
          setError(result.error);  
        }
      } else {
        alert("리뷰가 성공적으로 수정되었습니다!");  
        onClose();  
        window.location.reload();
      }; 
    } catch (err) {
      setError("알수없는 오류 , 로그인 인증문제");
    } finally {
      setLoading(false);
    }
  };

  console.log(poster_path);

  return (
    <div className="ReviewModalBackdrop">
      <div className="ReviewModal">
        <h2>리뷰 수정</h2>

        <div className='movieInfoGrid'>
          <div className='movieInfo'>
         <img
              src={`https://image.tmdb.org/t/p/w500${poster_path}`}
              className="ReviewModalPoster"
         />
            <div className='movieInfoTitle'>
            <strong>{movieTitle}</strong>
            </div>
           </div>
          

         <div className='movieReviewContent'>    
            <div className="ReviewModalStar">
             <div className='ReviewModalUserInfo'>
             <FaUserCircle style={{ fontSize: "32px", marginRight: "10px" }} />
             <strong>{user.nickname}님</strong>
            </div>
            <strong>별점:</strong>
            <StarRating rating={review_rating} onRatingChange={setRating} />
            </div>
            <textarea
               placeholder="리뷰를 작성해주세요."
               value={review_comment}
               onChange={(e) => setReviewText(e.target.value)}
            />
            </div>
          </div>



        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <div className="ModalButtons">
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "수정 중..." : "수정 완료"}
          </button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default UpdateReviewModal;
