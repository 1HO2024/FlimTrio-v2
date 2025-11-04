package com.example.flim.service;


import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileOutputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.flim.dto.Cast;
import com.example.flim.dto.Crew;
import com.example.flim.dto.Movie;
import com.example.flim.dto.MovieAlgo;
import com.example.flim.dto.MovieAlgoResponse;
import com.example.flim.dto.MovieDetailDTO;
import com.example.flim.dto.MovieDetailResponse;
import com.example.flim.mapper.CastMapper;
import com.example.flim.mapper.CrewMapper;
import com.example.flim.mapper.MovieDetailAlgorithmMapper;
import com.example.flim.mapper.MovieMapper;

import com.example.flim.dto.*;
import com.example.flim.mapper.*;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

@Service
public class MovieServiceImpl implements MovieService {
    @Autowired
    private MovieMapper movieMapper;

    @Autowired
    private SearchMapper searchMapper;

    @Autowired
    private CastMapper castMapper; // 추가된 부분: CastMapper
    
    @Autowired
    private CrewMapper crewMapper; // 추가된 부분: CrewMapper

    
    @Autowired
    private MovieDetailAlgorithmService MovieDetailAlgorithmService;

    @Autowired
    private KeywordMapper keywordMapper;



    @Autowired
    private RestTemplate restTemplate;

    private final String apiKey = "8cddecbeaaf1e1f845bf146c6f747ee1"; // API Key 입력
    private final String URL = "https://api.themoviedb.org/3/discover/movie?api_key=" + apiKey + "&language=ko-KR&page=";


