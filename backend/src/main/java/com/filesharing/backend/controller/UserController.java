package com.filesharing.backend.controller;

import com.filesharing.backend.model.User;
import com.filesharing.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(Authentication authentication) {
        User user = userService.getUserByEmail(authentication.getName());
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile/image")
    public ResponseEntity<?> updateProfileImage(
            Authentication authentication,
            @RequestBody UpdateProfileImageRequest request) {
        User user = userService.updateProfileImage(authentication.getName(), request.getImageUrl());
        return ResponseEntity.ok(user);
    }
}

class UpdateProfileImageRequest {
    private String imageUrl;

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
} 