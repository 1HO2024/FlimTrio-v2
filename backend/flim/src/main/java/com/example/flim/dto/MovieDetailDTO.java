package com.example.flim.dto;

import lombok.Data;

@Data
public class MovieDetailDTO {
 private int id;
 private int review_idx;
 private int user_idx;
 private String nickname;
 private float review_rating;
 private String review_comment;
 private String write_date;
 private String update_date;
}
