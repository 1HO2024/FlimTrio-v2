import axiosInstance from "../config/axiosConfig";

const DeleteMovieReviews = async (reviewId) => {
  try {
    const response = await axiosInstance.delete("/api/v1/movie-detail/delete-review", {        
      params: {
        review_idx: reviewId
      }
      });
      
    console.log("리뷰 작성 API 실행 후:", response.data);

 if (response.data.message === "삭제 실패") {
      return { error: "삭제에 실패" }; 
    }

    return response.data; 
  } catch (error) {
    console.error("리뷰 삭제 실패:", error);
    return { error: "리뷰 삭제 실패" };  
  }
};

export default DeleteMovieReviews;