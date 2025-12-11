package com.oraclejava.longlife.dto;

import com.oraclejava.longlife.model.Users;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.apache.catalina.User;

import java.time.LocalDateTime;

@Data
public class PostRequestDto {
    private String userId;
    private Long exerciseId;
    private String title;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int viewCount;
    private String imgUrl;

}
