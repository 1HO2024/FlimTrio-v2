package com.example.flim.mapper;


import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.flim.dto.MovieDetailDTO;

@Mapper
public interface MovieDetailReviewMapper {

	List<MovieDetailDTO> getReview(int id);
	
	boolean isWrite(@Param("ID")int id, 
                    @Param("user_idx") int user_idx);
	
	int writeReview(@Param("ID")int id, 
			        @Param("review_comment")String review_comment, 
			        @Param("review_rating")float review_rating, 
			        @Param("user_idx")int user_idx);

	int updateReview(@Param("ID")int id, 
           			 @Param("review_idx")int review_idx, 
           			 @Param("review_comment")String review_comment,
           			 @Param("review_rating")float review_rating,
			         @Param("user_idx")int user_idx);

	int deleteReview(@Param("review_idx")int review_idx,
			         @Param("user_idx")int user_idx);

} 