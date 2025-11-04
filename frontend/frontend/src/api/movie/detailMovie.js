import axiosInstance from "../config/axiosConfig";


const fetchMovieDetails = async (movieId) => {
  try {
    // 템플릿 리터럴 동적으로 movieId를 URL에 넣어줌
    const response = await axiosInstance.get(`/api/v1/movies/${movieId}`);
    console.log("API실행후 받아온값:", response);
    return response.data; 
  } catch (error) {
    console.error("조회실패:", error);
    return null;
  }
};

export default fetchMovieDetails;
