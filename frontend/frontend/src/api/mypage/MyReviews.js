import axiosInstance from "../config/axiosConfig";

const fetchMyReviews = async () => {
  try {
    const response = await axiosInstance.get(
      "/api/v1/mypage/search-review"
    );

    console.log(response)
    return response.data.data; 

  } catch (error) {
    console.error(error);
    return [];
  }
};

export default fetchMyReviews;
