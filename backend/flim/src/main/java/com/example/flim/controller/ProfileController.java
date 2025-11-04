package com.example.flim.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.flim.dto.MypageReviewResponse;
import com.example.flim.dto.ProfileResponse;
import com.example.flim.dto.UserDTO;
import com.example.flim.service.AuthService;
import com.example.flim.util.JwtUtil;

@Controller
@RequestMapping("/api/v1")

public class ProfileController {
	
	@Autowired
	private  AuthService authService;
	@Autowired
	private JwtUtil jwtUtil;
	

	   //회원정보 조회
	   @GetMapping("/search-profile")
	   public ResponseEntity<ProfileResponse> searchProfile(@AuthenticationPrincipal UserDetails user) {

		   if (user == null) {
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
	                .body(new ProfileResponse(false, "인증 정보가 없습니다."));
	        }

	        String email = user.getUsername();
		    UserDTO searchUser = authService.searchProfile(email);
		   
		    Map<String, String> userData = new HashMap<>();
		     userData.put("nickname", searchUser.getNickname()); 
		     userData.put("email",searchUser.getEmail()); 
		     userData.put("phoneNumber",searchUser.getPhoneNumber()); 
		    return ResponseEntity.ok(new ProfileResponse(true, "회원 정보 조회 성공", userData));
		}
	   
	   //회원정보 수정
	   @PatchMapping("/update-profile")
	   public ResponseEntity<ProfileResponse> updateProfile(@AuthenticationPrincipal UserDetails user, @RequestBody UserDTO userDTO) {

		   if (user == null) {
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
	                .body(new ProfileResponse(false, "인증 정보가 없습니다."));
	        }

	        String email = user.getUsername();
		    
		    //회원정보 DB 수정(수정 정보 예외처리)
		    if(userDTO.getNickname()== null) {
		    	UserDTO getinfo = authService.searchProfile(email);
		    	userDTO.setNickname(getinfo.getNickname());
		    }
		    
		    if(userDTO.getPassword()== null) {
		    	UserDTO updatedUser = authService.updateProfileNopass(email,userDTO.getNickname());
		    	Map<String, String> userData = new HashMap<>();
			    userData.put("nickname",   updatedUser.getNickname()); 
			    userData.put("email"   ,   updatedUser.getEmail()); 
			    userData.put("phoneNumber",updatedUser.getPhoneNumber()); 
		    	return ResponseEntity.ok(new ProfileResponse(true, "회원 정보 수정 성공(비번변경 x)", userData));
		    }
		    
		    UserDTO updatedUser = authService.updateProfile(email,userDTO.getNickname(),userDTO.getPassword());
		     Map<String, String> userData = new HashMap<>();
		     userData.put("nickname", updatedUser.getNickname()); 
		     userData.put("email",updatedUser.getEmail()); 
		     userData.put("phoneNumber",updatedUser.getPhoneNumber()); 
		     System.out.println("닉네임:"+ userDTO.getNickname() +
		                        "비번:"+ userDTO.getPassword());
		    
		    return ResponseEntity.ok(new ProfileResponse(true, "회원 정보 수정 성공", userData));
		}
}
