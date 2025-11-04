package com.example.flim.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecommendedMovieResponse {
    private int movieId;
    private String title;
    private String genreIds;
    private String posterPath;
    private String keyword;
    private double popularity;
}
