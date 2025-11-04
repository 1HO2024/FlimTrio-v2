import axiosInstance from "../config/axiosConfig";


const fetchRecommendTop = async () => {

  try {
    const response = await axiosInstance.get("/api/v1/movies/recommend");
    console.log(response)

    return response.data.data; 
    
  } catch (error) {
    console.error(error);
    return [];
  }
  
};

export default fetchRecommendTop;
