package com.example.flim.entity;

import java.time.LocalDateTime;

import javax.persistence.Entity;

import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class RefreshTokenEntity {

	
    private int id;

    private String email;

    private String refreshToken;

    private LocalDateTime issuedAt;

    private LocalDateTime expireAt;



}

