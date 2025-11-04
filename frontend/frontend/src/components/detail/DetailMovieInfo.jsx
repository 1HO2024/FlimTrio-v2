import "../../style/detail/DetailMovieInfo.css";

const DetailMovieInfo = ({ description }) => {
  return (
    <div className="DetailMovieInfo">
      <p>{description}</p>
    </div>
  );
};

export default DetailMovieInfo;
