package com.example.flim.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.flim.mapper.AuthMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailVerificationService {

	@Autowired
	private AuthMapper authMapper;
	
	@Autowired
	@Lazy //순환의존성 방지
	private PasswordEncoder passwordEncoder;
	
	//회원가입 이메일 인증 8.14 추가
	
	//회원가입
	public boolean SignupSaveVerificationCode(String email, String code, String purpose) {
   	 LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(15);
   	 return authMapper.insertVerificationCode(email, code, purpose, expiresAt); 
	}
		
	public boolean singupVerifyCode(String email, String code, String purpose) {
     String verifycode = authMapper.findVerificationCode(email, purpose);  	
     return code.equals(verifycode);
	}

	
	
	// 이메일 인증 8.11 추가
	
	//유저 확인
    public boolean checkUserByPhoneNumberAndEmail(String email) {
        return authMapper.existsByUserIdAndEmail(email);
    }

    //만료시간은 5분후로 설정하고 인증번호 DB저장
    public boolean saveVerificationCode(String email, String code , String purpose) {
    	 LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(5);
    	return authMapper.insertVerificationCode(email, code, purpose, expiresAt); 
    }

    //인증번호 , 인증번호 비교 
    public boolean verifyCode(String email, String code , String purpose) {
    	String verifycode = authMapper.findVerificationCode(email, purpose);  	
    	return code.equals(verifycode);
    }
        
    // 비번 초기화 진행 
    public String resetPasswordToTemporary(String email) {
        String tempPassword = UUID.randomUUID().toString().substring(0, 8);
        authMapper.updateTempPassword(email, passwordEncoder.encode(tempPassword));
        String purpose = "비밀번호 찾기";
        authMapper.markUsedVerificationCode(email,purpose);
        return tempPassword;
    }





}
