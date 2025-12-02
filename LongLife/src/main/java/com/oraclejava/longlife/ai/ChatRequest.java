package com.oraclejava.longlife.ai;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatRequest {
    private String message;

    // 사용자 Id (or session Id)뭐든 담을 필드를 추가
    @JsonProperty("session_id") // FastAPI와 맞추기 위해 JSON 속성명 지정
    private String sessionId;
}
