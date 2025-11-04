import axiosInstance from "../config/axiosConfig";

const fetchTopGenre = async (genreIds) => {
  try {
    const response = await axiosInstance.get(
      "/api/v1/movies/topgenre",
      {
        params: { genreIds },
      }
    );
    console.log(response)
    return response.data.data; 

  } catch (error) {
    console.error(error);
    return [];
  }
};

export default fetchTopGenre;
