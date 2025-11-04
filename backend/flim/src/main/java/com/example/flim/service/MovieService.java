package com.example.flim.service;


import com.example.flim.dto.Movie;
import com.example.flim.dto.MovieAlgoResponse;
import com.example.flim.dto.MovieDetailResponse;
import com.example.flim.dto.RelatedSearchResponse;

import java.util.List;

public interface MovieService {

    void fetchMoviesFromApiAndSave();


    List<Movie> getAllMovies();


    MovieDetailResponse getMovieWithCastAndCrewById(int id);

    List<Movie> searchMovies(String query,int userIdx);

    List<Movie> getTopGenre(String genreIds);

    List<Movie> getTopMovie();


    RelatedSearchResponse getRelatedSearchResponse(String query);
}
