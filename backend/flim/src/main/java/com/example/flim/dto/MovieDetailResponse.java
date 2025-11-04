package com.example.flim.dto;


import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class MovieDetailResponse {

    private boolean success;
    private String message;
    private Movie movie;
    private List<Cast> cast;
    private List<Crew> crew;
    private List<MovieAlgoResponse> recommendedMovies;         //추천 영화 목록들
}
