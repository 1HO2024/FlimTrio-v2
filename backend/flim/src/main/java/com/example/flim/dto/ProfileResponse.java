package com.example.flim.dto;

import java.util.Map;

public class ProfileResponse {
    private boolean success;
    private String message;
	private Map<String, String> Data;
	
	public ProfileResponse(boolean success, String message, Map<String, String> userData) {
		this.setSuccess(success);
        this.setMessage(message);
        this.setData(userData); 
	}

	public ProfileResponse(boolean success, String message) {
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

	public Map<String, String> getData() {
		return Data;
	}

	public void setData(Map<String, String> data) {
		Data = data;
	}
    
    
}
