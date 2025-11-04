package com.example.flim.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.flim.dto.MypageLikeDTO;
import com.example.flim.dto.MypageLikeResponse;
import com.example.flim.dto.MypageReviewDTO;
import com.example.flim.dto.MypageReviewResponse;
import com.example.flim.service.AuthService;
import com.example.flim.service.MypageService;


@RestController  // JSON 리턴하려면 Controller 대신 RestController 권장
@RequestMapping("/api/v1/mypage")
public class MypageController {

    private final AuthService authService;
    private final MypageService mypageService;

    public MypageController(AuthService authService, MypageService mypageService) {
        this.authService = authService;
        this.mypageService = mypageService;
    }
    
    // 마이페이지 - 작성리뷰 가져오기
    @GetMapping("/search-review")
    public ResponseEntity<MypageReviewResponse> searchReview(@AuthenticationPrincipal UserDetails user) {
    	
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new MypageReviewResponse(false, "인증 정보가 없습니다."));
        }

        String email = user.getUsername();
        int userIdx = authService.getUserIdx(email);
        List<MypageReviewDTO> data = mypageService.searchReview(userIdx);

        if (data != null && !data.isEmpty()) {
            return ResponseEntity.ok(new MypageReviewResponse(true, "조회 성공", data));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new MypageReviewResponse(false, "리뷰 내역 없음"));
        }
    }
    
    // 마이페이지 - 좋아요 목록 가져오기 
    @GetMapping("/search-like")
    public ResponseEntity<MypageLikeResponse> searchLike(@AuthenticationPrincipal UserDetails user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new MypageLikeResponse(false, "인증 정보가 없습니다."));
        }

        String email = user.getUsername();
        int userIdx = authService.getUserIdx(email);
        List<MypageLikeDTO> data = mypageService.searchLike(userIdx);

        if (data != null && !data.isEmpty()) {
            return ResponseEntity.ok(new MypageLikeResponse(true, "좋아요 조회 성공", data));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new MypageLikeResponse(false, "좋아요 내역이 없음"));
        }
    }
}
