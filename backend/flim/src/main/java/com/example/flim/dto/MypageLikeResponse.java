package com.example.flim.dto;

import java.util.List;

public class MypageLikeResponse {
	private boolean success;
	private String message;
	private List<MypageLikeDTO> data;
	
	public MypageLikeResponse(boolean success, String message, List<MypageLikeDTO> data) {
		this.setSuccess(success);
		this.setMessage(message);
		this.setData(data);
	}

	public MypageLikeResponse(boolean success, String message) {
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

	public List<MypageLikeDTO> getData() {
		return data;
	}

	public void setData(List<MypageLikeDTO> data) {
		this.data = data;
	}



}
