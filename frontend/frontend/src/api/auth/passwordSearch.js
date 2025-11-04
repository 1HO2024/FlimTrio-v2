import axiosInstance from "../config/axiosConfig";

const passwordApi = async (email) => {
  try {
    const response = await axiosInstance.post("/api/v1/search-password/temp-pass", {
      email,
    });
    return response.data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw new Error("비밀번호 찾기 실패. 다시 시도해 주세요.");
  }
};

export default passwordApi;
