package com.example.flim.mapper;

import com.example.flim.dto.RecommendedMovieResponse;
import com.example.flim.dto.SearchResult;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface RecommendMapper {

    @Select("""
        SELECT sr.* FROM search_result sr
        JOIN search_history sh ON sr.search_history_id = sh.search_id
        WHERE sh.user_idx = #{userIdx}
        ORDER BY sh.created_at DESC
        LIMIT #{limit}
    """)
    List<SearchResult> recentRecommend(@Param("userIdx") int userIdx, @Param("limit") int limit);

    @Select("""
        SELECT sr.* FROM search_result sr
        JOIN search_history sh ON sr.search_history_id = sh.search_id
        WHERE sh.user_idx = #{userIdx}
        ORDER BY sh.created_at DESC
        LIMIT 100 OFFSET #{offset}
    """)
    List<SearchResult> pastRecommend(@Param("userIdx") int userIdx, @Param("offset") int offset);

    @Select("""
    <script>
    SELECT 
        m.id AS movieId,
        m.title,
        m.genre_ids,
        m.poster_path,
        m.popularity,
        GROUP_CONCAT(k.keyword) AS keyword
    FROM movie m
    LEFT JOIN keywords k ON m.id = k.movie_id
    WHERE (
        <foreach item="genre" collection="genres" open="(" separator="AND" close=")">
            m.genre_ids LIKE CONCAT('%', #{genre}, '%')
        </foreach>
    )
    <if test="keywords != null and keywords.size() > 0">
        AND (
            <foreach item="keyword" collection="keywords" open="(" separator="or" close=")">
                k.keyword LIKE CONCAT('%', #{keyword}, '%')
            </foreach>
        )
    </if>
    GROUP BY m.id, m.title, m.genre_ids, m.poster_path, m.popularity
    ORDER BY m.popularity DESC
    LIMIT 20
    </script>
""")
    List<RecommendedMovieResponse> recommendMovie(
            @Param("genres") List<String> genres,
            @Param("keywords") List<String> keywords
    );
}

