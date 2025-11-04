import axiosInstance from "../config/axiosConfig";

const fetchSearchMoviesResults = async (query) => {
  const token = localStorage.getItem("token");  
  try {
    const response = await axiosInstance.get(
      "/api/v1/movies/search",{
        params: { query }
      }
      
    );
    console.log(response)
    if (response.data.success) {
      
      return response.data.data; 
    }
    return [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default fetchSearchMoviesResults;
