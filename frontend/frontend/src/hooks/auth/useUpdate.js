import { useState } from "react";
import userUpdateApi from "../../api/auth/userUpdate";
import Swal from "sweetalert2";

const useUpdate = (closeModal) => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const openUpdateModal = () => setIsUpdateModalOpen(true);
  const closeUpdateModal = () => setIsUpdateModalOpen(false)
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    handleUpdate(nickname, password);
  };

  const handleUpdate = async () => {
    try {
      const response = await userUpdateApi({nickname, password});
           Swal.fire({
              title: "회원정보수정 성공 !",
              text: `수정이 완료되었습니다 !`,
              icon: "success",
              confirmButtonColor: "#3085d6",
              confirmButtonText: "확인",
            });
      closeModal()
    } catch (error){
      console.log(error)
    }
  }
  return {
    isUpdateModalOpen,
    nickname,
    password,
    openUpdateModal,
    closeUpdateModal,
    handleUpdate,
    setNickname,
    setPassword,
    onSubmit
  }
  
}

export default useUpdate
