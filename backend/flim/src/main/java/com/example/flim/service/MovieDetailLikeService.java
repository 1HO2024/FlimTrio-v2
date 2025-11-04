package com.example.flim.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.flim.dto.MovieDetailDTO;
import com.example.flim.mapper.MovieDetailLikeMapper;

@Service
public class MovieDetailLikeService {

	@Autowired
	private MovieDetailLikeMapper movieDetailLikeMapper;

	// 좋아요
	public boolean isLiked(int id, int user_idx) {
		  return  movieDetailLikeMapper.isLike(id, user_idx);
	}	

	public String getLikeStatus(int id, int user_idx) {
		String status = movieDetailLikeMapper.getLikeStatus(id, user_idx);
		return status;
	}
	
	public void writeLike(MovieDetailDTO moviedetaildto, int user_idx) {
		movieDetailLikeMapper.writeLike(moviedetaildto.getId(),user_idx);
	}

	public void deleteLike(MovieDetailDTO moviedetaildto, int user_idx) {
		movieDetailLikeMapper.deleteLike(moviedetaildto.getId(),user_idx);
	}

	public void updateLike(MovieDetailDTO moviedetaildto, int user_idx) {
		 movieDetailLikeMapper.updateLike(moviedetaildto.getId(),user_idx);
		
	}








}
