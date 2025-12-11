package com.oraclejava.longlife.service;

import com.oraclejava.longlife.dto.FriendDto;
import com.oraclejava.longlife.dto.PostResponseDto;
import com.oraclejava.longlife.model.Exercise;
import com.oraclejava.longlife.model.Friend;
import com.oraclejava.longlife.model.Post;
import com.oraclejava.longlife.repo.ExerciseRepository;
import com.oraclejava.longlife.repo.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService extends BaseTransactioanalService{

    private final PostRepository postRepository;
    private final FileStorageService fileStorageService;
    private final FriendService friendService;
    private final ExerciseRepository exerciseRepository;

    //운동스토리 전체조회
    public List<Post> getAllStory(){
        return postRepository.findAll();
    }

   //스토리저장
   public Post savePost(Post post , MultipartFile poster) throws IOException {

        if(poster != null && !poster.isEmpty() ){
           var saved =fileStorageService.storePoster(poster);
           post.setImgUrl(saved.subdir()+"/"+ saved.filename());
       }

        return postRepository.save(post);
   }

   public List<Post> searchData(String searchData){
        return postRepository.findSearchTitleContent(searchData);

   }

   public ResponseEntity<Post> deletePost(Long id){
        postRepository.deleteById(id);
        return ResponseEntity.ok().build();
   }

    public Post updatePost(Long id, Post post) {
        Post uPost = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("story not found"));
        uPost.update(post.getTitle(),post.getContent(),post.getImgUrl());
        return uPost;
    }


    // 이미지 수정
    public Post updateImgFile(Long id, MultipartFile ImgFile) throws IOException {
        Post uPost = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("post image not found"));
        var saved = fileStorageService.storePoster(ImgFile);
        uPost.setImgUrl(saved.subdir() + "/" + saved.filename());
        return uPost;
    }

    // 총 스토리 수
    public long PostCount() {
        return postRepository.count();
    }

    // 친구 스토리 가져오기
    public Page<PostResponseDto> getFriendsPosts(String userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("postId").descending());
        List<String> friendListId = friendService.getFriends(userId).stream().map(FriendDto::receiverId).toList();
        Page<Post> friendsPosts = postRepository.findByUserIdIn(friendListId, pageable);

        return friendsPosts.map((fp) -> new PostResponseDto(
                fp.getPostId(),
                fp.getUserId(),
                exerciseRepository.findById(fp.getExerciseId()).map(Exercise::getName).orElse(null),
                fp.getTitle(),
                fp.getContent(),
                fp.getCreatedAt(),
                fp.getViewCount(),
                fp.getImgUrl()
        ));
    }

    // 친구 스토리 최신 3개 가져오기
    public List<PostResponseDto> getTop3FriendsPosts(String userId) {
        List<String> friendListId = friendService.getFriends(userId).stream().map(FriendDto::receiverId).toList();

        return postRepository.findTop3ByUserIdInOrderByCreatedAtDesc(friendListId).stream().map((fp) -> new PostResponseDto(
                fp.getPostId(),
                fp.getUserId(),
                exerciseRepository.findById(fp.getExerciseId()).map(Exercise::getName).orElse(null),
                fp.getTitle(),
                fp.getContent(),
                fp.getCreatedAt(),
                fp.getViewCount(),
                fp.getImgUrl()
        )).toList();
    }
}
