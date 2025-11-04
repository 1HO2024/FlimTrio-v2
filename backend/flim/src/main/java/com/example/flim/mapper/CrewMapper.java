package com.example.flim.mapper;

import com.example.flim.dto.Crew;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface CrewMapper {
    @Insert("INSERT INTO crew (id, movie_id, name, job, gender, profile_path) " +
            "VALUES (#{id}, #{movieId}, #{name}, #{job}, #{gender}, #{profilePath}) " +
            "ON DUPLICATE KEY UPDATE name = VALUES(name), job = VALUES(job), gender = VALUES(gender), " +
            "profile_path = VALUES(profile_path), movie_id = VALUES(movie_id)")
    void insertCrew(Crew crew);

    @Select(
            "SELECT * FROM crew"
    )
    List<Crew> getCrewByMovieId(int movieId);
}
