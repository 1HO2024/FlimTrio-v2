package com.example.flim.service;

import com.example.flim.dto.RecommendedMovieResponse;

import java.util.List;

public interface RecommendService {
    List<RecommendedMovieResponse> recommendMovie(int userIdx);

}
