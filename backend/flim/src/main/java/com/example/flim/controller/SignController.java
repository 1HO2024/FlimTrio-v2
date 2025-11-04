package com.example.flim.controller;


import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.flim.dto.ApiResponse;
import com.example.flim.dto.SearchPassResponse;
import com.example.flim.dto.SignResponse;
import com.example.flim.dto.UserDTO;
import com.example.flim.dto.VerificationRequestDTO;
import com.example.flim.entity.RefreshTokenEntity;
import com.example.flim.service.AuthService;
import com.example.flim.service.EmailService;
import com.example.flim.service.EmailVerificationService;
import com.example.flim.service.RefreshTokenService;
import com.example.flim.util.JwtUtil;

import jakarta.servlet.http.HttpServletResponse;

@Controller
@RequestMapping("/api/v1")
public class SignController {
	
	@Autowired
	private  AuthService authService;
	
	@Autowired
	private EmailService emailService;
	
	@Autowired
	private EmailVerificationService emailVerificationService;
	
	@Autowired
	private RefreshTokenService refreshTokenService;
	
	@Autowired
	private JwtUtil jwtUtil;
	

	  //비밀번호 찾기	    
	@PostMapping("/signup/send-code")
	public ResponseEntity<SearchPassResponse> signupSendVerificationCode(@RequestBody UserDTO userDTO) {
	    
		boolean isSignup = authService.isSignup(userDTO.getEmail());
		
		if(isSignup) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
		            .body(new SearchPassResponse(false, "이미 가입된 이메일입니다."));
		}
		
	    // 2.인증번호 발급
	    String verificationCode = String.format("%06d", (int) (Math.random() * 1000000));

	    // 3.인증번호 저장
	     boolean saved  = emailVerificationService.SignupSaveVerificationCode(userDTO.getEmail(),
	    		                                       verificationCode , "회원가입");
	     
