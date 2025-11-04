package com.example.flim.mapper;

import java.util.Optional;

import org.apache.ibatis.annotations.Mapper;

import com.example.flim.entity.RefreshTokenEntity;

@Mapper
public interface RefreshTokenMapper {

	   Optional<RefreshTokenEntity> findByRefreshToken(String refreshToken);

	    void deleteByEmail(String email);

		void save(RefreshTokenEntity tokenEntity);

}
