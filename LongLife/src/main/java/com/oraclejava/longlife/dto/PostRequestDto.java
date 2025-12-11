package com.oraclejava.longlife.dto;

import com.oraclejava.longlife.model.Users;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

public record PostRequestDto(
         String userId,
         Long exerciseId,
         String title,
         String content,
         LocalDateTime createdAt,
         LocalDateTime updatedAt
) {

}
