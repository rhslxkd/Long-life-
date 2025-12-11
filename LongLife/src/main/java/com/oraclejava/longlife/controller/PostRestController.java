package com.oraclejava.longlife.controller;

import com.oraclejava.longlife.dto.PostRequestDto;
import com.oraclejava.longlife.dto.PostUpdateDto;
import com.oraclejava.longlife.model.Exercise;
import com.oraclejava.longlife.model.Post;
import com.oraclejava.longlife.model.Users;
import com.oraclejava.longlife.repo.ExerciseRepository;
import com.oraclejava.longlife.repo.PostRepository;
import com.oraclejava.longlife.repo.UsersRepository;
import com.oraclejava.longlife.service.ExerciseService;
import com.oraclejava.longlife.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/post")
@RequiredArgsConstructor
public class PostRestController {

    private final PostService postService;
    private final ExerciseRepository exerciseRepository;
    private final UsersRepository usersRepository;

    //전체 스토리 가져오기 페이징 미적용
//    @GetMapping("/story")
//    public List<Post> post(@RequestParam String userId) throws IOException {
//        return postService.getAllStory(userId);
//    }

    //전체 스토리 가져오기 페이징적용
//    @GetMapping("/story")
//    public Page<Post> post(
//            @RequestParam String userId,
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "5") int size
//    ) {
//        return postService.getAllStory(userId, page, size);
//    }
//전체 스토리 가져오기 페이징 최종본
    @GetMapping("/story")
    public ResponseEntity<?> post(
            @RequestParam String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        return ResponseEntity.ok(postService.getAllStory(userId, page, size));
    }


    //검색어 조회 페이징미적용
//    @GetMapping("/search")
//    public List<Post> searchPost(@RequestParam String searchData,@RequestParam String userId){
//        return postService.searchData(searchData,userId);
//    }
    @GetMapping("/search")
    public ResponseEntity<?> searchPost(@RequestParam String searchData,
                                        @RequestParam String userId,
                                        @RequestParam(defaultValue = "0") int page,
                                        @RequestParam(defaultValue = "5") int size)
    {
        return ResponseEntity.ok(postService.searchData(searchData,userId,page,size));
    }


    //스토리 등록
    @PostMapping(value="/create",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Post> addPost(
            @RequestPart("post") PostRequestDto dto,
            @RequestPart(required = false) MultipartFile poster) throws IOException {

        Users user = usersRepository.findById(dto.userId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Exercise exercise = exerciseRepository.findById(dto.exerciseId())
                .orElseThrow(() -> new IllegalArgumentException("Exercise not found"));

        Post post = new Post();
        post.setUser(user);
        post.setTitle(dto.title());
        post.setContent(dto.content());
        post.setExercise(exercise);
        post.setCreatedAt(dto.createdAt());
        post.setUpdatedAt(dto.updatedAt());

        Post saved = postService.savePost(post, poster);
        return ResponseEntity.ok(saved);

    }  

    //삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Post> delete(@PathVariable Long id){
        postService.deletePost(id);
        return ResponseEntity.ok().build();
    }

    //수정
    @PutMapping(value = "/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Post> update(
            @PathVariable long id,
            @RequestPart("post") PostUpdateDto dto,
            @RequestPart(required = false) MultipartFile imgfile
    ) throws IOException {

        Exercise exercise = exerciseRepository.findById(dto.exerciseId())
                .orElseThrow(() -> new IllegalArgumentException("Exercise not found"));

//        Post savedPost = postService.updatePost(id, post);
        Post post = new Post();
        post.setTitle(dto.title());
        post.setContent(dto.content());
        post.setExercise(exercise);
        post.setUpdatedAt(dto.updatedAt());

        //if(포스터가 있으면) 업로드;
        if (imgfile != null && !imgfile.isEmpty()) {
            postService.updateImgFile(id, imgfile);
        }

        Post postUp = postService.updatePost(id, post);

        return ResponseEntity.ok(postUp);

    }

    // 총 스토리 수
    @GetMapping("/count")
    public long getCount() {
        return postService.PostCount();
    }

    // 친구 스토리 가져오기
    @GetMapping("/friendStory")
    public ResponseEntity<?> friendStory(@AuthenticationPrincipal User user,
                                         @RequestParam(defaultValue = "0") int page,
                                         @RequestParam(defaultValue = "2") int size){
        return ResponseEntity.ok(postService.getFriendsPosts(user.getUsername(), page, size));
    }

    // 친구 스토리 최신 3개 가져오기
    @GetMapping("/top3FriendStory")
    public ResponseEntity<?> top3FriendStory(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(postService.getTop3FriendsPosts(user.getUsername()));
    }
}
