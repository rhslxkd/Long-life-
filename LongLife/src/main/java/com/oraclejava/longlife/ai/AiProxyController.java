package com.oraclejava.longlife.ai;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ai")
public class AiProxyController {

    private final RestTemplate restTemplate;

    @PostMapping("/chat")
    public ChatResponse chat(@RequestBody ChatRequest request) {

        String fastApiUrl = "http://localhost:8000/chat";

        // 1) FastAPI에서 문자열로 받아오기
        String raw = restTemplate.postForObject(fastApiUrl, request, String.class);
        System.out.println("=== RAW FROM FASTAPI ===");
        System.out.println(raw);

        try {
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
