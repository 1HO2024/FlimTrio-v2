package com.example.flim.dto;

import lombok.Data;
import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import com.google.gson.reflect.TypeToken;

import javax.persistence.Column;
import java.util.*;
import java.util.stream.Collectors;

@Data
public class Movie {
    private int id;
    private String genreIds;
    private String title;
    private String tagline;
    private String overview;
    private String posterPath;
    private double popularity;
    private String releaseDate;


    private List<Cast> castList;
    private List<String> keywords;



    private static final Map<Integer, String> genreMap = new HashMap<>();

    static {
        // 장르 ID와 이름을 매핑
        genreMap.put(28, "액션");
        genreMap.put(12, "어드벤쳐");
        genreMap.put(16, "애니메이션");
        genreMap.put(35, "코미디");
        genreMap.put(80, "범죄");
        genreMap.put(99, "다큐멘터리");
        genreMap.put(18, "드라마");
        genreMap.put(10751, "가족");
        genreMap.put(14, "판타지");
        genreMap.put(36, "역사");
        genreMap.put(27, "공포");
        genreMap.put(10402, "음악");
        genreMap.put(9648, "미스테리");
        genreMap.put(10749, "로맨스");
        genreMap.put(878, "공상과학");
        genreMap.put(10770, "TV영화");
        genreMap.put(53, "스릴러");
        genreMap.put(10752, "전쟁");
        genreMap.put(37, "서부");
    }

    public void setGenreIds(String genreIds) {
        if (genreIds != null && genreIds.startsWith("[") && genreIds.endsWith("]")) {
            try {
                Gson gson = new Gson();
                List<Integer> idList = gson.fromJson(genreIds, new TypeToken<List<Integer>>() {
                }.getType());
                this.genreIds = idList.stream()
                        .map(id -> genreMap.getOrDefault(id, "알 수 없음"))
                        .collect(Collectors.joining(", "));
                return;
            } catch (JsonSyntaxException e) {
                this.genreIds = genreIds;
                return;
            }
        }

        // 숫자 ID 문자열 (예: "28,12")도 처리
        if (genreIds != null && genreIds.matches("^(\\d+,?)+$")) {
            this.genreIds = Arrays.stream(genreIds.split(","))
                    .map(String::trim)
                    .map(idStr -> {
                        try {
                            int id = Integer.parseInt(idStr);
                            return genreMap.getOrDefault(id, "알 수 없음");
                        } catch (NumberFormatException e) {
                            return "알 수 없음";
                        }
                    })
                    .collect(Collectors.joining(", "));
            return;
        }

        // 그 외는 그냥 저장
        this.genreIds = genreIds;
    }
}
