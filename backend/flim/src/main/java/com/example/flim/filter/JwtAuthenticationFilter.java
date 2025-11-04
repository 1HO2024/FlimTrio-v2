package com.example.flim.filter;

import java.io.IOException;


import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.flim.service.AuthService;
import com.example.flim.util.JwtUtil;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final AuthService authService;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, AuthService authService) {
        this.jwtUtil = jwtUtil;
        this.authService = authService;
    }

    @Override
    protected void doFilterInternal(jakarta.servlet.http.HttpServletRequest request,
			jakarta.servlet.http.HttpServletResponse response, jakarta.servlet.FilterChain filterChain)
			throws jakarta.servlet.ServletException, IOException{
        // 요청에서 JWT 토큰 추출
        String jwtToken = extractJwtFromRequest(request);

        
        // 토큰이 유효하고, 인증된 사용자가 있으면
        if (jwtToken != null && jwtUtil.validateToken(jwtToken)) { 
        	String username = jwtUtil.extractUsername(jwtToken);

            
            UserDetails userDetails = authService.loadUserByUsername(username);  // 사용자 정보

            // 사용자 인증 객체 
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());

            // 인증 정보를 SecurityContext에 설정
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        // 요청을 필터 체인에 전달하여 다른 필터들이 처리할 수 있도록 함
        filterChain.doFilter(request, response);
    }

    private String extractJwtFromRequest(jakarta.servlet.http.HttpServletRequest request) {

    	 if (request.getCookies() != null) {
    	        for (jakarta.servlet.http.Cookie cookie : request.getCookies()) {
    	            if ("accessToken".equals(cookie.getName())) {  // 쿠키 이름 정확히
    	                return cookie.getValue();
    	            }
    	        }
    	    }

        // 없으면 null 반환
        return null;
    }
}
