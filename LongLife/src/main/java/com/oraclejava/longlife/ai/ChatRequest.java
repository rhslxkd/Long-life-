package com.oraclejava.longlife.ai;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatRequest {
    private String message;

    public void setMessage(String message) {
        this.message = message;
    }
}
