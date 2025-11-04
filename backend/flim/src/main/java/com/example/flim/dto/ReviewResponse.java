package com.example.flim.dto;

import java.util.List;

public class ReviewResponse {
    private boolean success;
    private String message;
    private List<MovieDetailDTO> data; 
    
    public ReviewResponse(boolean success, String message, List<MovieDetailDTO> data) {
        this.setSuccess(success);
        this.setMessage(message);
        this.data = data;
    }

    public List<MovieDetailDTO> getData() {
        return data;
    }

    public void setData(List<MovieDetailDTO> data) {
        this.data = data;
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
}
