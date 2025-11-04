import "../../style/detail/DetailMovieReviews.css";

const reviews = [
  "대단한 영화! 강력 추천합니다.",
  "이 영화는 정말 훌륭합니다. 스토리라인이 최고!",
  "볼만한 영화지만 약간 아쉬운 부분도 있었다.",
  "정말 재미있었어요! 배우들의 연기도 훌륭했습니다.",
  "눈물 나게 감동적인 영화, 다시 보고 싶어요.",
  "액션 씬이 너무 멋지네요! 추천합니다.",
  "영화의 전개가 정말 긴장감을 유지하면서 끝까지 흥미로웠어요.",
  "예상보다 훨씬 더 재미있고 감동적인 영화였습니다. 추천합니다!",
];

const DetailMovieReviews = () => {
  return (
    <div
      style={{
        color: "white",
        marginTop: "60px",
      }}
    >
      이 영화에 대한 리뷰는 어떤 것이 있을까요 ?
      <div className="DetailMovieReviews">
        <ul>
          {reviews.map((review, index) => (
            <li key={index}>{review}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DetailMovieReviews;
