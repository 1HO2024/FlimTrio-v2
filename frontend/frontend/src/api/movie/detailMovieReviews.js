import axiosInstance from "../config/axiosConfig";


const fetchMovieReviews = async (movieId) => {
  try {
    const response = await axiosInstance.get(
      `/api/v1/movie-detail/view-reviews`,
       {params:{ id:movieId }},
    );
    console.log("리뷰 api 실행후:", response);
    return response.data.data; 
  } catch (error) {
    console.error("리뷰 조회실패:", error);
     return {error: "리뷰 조회실패"} ;
  }
};

export default fetchMovieReviews;


