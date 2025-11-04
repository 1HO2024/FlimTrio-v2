package com.example.flim.dto;

import java.util.Map;

public class SignResponse {
    private boolean success;
    private String message;
    private Map<String, String> data;
    private String accessToken;
    private String refreshToken;

    // 생성자, getter, setter
    public SignResponse(boolean success, String message, Map<String, String> data, String accessToken, String refreshToken) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.accessToken = accessToken;
        this.refreshToken =refreshToken;
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
        return data;
    }

    public void setData(Map<String, String> data) {
        this.data = data;
    }

	public String getAccessToken() {
		return accessToken;
	}

	public void setAccessToken(String accesstoken) {
		this.accessToken = accesstoken;
	}

	public String getRefreshToken() {
		return refreshToken;
	}

	public void setRefreshToken(String refreshToken) {
		this.refreshToken = refreshToken;
	}


}