	    if (!saved) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	            .body(new SearchPassResponse(false, "인증코드 저장 실패"));
	    }
	    
	    // 4.이메일 발송
	    try {
	        String html = "<div style='font-family: Arial, sans-serif; padding: 20px;'>"
	            + "<h2>\r\n"
	            + "<span style=\"color: #1E90FF;  font-size: 32px; \">FLIM</span><span style=\"color: black;  font-size: 32px;\">TRIO</span>\r\n"
	            + "</h2>"
	            + "<h2>필름트리오 회원가입 을 위한 인증번호입니다.</h2>"
	            + "<p>인증번호: <strong style='font-size: 24px; color: #1E90FF;'>" + verificationCode + "</strong></p>"
	            + "<p>인증번호를 확인하여 이메일 주소 인증을 완료해 주세요.</p>"
	            + "</div>";
	        emailService.sendHtmlEmail(userDTO.getEmail(), "[FLIMTRIO] 회원가입 인증번호 ", html);
	        
	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body(new SearchPassResponse(false, "이메일 발송에 실패했습니다."));
	    }

	    return ResponseEntity.ok(new SearchPassResponse(true, "인증코드가 이메일로 발송되었습니다."));
	}
	   
	   
	   @PostMapping("/signup/verify-code")
	   public ResponseEntity<SearchPassResponse> signupVerifyCodeAndResetPassword(@RequestBody VerificationRequestDTO request) {
	       
		   //검증
	       boolean isValid = emailVerificationService.singupVerifyCode(request.getEmail(), request.getCode(),"회원가입");
	      
	       if (!isValid) {
	           return ResponseEntity.status(HttpStatus.BAD_REQUEST)
	                   .body(new SearchPassResponse(false, "인증코드가 유효하지 않거나 만료되었습니다."));
	       }
	       return ResponseEntity.ok(new SearchPassResponse(true, 
	           "인증완료"));
	   }
    
	//회원가입
	@PostMapping("/signup")
    public ResponseEntity<ApiResponse> registerUser(@RequestBody UserDTO userDTO) {
		authService.registerUser(userDTO);
		//true 랑 메세지 담을려고 객체만듬 
		ApiResponse  response = new ApiResponse(true, "회원 가입 성공");
	    return ResponseEntity.ok(response); 
    }
	

	// jwt필터 관련 깃 작성
	//로그인 
	@PostMapping("/signin")
	public ResponseEntity<SignResponse> signin(@RequestBody UserDTO userDTO, HttpServletResponse response) {		
		 String email = userDTO.getEmail();
		 
		 // 이메일과 비밀번호 검증
	     boolean isValidUser = authService.authenticateUser(userDTO.getEmail(), userDTO.getPassword());
	        
	     if (!isValidUser) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
	                 .body(new SignResponse(false, "로그인 실패: 이메일 또는 비밀번호가 올바르지 않습니다.", null, null, null));
	   }
	     
	     //토큰 생성
		 String accessToken  = jwtUtil.generateToken(email); 
		 String refreshToken = jwtUtil.generateRefreshToken(email);
		 LocalDateTime refreshExpireAt = LocalDateTime.now().plusDays(7);
		 
				 
		 // DB에 리프레시 토큰 저장
		 refreshTokenService.saveRefreshToken(email, refreshToken, refreshExpireAt);
		    
		 
		 // 쿠키에 access token 저장 (15분)
		 ResponseCookie accessCookie = ResponseCookie.from("accessToken", accessToken)
		            .httpOnly(true)
		            .secure(true) // HTTPS 환경일 때만 전송
		            .path("/")
		            .sameSite("Strict") // 또는 "Lax"
		            .maxAge(15 * 60)
		            .build();
		
		 // 쿠키에 refresh token 저장 (7일)
		 ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshToken)
		            .httpOnly(true)
		            .secure(true)
		            .path("/")
		            .sameSite("Strict")
		            .maxAge(7 * 24 * 60 * 60)
		            .build();
		 
		// 쿠키를 응답에 추가
		 response.addHeader("Set-Cookie", accessCookie.toString());
		 response.addHeader("Set-Cookie", refreshCookie.toString());
		 
		 
		 //정보 가져오기(닉네임,전번)
	     String nickname     = authService.getNickname(userDTO.getEmail());
	     String phoneNumber  = authService.getPhonenumber(userDTO.getEmail());	     
	     
	     Map<String, String> userData = new HashMap<>();
	     userData.put("nickname", nickname); 
	     userData.put("email", userDTO.getEmail());
	     userData.put("phoneNumber", phoneNumber); 

	     
	     
	     
	     return ResponseEntity.ok(new SignResponse(true, "로그인 성공", userData, null, null));
	   }
	
		 // 리프레시 토큰을 사용하여 액세스 토큰 재발급
	@PostMapping("/refresh")
	public ResponseEntity<SignResponse> refreshAccessToken(@CookieValue(value = "refreshToken", required = false) String refreshToken,
	                                                       HttpServletResponse response) {
	    if (refreshToken == null) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
	                .body(new SignResponse(false, "리프레시 토큰이 없습니다.", null, null, null));
	    }

	    try {
	        String email = jwtUtil.extractUsername(refreshToken);
	        if (!jwtUtil.validateToken(refreshToken)) {
	            throw new Exception("유효하지 않은 토큰");
	        }

	        RefreshTokenEntity storedToken = refreshTokenService.findByRefreshToken(refreshToken)
	                                         .orElseThrow(() -> new Exception("DB에 리프레시 토큰이 없습니다"));

	        if (!storedToken.getEmail().equals(email)) {
	            throw new Exception("사용자와 토큰 불일치");
	        }

	        String newAccessToken = jwtUtil.generateToken(email);
	        String newRefreshToken = jwtUtil.generateRefreshToken(email);
	        LocalDateTime refreshExpireAt = LocalDateTime.now().plusDays(7);

	        refreshTokenService.saveRefreshToken(email, newRefreshToken, refreshExpireAt);

	        ResponseCookie newAccessCookie = ResponseCookie.from("accessToken", newAccessToken)
	            .httpOnly(true)
	            .secure(true)
	            .path("/")
	            .sameSite("Strict")
	            .maxAge(15 * 60)
	            .build();

	        ResponseCookie newRefreshCookie = ResponseCookie.from("refreshToken", newRefreshToken)
	            .httpOnly(true)
	            .secure(true)
	            .path("/")
	            .sameSite("Strict")
	            .maxAge(7 * 24 * 60 * 60)
	            .build();

	        response.addHeader("Set-Cookie", newAccessCookie.toString());
	        response.addHeader("Set-Cookie", newRefreshCookie.toString());

	        return ResponseEntity.ok(new SignResponse(true, "액세스 토큰 재발급 성공", null, null, null));

	    } catch (Exception e) {
	        // 강제 로그아웃 쿠키 삭제
	        ResponseCookie deleteAccess = ResponseCookie.from("accessToken", "")
	            .httpOnly(true)
	            .secure(true)
	            .path("/")
	            .sameSite("Strict")
	            .maxAge(0)
	            .build();

	        ResponseCookie deleteRefresh = ResponseCookie.from("refreshToken", "")
	            .httpOnly(true)
	            .secure(true)
	            .path("/")
	            .sameSite("Strict")
	            .maxAge(0)
	            .build();

	        response.addHeader("Set-Cookie", deleteAccess.toString());
	        response.addHeader("Set-Cookie", deleteRefresh.toString());

	        // 로그아웃 메시지 직접 반환(498코드 = 강제 로그아웃 코드로 지정함)
	        return ResponseEntity.status(498)
	        	    .body(new SignResponse(false, "리프레시 토큰이 유효하지 않습니다. 로그아웃 처리되었습니다.", null, null, null));
	    }
	}

	
	@PostMapping("/signout")
	public ResponseEntity<ApiResponse> logout(@AuthenticationPrincipal UserDetails userDetails,
			                                   HttpServletResponse response) {
		
		  if (userDetails == null) {
		        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
		                .body(new ApiResponse(false, "로그인 상태가 아닙니다."));
		    }

		    String email = userDetails.getUsername(); 	    
		    refreshTokenService.deleteByEmail(email); 
		    
	    // accessToken & refreshToken 쿠키 제거 (만료 처리)
	    ResponseCookie deleteAccess = ResponseCookie.from("accessToken", "")
	        .httpOnly(true)
	        .secure(true)
	        .path("/")
	        .sameSite("Strict")
	        .maxAge(0)  
	        .build();

	    ResponseCookie deleteRefresh = ResponseCookie.from("refreshToken", "")
	        .httpOnly(true)
	        .secure(true)
	        .path("/")
	        .sameSite("Strict")
	        .maxAge(0)
	        .build();

	    response.addHeader("Set-Cookie", deleteAccess.toString());
	    response.addHeader("Set-Cookie", deleteRefresh.toString());

	    return ResponseEntity.ok().body(new ApiResponse(true, "로그아웃 성공"));
	}
	

	  //비밀번호 찾기	    
	@PostMapping("/search-password/send-code")
	public ResponseEntity<SearchPassResponse> sendVerificationCode(@RequestBody UserDTO userDTO) {
	    
		// 1.유저 확인 
	    boolean userExists = emailVerificationService.checkUserByPhoneNumberAndEmail(userDTO.getEmail());
	    if (!userExists) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND)
	                .body(new SearchPassResponse(false, "사용자를 찾을 수 없습니다."));
	    }

	    // 2.인증번호 발급
	    String verificationCode = String.format("%06d", (int) (Math.random() * 1000000));

	    // 3.인증번호 저장
	     boolean saved  = emailVerificationService.saveVerificationCode(userDTO.getEmail(),
	    		                                       verificationCode , "비밀번호 찾기");
	     
	    if (!saved) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	            .body(new SearchPassResponse(false, "인증코드 저장 실패"));
	    }
	    
	    // 4.이메일 발송
	    try {
	        String html = "<div style='font-family: Arial, sans-serif; padding: 20px;'>"
	            + "<h2>\r\n"
	            + "<span style=\"color: #1E90FF;  font-size: 32px; \">FLIM</span><span style=\"color: black;  font-size: 32px;\">TRIO</span>\r\n"
	            + "</h2>"
	            + "<h2 style=\\\"color: black;>필름트리오 비밀번호 찾기를 위한 인증번호입니다.</h2>"
	            + "<p>인증번호: <strong style='font-size: 24px; color: #1E90FF;'>" + verificationCode + "</strong></p>"
	            + "<p>인증번호를 확인하여 이메일 주소 인증을 완료해 주세요.</p>"
	            + "</div>";
	        emailService.sendHtmlEmail(userDTO.getEmail(), "[FLIMTRIO] 비밀번호 찾기 인증번호 ", html);
	        
	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body(new SearchPassResponse(false, "이메일 발송에 실패했습니다."));
	    }

	    return ResponseEntity.ok(new SearchPassResponse(true, "인증코드가 이메일로 발송되었습니다."));
	}
	   
	   
	   @PostMapping("/search-password/verify-code")
	   public ResponseEntity<SearchPassResponse> verifyCodeAndResetPassword(@RequestBody VerificationRequestDTO request) {
	       
		   //검증
	       boolean isValid = emailVerificationService.verifyCode(request.getEmail(), request.getCode(),"비밀번호 찾기");
	      
	       if (!isValid) {
	           return ResponseEntity.status(HttpStatus.BAD_REQUEST)
	                   .body(new SearchPassResponse(false, "인증코드가 유효하지 않거나 만료되었습니다."));
	       }
	       return ResponseEntity.ok(new SearchPassResponse(true, 
	           "인증완료"));
	   }
	   
	   
	   @PostMapping("/search-password/temp-pass")
	   public ResponseEntity<SearchPassResponse> getTempPassword(@RequestBody VerificationRequestDTO request) {
	       
	       //임시 비번 제공 및 DB 업데이트
	       String tempPassword = emailVerificationService.resetPasswordToTemporary(request.getEmail());

	       return ResponseEntity.ok(new SearchPassResponse(true, 
	           "임시 비밀번호가 발급되었습니다. 로그인 후 꼭 변경해주세요", tempPassword));
	   }
	   
}