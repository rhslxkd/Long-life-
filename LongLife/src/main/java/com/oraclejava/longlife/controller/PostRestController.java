package com.oraclejava.longlife.controller;

import com.oraclejava.longlife.model.Post;
import com.oraclejava.longlife.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/post")
@RequiredArgsConstructor
public class PostRestController {

    private final PostService postService;

    //전체 스토리 가져오기
    @GetMapping("/story")
    public List<Post> post(){
        return postService.getAllStory();
    }

    //스토리 등록
    @PostMapping(value="/create",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Post> addPost(
            @RequestPart Post post,
            @RequestPart(required = false) MultipartFile poster) throws IOException {
        Post savedPost = postService.savePost(post,poster);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(savedPost);
    }

    //검색어 조회
    @GetMapping("/search")
    public List<Post> searchPost(@RequestParam String searchData){
        return postService.searchData(searchData);

    }

    //삭제
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
         postService.deletePost(id);
    }



}
