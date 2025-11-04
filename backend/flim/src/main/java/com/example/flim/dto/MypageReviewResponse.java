package com.example.flim.dto;

import java.util.List;

public class MypageReviewResponse {
	private boolean success;
	private String message;
	private List<MypageReviewDTO> data;
	
	public MypageReviewResponse(boolean success, String message, List<MypageReviewDTO> data) {
		this.setSuccess(success);
		this.setMessage(message);
		this.setData(data);
	}

	public MypageReviewResponse(boolean success, String message) {
		this.setSuccess(success);
		this.setMessage(message);
	}



	public boolean isSuccess() {
		return success;
	}

	public void setSuccess(boolean success) {
		this.success = success;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public List<MypageReviewDTO> getData() {
		return data;
	}

	public void setData(List<MypageReviewDTO> data) {
		this.data = data;
	}



}
