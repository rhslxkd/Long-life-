package com.oraclejava.longlife.controller;

import com.oraclejava.longlife.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
public class AdminController {
    private final AdminService adminService;

    // 유저 목록
    @GetMapping("/userList")
    public ResponseEntity<?> getUsers(@RequestParam(defaultValue = "0") int page,
                                      @RequestParam(defaultValue = "5") int size,
                                      @RequestParam(required = false) String searchData) {
        if (searchData != null) {
            return ResponseEntity.ok(adminService.getSearchUsers(searchData, page, size));
        } else {
            return ResponseEntity.ok(adminService.getUsers(page, size));
        }
    }

    // 유저 삭제
    @DeleteMapping("/user/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable String userId) {
        adminService.UserDelete(userId);

        return ResponseEntity.ok().build();
    }

    // 스토리 목록
    @GetMapping("/postList")
    public ResponseEntity<?> getPosts(@RequestParam(defaultValue = "0") int page,
                                      @RequestParam(defaultValue = "5") int size,
                                      @RequestParam(required = false) String searchData) {

        if (searchData != null) {
            return ResponseEntity.ok(adminService.getSearchPosts(searchData, page, size));
        } else {
            return ResponseEntity.ok(adminService.getAllPosts(page, size));
        }
    }
}
