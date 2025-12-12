package com.oraclejava.longlife.dto;

import jakarta.validation.constraints.*;

public record RegisterRequest(
        @NotBlank @Size(min = 4, max = 10) String userId,
        @NotBlank @Email String email,
        @NotBlank @Size(max = 30) String name,
        @NotBlank @Size(min = 8, max = 100) String password,
        @NotBlank @Size(max = 255) String address,
        @Min(100) @Max(250) int height,
        @Min(30) @Max(200) int weight
) {
}
