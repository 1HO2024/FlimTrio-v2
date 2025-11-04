package com.example.flim.dto;

import lombok.Data;

@Data
public class MypageReviewDTO {
	private int     user_idx;
	private String  nickname;
	private int     review_idx;
	private int     review_rating;
	private String  review_comment;
	private String  write_date;
	private String  update_date;
    private int     ID;
    private String  title;
    private String  poster_path;
}
