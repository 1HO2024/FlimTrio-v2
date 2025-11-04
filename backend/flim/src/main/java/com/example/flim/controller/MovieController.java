package com.example.flim.controller;



import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.flim.dto.Movie;
import com.example.flim.dto.MovieDetailResponse;
import com.example.flim.dto.MovieResponse;
import com.example.flim.dto.RecommendedMovieResponse;
import com.example.flim.dto.RelatedSearchResponse;
import com.example.flim.service.AuthService;
import com.example.flim.service.MovieService;
import com.example.flim.service.RecommendService;
import com.example.flim.util.JwtUtil;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;


@RestController
@RequestMapping("/api/v1")
public class MovieController {

    @Autowired
    private MovieService movieService;

    @Autowired
    private RecommendService recommendService;
    
    //4.10 일 추가
    @Autowired
	private  AuthService authService;
    
	@Autowired
	private JwtUtil jwtUtil;
	  
    
    @GetMapping("/fetch-movies")
    public String fetchMovies() {
        movieService.fetchMoviesFromApiAndSave();
        return "Movies fetched and saved!";
    }

    //모든 영화 조회
    @GetMapping("/movies")
    public ResponseEntity<MovieResponse> getAllMovies() {
        List<Movie> movies = movieService.getAllMovies();
        MovieResponse response = new MovieResponse(true,"영화 목록 조회 성공",movies);
        return ResponseEntity.ok(response);
    }

	//특정 영화 조회
	@GetMapping("/movies/{id}")
	public ResponseEntity<MovieDetailResponse> getMovieWithCastAndCrew(@PathVariable("id") int id) {
	    MovieDetailResponse response = movieService.getMovieWithCastAndCrewById(id);
	
	    if (response == null) {
	        return ResponseEntity.notFound().build();
	    }
	
	    return ResponseEntity.ok(response);
	}

// 4.10 일 토큰로직 추가 
// (8.6일 수정) 토큰 로직 변경으로 api 수정 
// 조건 : 로그인 한 email 이 있으면 검색기록 저장 , 아니면 저장안함

@GetMapping("/movies/search")
public ResponseEntity<MovieResponse> searchMovies(@AuthenticationPrincipal UserDetails user,
		                                          @RequestParam("query") String query) {
	
	// 로그인 이 안된상태 : IDX 를 0 으로 서비스를 보낸뒤 서비스 예외처리  
	int userIdx = 0;  
    if (user == null) {
    	List<Movie> movies = movieService.searchMovies(query, userIdx);
    	MovieResponse response = new MovieResponse(true, "검색 성공", movies);
    	return ResponseEntity.ok(response);
    }
    // 로그인 상태
    if (user != null) {
        userIdx = authService.getUserIdx(user.getUsername());
    }
    List<Movie> movies = movieService.searchMovies(query, userIdx);
    MovieResponse response = new MovieResponse(true, "검색 성공", movies);
    return ResponseEntity.ok(response);
}

    //장르별 인기 영화 조회
    @GetMapping("/movies/topgenre")
    public ResponseEntity<MovieResponse> getTopGenre(@RequestParam(name = "genreIds") String genreIds) {
        List<Movie> movies = movieService.getTopGenre(genreIds);
        MovieResponse response = new MovieResponse(true,"장르 top10",movies);
        return ResponseEntity.ok(response);
    }
 
    //영화 추천 (인기도 top 10)
    @GetMapping("/movies/topmovie")
    public ResponseEntity<MovieResponse> getTopMovie() {
        List<Movie> movies = movieService.getTopMovie();
        MovieResponse response = new MovieResponse(true,"인기 영화",movies);
        return ResponseEntity.ok(response);
    }


    //연관검색어
    @GetMapping("/movies/related")
    public ResponseEntity<MovieResponse> getRelatedSearches(@RequestParam ("query") String query) {
        RelatedSearchResponse response = movieService.getRelatedSearchResponse(query);
        return ResponseEntity.ok(new MovieResponse(true, "연관 검색어 및 영화 조회 성공", response));
    }

    // 사용자 기반 알고리즘 : (8.6일 수정) 토큰 로직 변경으로 수정 
    @GetMapping("/movies/recommend")
    public ResponseEntity<MovieResponse> getRecommend(@AuthenticationPrincipal UserDetails user, HttpServletRequest request) {
    	
    	 if (user == null) {
    	        String refreshToken = null;
    	        if (request.getCookies() != null) {
    	            for (Cookie cookie : request.getCookies()) {
    	                if ("refreshToken".equals(cookie.getName())) {
    	                    refreshToken = cookie.getValue();
    	                    break;
    	                }
    	            }
    	        }

    	        if (refreshToken != null && jwtUtil.validateToken(refreshToken)) {
    	            //403 
    	            return ResponseEntity.status(HttpStatus.FORBIDDEN)
    	                .body(new MovieResponse(false, "Access Token 만료, 리프레시 토큰 유효"));
    	        }else{
    	            //401 
    	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
    	                .body(new MovieResponse(false, "인증 정보 없음 또는 리프레시 토큰 만료"));
    	        }
    	    }

        String email = user.getUsername();
        int userIdx = authService.getUserIdx(email);

        List<RecommendedMovieResponse> recommendMovie = recommendService.recommendMovie(userIdx);
        
        if (recommendMovie.isEmpty()) {
            return ResponseEntity.ok(new MovieResponse(true, "추천 영화 없음", recommendMovie));
        }

        return ResponseEntity.ok(new MovieResponse(true, "알고리즘", recommendMovie));
    }

}





