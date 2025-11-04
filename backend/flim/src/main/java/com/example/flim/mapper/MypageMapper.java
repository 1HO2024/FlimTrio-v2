package com.example.flim.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.flim.dto.MypageLikeDTO;
import com.example.flim.dto.MypageReviewDTO;

@Mapper
public interface MypageMapper {

	List<MypageReviewDTO> searchReview(int user_idx);
	List<MypageLikeDTO> searchLike(int user_idx);


}
