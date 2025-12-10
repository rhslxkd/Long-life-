package com.oraclejava.longlife.model;

import com.oraclejava.longlife.base.IEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name="post")
public class Post implements IEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name="post_id")
  private Long postId;

  @Column(name="user_id")
  private String userId;

  @Column(name="exercise_id")
  private long exerciseId;

  private String title;
  private String content;

  @Column(name="created_at")
  LocalDateTime createdAt;

  @Column(name="updated_at")
  LocalDateTime updatedAt;

  @Column(name="view_count")
  private int viewCount;

  @Column(name="img_url")
  private String imgUrl;


  public void update(String title, String content, String imgUrl) {
    this.title = title;
    this.content = content;
    this.imgUrl = imgUrl;
  }

}
