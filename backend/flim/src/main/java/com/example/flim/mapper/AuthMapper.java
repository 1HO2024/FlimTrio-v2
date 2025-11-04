package com.example.flim.mapper;

import java.time.LocalDateTime;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.flim.dto.UserDTO;

@Mapper
public interface AuthMapper {
	
        // 회원가입
	    boolean isSignup(String email);
		void insertUser(UserDTO userDTO);
		
		//회원정보 조회
		UserDTO findByEmail(String email);
		String getNickname(String email);
		String getPhonenumber(String email);
		
	
		//회원정보 수정
		void updateProfile(@Param("email")          String email, 
				           @Param("nickname")       String nickname, 
				           @Param("hasedupdatePass")String hasedupdatePass);
		//useridx 추출
		int getUserIdx(String email);

		
		void updateProfileNopass(@Param("email")    String email,
				                 @Param("nickname") String nickname);
		
		//비빌번호찾기 ---------------------------------------------------
		boolean existsByUserIdAndEmail(@Param("email")      String email);
		
		void updateTempPassword(@Param("email")              String email,
                                @Param("hashedTempPassword") String hashedTempPassword);
				
		boolean insertVerificationCode(@Param("email")      String email,
				                       @Param("code")       String code, 
				                       @Param("purpose")    String purpose, 
				                       @Param("expiresAt")  LocalDateTime expiresAt);
		
		String findVerificationCode(@Param("email")   String email,
									@Param("purpose") String purpose);

		void markUsedVerificationCode(@Param("email") String email, 
				                     @Param("purpose") String purpose);
		//--------------------------------------------------------------------



	}

