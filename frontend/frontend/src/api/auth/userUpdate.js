import axiosInstance from "../config/axiosConfig";
import useAuthStore from "../../store/authStore";


const userUpdateApi = async ({ nickname, password }) => {
  const updateUser = useAuthStore.getState().updateUser; 

  try {
    const response = await axiosInstance.patch(
      "/api/v1/update-profile",
      { nickname, password }
    );

    updateUser(response.data.data);
    return response.data;

  } catch (error) {
    console.error("회원정보 수정 실패:", error);
    throw error;
  }
};

export default userUpdateApi;
