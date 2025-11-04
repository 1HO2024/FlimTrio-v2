import React, { useState, useEffect } from 'react';
import { FaUserCircle } from "react-icons/fa";
import "../../style/detail/DetailReviewModal.css";
import useHeader from "../../hooks/header/useHeader";
import TimeAgo from "../../components/detail/TimeAgo";

const StarRating = ({ maxStars = 5, rating, onRatingChange }) => {
  return (
    <div className="StarRating">
      {Array.from({ length: maxStars }, (_, index) => (
        <span
          key={index}
          className={`star ${index < rating ? 'filled' : 'empty'}`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const DetailReviewViewModal = ({ onClose, movieTitle, initialReviewComment, initialReviewRating, nickname, poster_path ,update_date}) => {
  const [review_comment, setReviewText] = useState(initialReviewComment || ''); 
  const [review_rating, setRating] = useState(initialReviewRating || 0); 


  // 모달 외부 클릭 시 모달을 닫는 함수
  const handleBackdropClick = (e) => {
    // 모달 내부를 클릭한 경우에는 닫히지 않도록 함
    if (e.target.classList.contains('ReviewModalBackdrop')) {
      onClose();
    }
  };

  return (
    <div className="ReviewModalBackdrop" onClick={handleBackdropClick}>
      <div className="ReviewModal">
        <h2>리뷰 보기</h2>

        <div className='movieInfoGrid'>
          <div className='movieInfo'>
            <img
              src={`https://image.tmdb.org/t/p/w500${poster_path}`}
              className="ReviewModalPoster"
              alt={movieTitle}
            />
            <div className='movieInfoTitle'>
              <strong>{movieTitle}</strong>
            </div>
          </div>

          <div className='movieReviewContent'>
            <div className="ReviewModalStar">
              <div className='ReviewModalUserInfo'>
                <FaUserCircle style={{ fontSize: "25px", marginRight: "5px" }} />
                <strong>{nickname}</strong>
              </div>
              
              <StarRating rating={review_rating} />
              <TimeAgo updateDate={update_date} />
            </div>
            
            <textarea
              placeholder="리뷰를 작성해주세요."
              value={review_comment}
              onChange={(e) => setReviewText(e.target.value)} // 리뷰 내용 변경
               readOnly 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailReviewViewModal;
