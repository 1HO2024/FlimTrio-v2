package com.example.flim.dto;

import lombok.Data;

@Data
public class Cast {
    private int id;
    private int movieId;  // 외래키로 사용할 영화 ID
    private String name;
    private String character;  // 캐릭터 이름
    private int gender;  // 성별
    private String profilePath;  // 프로필 경로
}