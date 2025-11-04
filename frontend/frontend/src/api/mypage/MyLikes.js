import axiosInstance from "../config/axiosConfig";

const fetchMyLikes = async () => {
  try {
    const response = await axiosInstance.get(
      "/api/v1/mypage/search-like"
    );

    console.log(response)
    return response.data.data; 

  } catch (error) {
    console.error(error);
    return [];
  }
};

export default fetchMyLikes;
