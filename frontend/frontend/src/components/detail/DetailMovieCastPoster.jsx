import React from "react";

const DetailMovieCastPoster = ({ posterUrl }) => {
  // 기본 이미지 URL을 실제 이미지 경로로 변경
  const defaultImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQICerpbU2KKZ8aElbFPQ_bafRJrKj3yvHK8Q&s";
  
  <img 
  src={defaultImage} 
  alt="defaultImage" 
  style={{ width: "10px", height: "10px", objectFit: "cover", borderRadius: "8px" }} 
/>

  // posterUrl이 있으면 해당 이미지를, 없으면 기본 이미지를 사용
  const fullUrl = posterUrl
    ? `https://image.tmdb.org/t/p/w500${posterUrl}`
    : defaultImage;

  return <img src={fullUrl} alt="Cast" />;
};





export default DetailMovieCastPoster;
