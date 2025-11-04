package com.example.flim.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.flim.entity.RefreshTokenEntity;
import com.example.flim.mapper.RefreshTokenMapper;

@Service
public class RefreshTokenService {

    @Autowired
    private RefreshTokenMapper refreshTokenmapper;

    public void saveRefreshToken(String email, String refreshToken, LocalDateTime expireAt) {
        // 기존 토큰 삭제 (중복 방지)
    	refreshTokenmapper.deleteByEmail(email);

    	RefreshTokenEntity tokenEntity = new RefreshTokenEntity();
        tokenEntity.setEmail(email);
        tokenEntity.setRefreshToken(refreshToken);
        tokenEntity.setIssuedAt(LocalDateTime.now());
        tokenEntity.setExpireAt(expireAt);

        refreshTokenmapper.save(tokenEntity);
    }

    public Optional<RefreshTokenEntity> findByRefreshToken(String refreshToken) {
    	return refreshTokenmapper.findByRefreshToken(refreshToken);
    }

    public void deleteByEmail(String email) {
    	refreshTokenmapper.deleteByEmail(email);
    }
}
