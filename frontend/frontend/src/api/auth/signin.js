import axiosInstance from "../config/axiosConfig";

const signinApi = async (email, password) => {
  try {
    const response = await axiosInstance.post("/api/v1/signin", {
      email,
      password,
    });

    return response.data;

  } catch (error) {
    throw new Error("로그인 실패. 다시 시도해 주세요.");
  }
};

export default signinApi;