    @Override
    public void fetchMoviesFromApiAndSave() {
        Gson gson = new Gson();


        for (int page = 1; page <= 5000; page++) {
            String requestUrl = URL + page;

            try {
                String response = restTemplate.getForObject(requestUrl, String.class);

                JsonObject jsonObject = gson.fromJson(response, JsonObject.class);
                JsonArray results = jsonObject.getAsJsonArray("results");

                for (JsonElement element : results) {
                    JsonObject movieData = element.getAsJsonObject();

                    int movieId = movieData.get("id").getAsInt();

                    // 중복 확인
                    if (movieMapper.checkMovieExists(movieId) == 0) { // 0이면 중복 없음
                        Movie movie = new Movie();
                        movie.setId(movieId);
                        movie.setTitle(movieData.has("title") && !movieData.get("title").isJsonNull()
                                ? movieData.get("title").getAsString()
                                : "No title available");

                        // overview 값 null 체크
                        movie.setOverview(movieData.has("overview") && !movieData.get("overview").isJsonNull()
                                ? movieData.get("overview").getAsString()
                                : "No description available");

                        // popularity 값 null 체크
                        movie.setPopularity(movieData.has("popularity") && !movieData.get("popularity").isJsonNull()
                                ? movieData.get("popularity").getAsDouble()
                                : 0.0);

                        // poster_path 값 null 체크
                        movie.setPosterPath(movieData.has("poster_path") && !movieData.get("poster_path").isJsonNull()
                                ? movieData.get("poster_path").getAsString()
                                : null);

                        // release_date 값 null 체크
                        String releaseDate = movieData.has("release_date") && !movieData.get("release_date").isJsonNull()
                                ? movieData.get("release_date").getAsString()
                                : null;
                        if (releaseDate != null && releaseDate.trim().isEmpty()) {
                            releaseDate = null;
                        }
                        movie.setReleaseDate(releaseDate);

                        // 장르 리스트 JSON 변환 후 저장
                        JsonArray genreArray = movieData.getAsJsonArray("genre_ids");
                        List<Integer> genreIds = new ArrayList<>();
                        for (JsonElement genreId : genreArray) {
                            genreIds.add(genreId.getAsInt());
                        }

                        Gson genreGson = new Gson();
                        String genreIdsJson = genreGson.toJson(genreIds);
                        movie.setGenreIds(genreIdsJson);

                        // ✅ 중복되지 않은 경우에만 INSERT 실행
                        movieMapper.insertMovie(movie);

//                        ================= 영화 cast, crew 정보 저장하기 =========================================
                        // Cast와 Crew 정보를 추가로 가져와서 저장
                        String movieCreditsUrl = "https://api.themoviedb.org/3/movie/" + movieId + "/credits?api_key=" + apiKey;
                        String creditsResponse = restTemplate.getForObject(movieCreditsUrl, String.class);

                        JsonObject creditsData = gson.fromJson(creditsResponse, JsonObject.class);

                        // Cast 정보
                        JsonArray castArray = creditsData.getAsJsonArray("cast");
                        List<Cast> castList = new ArrayList<>();
                        for (JsonElement castElement : castArray) {
                            JsonObject castData = castElement.getAsJsonObject();
                            Cast cast = new Cast();
                            cast.setId(castData.has("id") && !castData.get("id").isJsonNull() ? castData.get("id").getAsInt() : 0);
                            cast.setName(castData.has("name") && !castData.get("name").isJsonNull() ? castData.get("name").getAsString() : "Unknown");
                            cast.setCharacter(castData.has("character") && !castData.get("character").isJsonNull() ? castData.get("character").getAsString() : "No character");
                            cast.setGender(castData.has("gender") && !castData.get("gender").isJsonNull() ? castData.get("gender").getAsInt() : 0);
                            cast.setProfilePath(castData.has("profile_path") && !castData.get("profile_path").isJsonNull() ? castData.get("profile_path").getAsString() : null);
                            cast.setMovieId(movieId);  // 외래키 설정
                            castList.add(cast);
                        }

                        // Crew 정보
                        JsonArray crewArray = creditsData.getAsJsonArray("crew");
                        List<Crew> crewList = new ArrayList<>();
                        for (JsonElement crewElement : crewArray) {
                            JsonObject crewData = crewElement.getAsJsonObject();
                            Crew crew = new Crew();
                            crew.setId(crewData.has("id") && !crewData.get("id").isJsonNull() ? crewData.get("id").getAsInt() : 0);
                            crew.setName(crewData.has("name") && !crewData.get("name").isJsonNull() ? crewData.get("name").getAsString() : "Unknown");
                            crew.setJob(crewData.has("job") && !crewData.get("job").isJsonNull() ? crewData.get("job").getAsString() : "No job");
                            crew.setGender(crewData.has("gender") && !crewData.get("gender").isJsonNull() ? crewData.get("gender").getAsInt() : 0);
                            crew.setProfilePath(crewData.has("profile_path") && !crewData.get("profile_path").isJsonNull() ? crewData.get("profile_path").getAsString() : null);
                            crew.setMovieId(movieId);  // 외래키 설정
                            crewList.add(crew);
                        }

//                        키워드 저장하기
                        String keywordUrl = "https://api.themoviedb.org/3/movie/" + movieId + "/keywords?api_key=" + apiKey;
                        String keywordResponse = restTemplate.getForObject(keywordUrl, String.class);

                        JsonObject keywordData = gson.fromJson(keywordResponse, JsonObject.class);
                        JsonArray keywordArray = keywordData.getAsJsonArray("keywords");

                        List<String> keywordList = new ArrayList<>();
                        for (JsonElement keywordElement : keywordArray) {
                            JsonObject keywordObj = keywordElement.getAsJsonObject();
                            String keyword = keywordObj.get("name").getAsString();
                            keywordList.add(keyword);
                        }

// 🔹 쉼표로 이어붙인 문자열로 변환
                        String keywordString = String.join(",", keywordList);

// 🔹 저장
                        keywordMapper.insertKeyword(movieId, keywordString);

                        // Cast와 Crew 저장
                        for (Cast cast : castList) {
                            castMapper.insertCast(cast);
                        }

                        for (Crew crew : crewList) {
                            crewMapper.insertCrew(crew);
                        }

                    } else {
                        System.out.println("⚠️ 중복된 영화 ID " + movieId + " - 삽입하지 않음");
                    }
                }
            } catch (Exception e) {
                throw new RuntimeException(e);
            }

        }
    }


    @Override
    public List<Movie> getAllMovies() {
        List<Movie> movies = movieMapper.getAllMovies();
        attachKeywordsToMovies(movies);
        return movies;
    }


