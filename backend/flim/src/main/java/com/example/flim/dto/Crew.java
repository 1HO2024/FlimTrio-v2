package com.example.flim.dto;

import lombok.Data;

@Data
public class Crew {
    private int id;
    private int movieId;  // 외래키로 사용할 영화 ID
    private String name;
    private String job;  // 역할 (예: 감독, 제작자 등)
    private int gender;  // 성별
    private String profilePath;  // 프로필 경로
}