package com.example.flim.service;

import com.example.flim.dto.RecommendedMovieResponse;
import com.example.flim.dto.SearchResult;
import com.example.flim.mapper.RecommendMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendServiceImpl implements RecommendService {

    @Autowired
    private RecommendMapper recommendMapper;

    @Override
    public List<RecommendedMovieResponse> recommendMovie(int userIdx) {
    	
        List<SearchResult> recentResult = recommendMapper.recentRecommend(userIdx, 2);
        List<SearchResult> pastResult = recommendMapper.pastRecommend(userIdx, 2);
        
        if (recentResult.isEmpty() && pastResult.isEmpty()) {
            return Collections.emptyList(); // 빈 리스트 반환  8.11 일 추가(로그인시 추천영화가 없을때 강제 로그아웃 막기위해서)
        }

        Map<String, Integer> genreScore = new HashMap<>();
        Map<String, Integer> keywordScore = new HashMap<>();

        applyScores(recentResult, genreScore, keywordScore, 68); // 최근 검색 가중치
        applyScores(pastResult, genreScore, keywordScore, 22);   // 과거 검색 가중치

        List<String> topGenre = getTopKeys(genreScore, 2);
        System.out.println("Top Genres: " + topGenre);
        List<String> topKeyword = getTopKeys(keywordScore,8);

        System.out.println("Top Genres: " + topGenre);
        System.out.println("Top Keywords: " + topKeyword);
        System.out.println("Recommended: " + recommendMapper.recommendMovie(topGenre, topKeyword));

        return recommendMapper.recommendMovie(topGenre, topKeyword);

    }

    private void applyScores(List<SearchResult> results, Map<String, Integer> genreScore, Map<String, Integer> keywordScore, int weight) {
        for (SearchResult result : results) {
            if (result.getGenreIds() != null) {
                for (String genre : result.getGenreIds().split(",")) {
                    genreScore.put(genre, genreScore.getOrDefault(genre, 0) + weight);
                }
            }

            if (result.getKeyword() != null) {
                for (String keyword : result.getKeyword().split(",")) {
                    keywordScore.put(keyword, keywordScore.getOrDefault(keyword, 0) + weight);
                }
            }
        }
    }

    private List<String> getTopKeys(Map<String, Integer> map, int limit) {
        return map.entrySet().stream()
                .sorted((a, b) -> b.getValue() - a.getValue())
                .limit(limit)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }
}
