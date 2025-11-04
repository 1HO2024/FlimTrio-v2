import axiosInstance from "../config/axiosConfig";

const fetchTopMovie = async () => {
  try {
    const response = await axiosInstance.get("/api/v1/movies/topmovie");
    console.log(response)
    return response.data.data; 
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default fetchTopMovie;
