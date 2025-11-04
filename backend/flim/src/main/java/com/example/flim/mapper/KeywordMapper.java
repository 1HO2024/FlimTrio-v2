package com.example.flim.mapper;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface KeywordMapper {
    @Insert("INSERT INTO keywords (movie_id, keyword) VALUES (#{movieId}, #{keyword})")
    void insertKeyword(@Param("movieId") int movieId, @Param("keyword") String keyword);

    @Select("SELECT keyword FROM keywords WHERE movie_id = #{movieId}")
    List<String> getKeywordsByMovieId(@Param("movieId") int movieId);
}

