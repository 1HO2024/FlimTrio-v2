package com.example.flim.mapper;


import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.flim.dto.MovieDetailDTO;

@Mapper
public interface MovieDetailLikeMapper {

	List<MovieDetailDTO> getReview(int id);

	boolean isLike(@Param("ID")int id, 
			       @Param("user_idx")int user_idx);

	String getLikeStatus(@Param("ID")int id, 
			@Param("user_idx")int user_idx);

	int writeLike(@Param("ID")int id, 
			      @Param("user_idx")int user_idx);

	int deleteLike(@Param("ID")int id, 
			       @Param("user_idx") int user_idx);

	void updateLike(@Param("ID")int id, 
			@Param("user_idx") int user_idx);

	boolean isWrite(@Param("ID")int id, 
		            @Param("user_idx") int user_idx);



			                           
}