// margin-left : 20px
import "../../style/mypage/MyPagePage.css";

import MyLikes from "../../components/mypage/MyLikes";
import MyReviews from "../../components/mypage/MyReviews";

const MyPagePage = () => {
  return (
  <div className="MyPage">
    
    <MyLikes/>
    <MyReviews/>
  </div>
  );
};


export default MyPagePage;
