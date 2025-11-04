import axiosInstance from "../config/axiosConfig";

const UpdateMovieReviews = async (movieId, review_comment, review_rating,review_idx) => {
  try {
    const response = await axiosInstance.patch("/api/v1/movie-detail/update-review", {
      id: movieId,           
      review_comment,        
      review_rating,
      review_idx      
      });
    console.log('요청 데이터:', { movieId, review_comment, review_rating,review_idx});
    console.log("리뷰 작성 API 실행 후:", response.data);

 if (response.data.message === "작성된 리뷰가 있음") {
      return { error: "이미 작성한 리뷰가 있습니다." }; 
    }

    return response.data; 
  } catch (error) {
    console.error("리뷰 작성 실패:", error);
    return { error: "리뷰 작성 실패" };  
  }
};

export default UpdateMovieReviews;