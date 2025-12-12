package com.oraclejava.longlife.service;

import com.oraclejava.longlife.dto.ForAdminPostDto;
import com.oraclejava.longlife.dto.FriendDto;
import com.oraclejava.longlife.dto.PostRequestDto;
import com.oraclejava.longlife.dto.PostResponseDto;
import com.oraclejava.longlife.model.Exercise;
import com.oraclejava.longlife.model.Likes;
import com.oraclejava.longlife.model.Post;
import com.oraclejava.longlife.repo.ExerciseRepository;
import com.oraclejava.longlife.repo.LikeRepository;
import com.oraclejava.longlife.repo.PostRepository;
import com.oraclejava.longlife.repo.UsersRepository;
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
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PostService extends BaseTransactioanalService{

    private final PostRepository postRepository;
    private final FileStorageService fileStorageService;
    private final UsersRepository usersRepository;
    private final FriendService friendService;
    private final ExerciseRepository exerciseRepository;
    private final LikeRepository likeRepository;

    //운동스토리 전체조회 계정별  페이징 없이
    //    public List<Post> getAllStory(String userId){
    //        return postRepository.findAllByUserId(userId);
    //    }
    //운동스토리 전체조회 계정별  페이징 적용
    public Page<PostResponseDto> getAllStory(String userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("postId").descending());
        Page<Post> posts = postRepository.findAllByUserId(userId, pageable);

        return posts.map(post -> {
            Long likeCount = likeRepository.countByPost(post);

            return new PostResponseDto(
                    post.getPostId(),
                    post.getUser().getUserId(),
                    post.getExercise().getName(),
                    post.getTitle(),
                    post.getContent(),
                    post.getCreatedAt(),
                    post.getViewCount(),
                    post.getImgUrl(),
                    true,
                    likeCount
            );
        });
    }

    //검색 페이징 미적용
    public Page<PostResponseDto> searchData(String searchData ,String userId, int page, int size){
        Pageable pageable = PageRequest.of(page, size, Sort.by("postId").descending());
        Page<Post> posts = postRepository.findSearchTitleContent(searchData , userId, pageable);

        return posts.map(post -> {
            Long likeCount = likeRepository.countByPost(post);

            return new PostResponseDto(
                    post.getPostId(),
                    post.getUser().getUserId(),
                    post.getExercise().getName(),
                    post.getTitle(),
                    post.getContent(),
                    post.getCreatedAt(),
                    post.getViewCount(),
                    post.getImgUrl(),
                    true,
                    likeCount
            );
        });
    }


   //스토리저장
   public Post savePost(Post post , MultipartFile poster) throws IOException {

        if(poster != null && !poster.isEmpty() ){
           var saved =fileStorageService.storePoster(poster);
           post.setImgUrl(saved.subdir()+"/"+ saved.filename());
       }

        return postRepository.save(post);
   } 

   //삭제
   public ResponseEntity<Post> deletePost(Long id){
        postRepository.deleteById(id);
        return ResponseEntity.ok().build();
   }

   //수정
    public Post updatePost(Long id, Post post) {
        Post uPost = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("story not found"));

        uPost.setTitle(post.getTitle());
        uPost.setContent(post.getContent());
        uPost.setExercise(post.getExercise());
        uPost.setUpdatedAt(post.getUpdatedAt());
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
        Page<Post> friendsPosts = postRepository.findByUser_UserIdIn(friendListId, pageable);

        return friendsPosts.map((fp) -> {
            Optional<Likes> likesOptional = likeRepository.findByPostAndUser(fp, usersRepository.findById(userId).get());
            boolean likedByUser = likesOptional.isPresent() && likesOptional.get().isLike();
            Long likeCount = likeRepository.countByPost(fp);

            return new PostResponseDto(
                    fp.getPostId(),
                    fp.getUser().getUserId(),
                    fp.getExercise().getName(),
                    fp.getTitle(),
                    fp.getContent(),
                    fp.getCreatedAt(),
                    fp.getViewCount(),
                    fp.getImgUrl(),
                    likedByUser,
                    likeCount
            );
        });
    }

    // 친구 스토리 최신 3개 가져오기
    public List<PostResponseDto> getTop3FriendsPosts(String userId) {
        List<String> friendListId = friendService.getFriends(userId).stream().map(FriendDto::receiverId).toList();

        return postRepository.findTop3ByUser_UserIdInOrderByCreatedAtDesc(friendListId).stream().map((fp) -> {
            Optional<Likes> likesOptional = likeRepository.findByPostAndUser(fp, usersRepository.findById(userId).get());
            boolean likedByUser = likesOptional.isPresent() && likesOptional.get().isLike();
            Long likeCount = likeRepository.countByPost(fp);

            return new PostResponseDto(
                    fp.getPostId(),
                    fp.getUser().getUserId(),
                    fp.getExercise().getName(),
                    fp.getTitle(),
                    fp.getContent(),
                    fp.getCreatedAt(),
                    fp.getViewCount(),
                    fp.getImgUrl(),
                    likedByUser,
                    likeCount
            );
        }).toList();
    }
}
