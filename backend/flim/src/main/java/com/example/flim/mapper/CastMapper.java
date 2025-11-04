package com.example.flim.mapper;

import com.example.flim.dto.Cast;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface CastMapper {
    @Insert("INSERT INTO cast (id, movie_id, name, `character`, gender, profile_path) " +
            "VALUES (#{id}, #{movieId}, #{name}, #{character}, #{gender}, #{profilePath}) " +
            "ON DUPLICATE KEY UPDATE name = VALUES(name), `character` = VALUES(`character`), " +
            "gender = VALUES(gender), profile_path = VALUES(profile_path), movie_id = VALUES(movie_id)")
    void insertCast(Cast cast);


    @Select("SELECT * FROM cast WHERE movie_id = #{movieId}")
    List<Cast> getCastsByMovieId(int movieId);
}