    @Override
    public MovieDetailResponse getMovieWithCastAndCrewById(int movieId) {
        // 영화 조회
        Movie movie = movieMapper.getMovieById(movieId);

        // 영화가 없다면 null 반환
        if (movie == null) {
            return null;
        }
        // Cast 조회
        List<Cast> castList = castMapper.getCastsByMovieId(movieId);
        // Crew 조회
        List<Crew> crewList = crewMapper.getCrewByMovieId(movieId);

        
       //여기서 부터 추가 4.10 (비슷한 영화 알고리즘 작동)
        MovieDetailDTO dto = new MovieDetailDTO();
        dto.setId(movieId); 

        List<MovieAlgoResponse> recommendedMovies = MovieDetailAlgorithmService.algorithmshoot(dto);
        MovieDetailResponse response = new MovieDetailResponse(true, "영화 조회 성공", movie, castList, crewList, recommendedMovies);
        response.setRecommendedMovies(recommendedMovies); 
        
        return new MovieDetailResponse(true, "영화 조회 성공", movie, castList, crewList,recommendedMovies);

    }
    //6.16 수정 -> 정확하게 검색한것만
    @Override
    public List<Movie> searchMovies(String query, int userIdx) {
        
        String searchQuery = "%"+query+"%";
        
        Integer searchHistoryId = null;
        boolean checkquery = searchMapper.checkIfMovieExists(query);
        
        if (userIdx > 0 && query != null && !query.trim().isEmpty()) {
        	
            searchMapper.insertSearchHistory(userIdx, query);
            searchHistoryId = searchMapper.getSearchHistory(userIdx); 
        	
        }
        
        List<Movie> movies = movieMapper.searchMovies(searchQuery);

        for (Movie movie : movies) {
            
        	
            List<String> keywords = keywordMapper.getKeywordsByMovieId(movie.getId());
            movie.setKeywords(keywords);

           
            if (searchHistoryId != null && checkquery) {
                if (isTitleMatched(query, movie.getTitle())) {
                    int count = searchMapper.countSearchResult(searchHistoryId, movie.getId());
                    
                    if (count == 0) {
                        String keywordString = String.join(",", keywords);
                        
                        String SaveBeforeCheckQuery = query;
                        if (movie.getTitle().equals(SaveBeforeCheckQuery)) {
                        searchMapper.insertSearchResult(
                                searchHistoryId,
                                movie.getId(),
                                movie.getTitle(),
                                movie.getGenreIds(),
                                movie.getPosterPath(),
                                keywordString
                        ); 
                       }
                    }
                }
            }
        }
            return movies;
        }


    @Override
    public List<Movie> getTopGenre(String genreIds) {
        if (genreIds == null || genreIds.isEmpty()) {
            return new ArrayList<>(); // 빈 리스트 반환
        }

        // 장르 리스트로 변환
        List<String> searchGenres = Arrays.asList(genreIds.split(","));

        // DB에서 장르별 인기 영화 가져오기
        List<Movie> movies = movieMapper.topgenre(genreIds);

        // 장르 필터링 후 인기순 정렬 (내림차순)
        List<Movie> filtered = movies.stream()
                .filter(movie -> {
                    String[] genres = Optional.ofNullable(movie.getGenreIds())
                            .map(g -> g.split(","))
                            .orElse(new String[0]);
                    // 이부분 수정함 (5/5일) 장르중 검색한 장르가 하나라도 포함된다면 으로 바꿈 
                    return Arrays.stream(genres).anyMatch(genre -> searchGenres.contains(genre.trim()));
               
                })
                .sorted(Comparator.comparing(Movie::getPopularity).reversed())
                .limit(10)
                .collect(Collectors.toList());

        attachKeywordsToMovies(filtered); // 🔥 키워드 붙이기
        return filtered;
    }

    @Override
    public List<Movie> getTopMovie() {
        List<Movie> movies = movieMapper.getTopMovie();
        attachKeywordsToMovies(movies);
        return movies;
    }


    @Override
    public RelatedSearchResponse getRelatedSearchResponse(String query) {
        List<Movie> movies = movieMapper.findRelatedMoviesByTitle(query);
        List<String> relatedQueries = movieMapper.findRelatedQueriesFromTitle(query);
        return new RelatedSearchResponse(query, movies, relatedQueries);
    }

    private void attachKeywordsToMovies(List<Movie> movies) {
        for (Movie movie : movies) {
            List<String> keywords = keywordMapper.getKeywordsByMovieId(movie.getId());
            movie.setKeywords(keywords);
        }
    }
    private boolean isTitleMatched(String query, String title) {
        if (query == null || title == null) return false;

        // 2글자 이상 겹치는 부분이 있는지 확인
        for (int i = 0; i <= query.length() - 2; i++) {
            String sub = query.substring(i, i + 2);
            if (title.contains(sub)) {
                return true;
            }
        }
        return false;
    }
}





