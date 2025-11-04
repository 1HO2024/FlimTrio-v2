import { useState, useEffect } from 'react';

const TimeAgo = ({ updateDate }) => {
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    const calculateTimeAgo = () => {
      const reviewDate = new Date(updateDate); 
      const currentDate = new Date(); 
      const timeDifference = currentDate - reviewDate; 

      const secondsAgo = Math.floor(timeDifference / 1000); 
      const minutesAgo = Math.floor(secondsAgo / 60); 
      const hoursAgo = Math.floor(minutesAgo / 60); 
      const daysAgo = Math.floor(hoursAgo / 24); 
      const weeksAgo = Math.floor(daysAgo / 7); 
      const monthsAgo = Math.floor(daysAgo / 30); 
      const yearsAgo = Math.floor(daysAgo / 365); 

      if (yearsAgo >= 1) {
        setTimeAgo(`${yearsAgo}년 전`);
      } else if (monthsAgo >= 1) {
        setTimeAgo(`${monthsAgo}달 전`);
      } else if (weeksAgo >= 1) {
        setTimeAgo(`${weeksAgo}주 전`);
      } else if (daysAgo >= 1) {
        setTimeAgo(`${daysAgo}일 전`);
      } else if (hoursAgo >= 1) {
        setTimeAgo(`${hoursAgo}시간 전`);
      } else if (minutesAgo >= 1) {
        setTimeAgo(`${minutesAgo}분 전`);
      } else {
        setTimeAgo(`${secondsAgo}초 전`);
      }
    };

    calculateTimeAgo();
  }, [updateDate]); 

  return <a>{timeAgo}</a>;
};

export default TimeAgo;
