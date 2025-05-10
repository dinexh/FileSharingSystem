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

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(Authentication authentication, @RequestBody UpdateProfileRequest request) {
        User user = userService.updateProfile(authentication.getName(), request.getFullName(), request.getProfileImageUrl());
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile/password")
    public ResponseEntity<?> updatePassword(Authentication authentication, @RequestBody UpdatePasswordRequest request) {
        userService.updatePassword(authentication.getName(), request.getPassword());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/profile/image")
    public ResponseEntity<?> updateProfileImage(
            Authentication authentication,
            @RequestBody UpdateProfileImageRequest request) {
        User user = userService.updateProfileImage(authentication.getName(), request.getImageUrl());
        return ResponseEntity.ok(user);
    }
}

class UpdateProfileRequest {
    private String fullName;
    private String profileImageUrl;
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getProfileImageUrl() { return profileImageUrl; }
    public void setProfileImageUrl(String profileImageUrl) { this.profileImageUrl = profileImageUrl; }
}

class UpdatePasswordRequest {
    private String password;
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}

class UpdateProfileImageRequest {
    private String imageUrl;
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
} 