package com.example.flim.dto;

//  성공여부 , 메세지, 데이터를 담기위해 생성
public class MovieResponse {
    private boolean success;
    private String message;
    private Object data;

    public MovieResponse(boolean success, String message, Object data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    //4.10 일 추가 
    public MovieResponse(boolean success, String message) {
    	this.success = success;
        this.message = message;
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

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
}
