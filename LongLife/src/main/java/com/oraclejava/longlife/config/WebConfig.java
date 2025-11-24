package com.oraclejava.longlife.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // CORS를 적용할 API 경로 패턴
                .allowedOrigins("http://localhost:3000") // 프런트엔드 주소
                .allowedMethods("GET", "POST", "PUT", "DELETE") // 허용할 메소드
                .allowedHeaders("*")
                .allowCredentials(true) // 쿠키/인증 정보 전송 허용 여부
                .maxAge(3600);
    }
}
