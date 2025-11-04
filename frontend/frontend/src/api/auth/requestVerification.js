import axiosInstance from "../config/axiosConfig";

// 이메일 인증번호 요청
const requestVerificationCodeApi = async (email) => {
  try {
    const response = await axiosInstance.post("/api/v1/search-password/send-code", {
      email,
    });
    return response.data;
  } catch (error) {
    throw new Error("유효하지 않은 이메일 입니다.");
  }
};


export default requestVerificationCodeApi;
