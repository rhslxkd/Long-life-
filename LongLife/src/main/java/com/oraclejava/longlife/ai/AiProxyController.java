package com.oraclejava.longlife.ai;

import com.oraclejava.longlife.model.Users;
import com.oraclejava.longlife.repo.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.security.Principal;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ai")
public class AiProxyController {

    private final RestTemplate restTemplate;

    private final UsersRepository usersRepository;

    @PostMapping("/chat")
    // Principal 객체: Spring Security에서 인증된 사용자 정보를 담고 있는 객체
    public ChatResponse chat(@RequestBody ChatRequest request, Principal principal) {

        //1. 로그인 여부 확인 및 세션 ID 주입 ㄹㅇ ㅈㄴ 개 핵심
        if (principal != null) {
            String loginId = principal.getName(); // 로그인한 사용자의 ID를 가져옴
            //DB에서 사용자 정보 조회
            Users user = usersRepository.findById(loginId)
                    .orElseThrow(() -> new RuntimeException("로그인된 유저를 찾을 수 없습니다."));

            //Entity에서 진짜 PK를 꺼내서 sessionId로 사용
            request.setSessionId(user.getUserId());
            System.out.println("=== AI Session Connected: " + user.getUserId() + " (" + user.getName() + ") ===");
        } else {
            //비로그인 사용자는 임시 세션 ID 부여 (실제 서비스에서는 UUID 등으로 생성 권장)
            request.setSessionId("guest_session");
            System.out.println("=== AI Session Connected: guest_session (Guest) ===");
        }

        String fastApiUrl = "http://localhost:8000/chat";



        try {

            // 1) FastAPI에서 문자열로 받아오기
            String raw = restTemplate.postForObject(fastApiUrl, request, String.class);
            System.out.println("=== RAW FROM FASTAPI ===");
            System.out.println(raw);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(raw);

            // reply 필드만 직접 추출
            String reply = node.path("reply").asText(null);
            System.out.println("=== PARSED REPLY === " + reply);

            return new ChatResponse(reply);

        } catch (Exception e) {
            e.printStackTrace();
            return new ChatResponse("FastAPI 응답 파싱 실패: " + e.getMessage());
        }
    }
}
