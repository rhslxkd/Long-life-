package com.oraclejava.longlife.service;

import com.oraclejava.longlife.model.Post;
import com.oraclejava.longlife.repo.PostRepository;
import lombok.RequiredArgsConstructor;
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

}
