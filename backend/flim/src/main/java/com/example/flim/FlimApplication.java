package com.example.flim;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication(scanBasePackages = "com.example.flim")
public class FlimApplication {

    public static void main(String[] args) {
        // .env 로딩
        Dotenv dotenv = Dotenv.load();

        // 시스템 프로퍼티 설정
        System.setProperty("MAIL_HOST", dotenv.get("MAIL_HOST"));
        System.setProperty("MAIL_PORT", dotenv.get("MAIL_PORT"));
        System.setProperty("MAIL_USERNAME", dotenv.get("MAIL_USERNAME"));
        System.setProperty("MAIL_PASSWORD", dotenv.get("MAIL_PASSWORD"));
        
        SpringApplication.run(FlimApplication.class, args);
    }

}
