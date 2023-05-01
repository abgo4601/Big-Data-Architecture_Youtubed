import React, { useState, useEffect } from "react";
import "./Scroll.css";
import Filter from "bad-words";

const CommentAnimation = ({ comments }) => {
  const [visibleComments, setVisibleComments] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const filter = new Filter();

  useEffect(() => {
    const interval = setInterval(() => {
      // Get the next two comments to display
      const nextComments = comments.slice(currentIndex, currentIndex + 2);
      setVisibleComments(nextComments);

      // Update the current index for the next iteration
      setCurrentIndex((prevIndex) => prevIndex + 2);

      // Reset to the beginning if we reach the end of the comments
      if (currentIndex + 2 >= comments.length) {
        setCurrentIndex(0);
      }
    }, 10000); // Scroll every 5 seconds

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [comments, currentIndex]);

  return (
    <div className='scroll-container'>
      {visibleComments.map((comment, index) => (
        <div key={index} className='scroll-text'>
          <p>{filter.clean(comment.comment)}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentAnimation;
