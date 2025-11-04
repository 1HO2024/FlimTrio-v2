import axiosInstance from "../config/axiosConfig";

const signupApi = async (nickname, email, password, phoneNumber) => {
  try {
    const response = await axiosInstance.post("/api/v1/signup", {
      nickname,
      email,
      password,
      phoneNumber,
    });
    return response.data;
  } catch (error) {
    throw new Error("회원가입 실패. 다시 시도해 주세요.");
  }
};

export default signupApi;
