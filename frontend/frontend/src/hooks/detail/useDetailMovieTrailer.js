import { useEffect, useState } from "react";

const useDetailMovieTrailer = ({ movieName,releaseDate}) => {
  
  const [trailerUrl, setTrailerUrl] = useState("");  
  const youtubeApikey = import.meta.env.VITE_YOUTUBE_API_KEY;
  const year = releaseDate.slice(0, 4);



  useEffect(() => {
    
    // 유튜브 트레일러 들고오는 함수  
    const fetchTrailer = async () => {

       if (!movieName || !releaseDate) return;

      try {
        const apiKey = youtubeApikey;
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent( movieName +"("+year+")"+ "official trailer")}&type=video&key=${apiKey}`
        );
        const data = await response.json();
        const videoId = data.items[0]?.id?.videoId;

        if (videoId) {
          setTrailerUrl(
            `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`
          );
          // 자동 재생 + 음소거 (브라우저 정책 회피)
        }
      } catch (error) {
        console.error("유튜브 API 오류:", error);
      }
    };

    if (movieName) {
      fetchTrailer();
    }
  },[movieName, releaseDate]);

  // trailerUrl 상태를 반환
  return { trailerUrl };
};

export default useDetailMovieTrailer;
