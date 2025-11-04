package com.example.flim.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.flim.dto.MovieAlgo;
import com.example.flim.dto.MovieAlgoResponse;

@Mapper
public interface MovieDetailAlgorithmMapper {

	List<MovieAlgo> getMovieforAl(int id);

	List<MovieAlgo> getUserOverview(int id);

	MovieAlgoResponse getMovieInfo(String title);

	List<MovieAlgo> getRecommendMovies(List<MovieAlgo> movieTitles);




}
