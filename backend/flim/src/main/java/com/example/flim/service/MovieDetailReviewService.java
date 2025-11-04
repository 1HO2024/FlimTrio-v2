package com.example.flim.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.flim.dto.MovieDetailDTO;
import com.example.flim.mapper.MovieDetailReviewMapper;

@Service
public class MovieDetailReviewService {

	@Autowired
	private MovieDetailReviewMapper movieDetailReviewMapper;


	public List<MovieDetailDTO> getReview(int ID) {
		List<MovieDetailDTO> reviewlist = movieDetailReviewMapper.getReview(ID);
		return reviewlist;
	}
	
	public boolean isWrite(MovieDetailDTO moviedetaildto, int user_idx) {
		return  movieDetailReviewMapper.isWrite(moviedetaildto.getId(),user_idx);
	}

	public boolean writeReview(MovieDetailDTO moviedetaildto, int user_idx) {
		int result = movieDetailReviewMapper.writeReview(moviedetaildto.getId(),
				                                   moviedetaildto.getReview_comment(),
				                                   moviedetaildto.getReview_rating(),
				                                   user_idx);
		return result > 0 ;
	}


	public boolean updateReview(MovieDetailDTO moviedetaildto, int user_idx) {
		int result = movieDetailReviewMapper.updateReview(moviedetaildto.getId(),
				                                    moviedetaildto.getReview_idx(),
                                                    moviedetaildto.getReview_comment(),
                                                    moviedetaildto.getReview_rating(),
                                                    user_idx);
        return result > 0 ;
	}


	public boolean deleteReview(int review_idx, int user_idx) {
		int result = movieDetailReviewMapper.deleteReview(review_idx,
									                      user_idx);
        return result > 0 ;
	}









}
