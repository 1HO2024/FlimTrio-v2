import axiosInstance from "../config/axiosConfig";

const fetchLikeStatus = async (movieId) => {
  try {
    const response = await axiosInstance.get(`/api/v1/movie-detail/is-like`, {
      params: {id: movieId,},
    });

    if (response.data.success) {
      if (response.data.message === "Like") {
        return "liked";  
      } else if (response.data.message === "UnLike") {
        return "UnLike"; 
      }
    }
    return "UnLike";  
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return "UnLike";
    }

    console.error("좋아요 조회 실패", error);
    return "UnLike";  
  }
};

export default fetchLikeStatus;
