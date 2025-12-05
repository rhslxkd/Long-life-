package com.oraclejava.longlife.service;

import com.oraclejava.longlife.model.Post;
import com.oraclejava.longlife.repo.PostRepository;
import lombok.RequiredArgsConstructor;
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

   public void deletePost(Long id){
        postRepository.deleteById(id);
   }

}
