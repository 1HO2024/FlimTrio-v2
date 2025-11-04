package com.example.flim.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.flim.dto.ApiResponse;
import com.example.flim.dto.MovieDetailDTO;
import com.example.flim.dto.MypageLikeResponse;
import com.example.flim.dto.MypageReviewResponse;
import com.example.flim.service.AuthService;
import com.example.flim.service.MovieDetailLikeService;
import com.example.flim.util.JwtUtil;

@Controller
@RequestMapping("/api/v1/movie-detail/")
public class MovieDetailLikeController {
    
	@Autowired
	private  AuthService authService;
	
	@Autowired
	private MovieDetailLikeService movieDetailLikeService;
	
	@Autowired
	private JwtUtil jwtUtil;
	  
	
	@GetMapping("is-like")
	 public ResponseEntity<ApiResponse> islike(@AuthenticationPrincipal UserDetails user,
                                               @RequestParam (name = "id")int id) {

	    if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ApiResponse(false, "인증 정보가 없습니다."));
        }

        String email = user.getUsername();
		int user_idx = authService.getUserIdx(email);
		
		 //좋아요 상태확인 
	    String likestatus = movieDetailLikeService.getLikeStatus(id, user_idx);
	    System.out.println(likestatus);
	    	
	    return ResponseEntity.ok(new ApiResponse(true, likestatus));
	    }
   

	  //좋아요 
	  @PostMapping("toggle-like")
	 public ResponseEntity<ApiResponse> toggleLike(@AuthenticationPrincipal UserDetails user,
                                                                @RequestBody MovieDetailDTO moviedetaildto) {
	    if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ApiResponse(false, "인증 정보가 없습니다."));
        }
		  
		String email = user.getUsername();
		int user_idx = authService.getUserIdx(email);
		
		 //좋아요 상태확인 
	    boolean isLiked = movieDetailLikeService.isLiked(moviedetaildto.getId(), user_idx);
	    if (isLiked) {
	        // 좋아요 o
	    	String likestatus = movieDetailLikeService.getLikeStatus(moviedetaildto.getId(), user_idx);
	    	System.out.println(likestatus);
	    	if(likestatus.equals("Like")) {
	    		movieDetailLikeService.deleteLike(moviedetaildto, user_idx);
	    		return ResponseEntity.ok(new ApiResponse(true, "좋아요 취소 성공"));
	    	}else{
	    		movieDetailLikeService.updateLike(moviedetaildto, user_idx);	
	    		return ResponseEntity.ok(new ApiResponse(true, "다시 좋아요 성공"));
	    	}
	    } else {
	        // 좋아요 x 
	    	movieDetailLikeService.writeLike(moviedetaildto, user_idx);
	        return ResponseEntity.ok(new ApiResponse(true, "좋아요 성공"));
	    }
    }
}
