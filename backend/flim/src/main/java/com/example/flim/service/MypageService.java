package com.example.flim.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.flim.dto.MypageLikeDTO;
import com.example.flim.dto.MypageReviewDTO;
import com.example.flim.mapper.MypageMapper;

@Service
public class MypageService {
	
	@Autowired
	private MypageMapper mypageMapper;
	
	public List<MypageReviewDTO> searchReview(int user_idx) {
		List<MypageReviewDTO> data = mypageMapper.searchReview(user_idx);
		//System.out.println(data);
		return data;
	}

	public List<MypageLikeDTO> searchLike(int user_idx) {
		List<MypageLikeDTO> data = mypageMapper.searchLike(user_idx);
		//System.out.println(data);
		return data;
	}

}
