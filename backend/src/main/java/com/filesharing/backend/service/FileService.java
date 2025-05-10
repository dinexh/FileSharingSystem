package com.filesharing.backend.service;

import com.filesharing.backend.model.File;
import com.filesharing.backend.model.User;
import com.filesharing.backend.repository.FileRepository;
import com.filesharing.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FileService {
    @Value("${file.upload-dir:./uploads}")
    private String uploadDir;

    private final FileRepository fileRepository;
    private final UserRepository userRepository;

    public FileService(FileRepository fileRepository, UserRepository userRepository) {
        this.fileRepository = fileRepository;
        this.userRepository = userRepository;
        System.out.println("FileService initialized with uploadDir: " + uploadDir);
    }

    public File uploadFile(MultipartFile file) throws IOException {
        try {
            System.out.println("Starting file upload process...");
            System.out.println("Upload directory: " + uploadDir);
            
            // Default to uploads directory if null
            if (uploadDir == null || uploadDir.trim().isEmpty()) {
                uploadDir = "./uploads";
                System.out.println("Using default upload directory: " + uploadDir);
            }
            
            // Ensure upload directory exists
            Path uploadPath = Paths.get(uploadDir);
            System.out.println("Upload path absolute: " + uploadPath.toAbsolutePath());
            
            if (!Files.exists(uploadPath)) {
                System.out.println("Creating upload directory...");
                Files.createDirectories(uploadPath);
                System.out.println("Upload directory created at: " + uploadPath.toAbsolutePath());
            } else {
                System.out.println("Upload directory already exists");
            }
            
            // Get original filename
            String originalFilename = file.getOriginalFilename();
            System.out.println("Original filename: " + originalFilename);
            
            if (originalFilename == null || originalFilename.isEmpty()) {
                throw new IOException("Original filename is null or empty");
            }
            
            // Generate new unique filename
            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String newFilename = UUID.randomUUID().toString() + fileExtension;
            System.out.println("New filename: " + newFilename);
            
            // Define the complete path where file will be saved
            Path filePath = uploadPath.resolve(newFilename);
            System.out.println("File will be saved to: " + filePath.toString());
            
            // Copy file to destination
            System.out.println("Copying file to destination...");
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            System.out.println("File copied successfully");
            
            // Create database entity
            System.out.println("Creating database entity...");
            File fileEntity = new File();
            fileEntity.setFileName(newFilename);
            fileEntity.setFilePath(filePath.toString());
            fileEntity.setFileSize(file.getSize());
            fileEntity.setFileType(file.getContentType());
            fileEntity.setOriginalFileName(originalFilename);
            fileEntity.setOriginalName(originalFilename); // Set both for compatibility
            fileEntity.setUploadDate(LocalDateTime.now());
            fileEntity.setPublic(false);
            fileEntity.setOwnerId(1L); // Default to 1
            fileEntity.setUserId(1L);  // Default to 1
            
            // Save to database
            System.out.println("Saving to database...");
            File savedFile = fileRepository.save(fileEntity);
            System.out.println("File saved to database with ID: " + savedFile.getId());
            
            return savedFile;
        } catch (Exception e) {
            System.err.println("Error in uploadFile: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public List<File> getAllFiles() {
        return fileRepository.findAll();
    }
    
    public List<Map<String, Object>> getAllFilesWithUserDetails() {
        List<File> files = fileRepository.findAll();
        
        return files.stream().map(file -> {
            Map<String, Object> fileWithUserDetails = Map.of(
                "id", file.getId(),
                "fileName", file.getFileName(),
                "originalName", file.getOriginalName(),
                "fileSize", file.getFileSize(),
                "fileType", file.getFileType(),
                "uploadDate", file.getUploadDate(),
                "isPublic", file.isPublic(),
                "accessCode", file.getAccessCode() != null ? file.getAccessCode() : ""
            );
            
            // Add user details if available
            Optional<User> userOptional = userRepository.findById(file.getOwnerId());
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                fileWithUserDetails = new java.util.HashMap<>(fileWithUserDetails);
                ((java.util.HashMap<String, Object>) fileWithUserDetails).put("ownerName", user.getFullName());
                ((java.util.HashMap<String, Object>) fileWithUserDetails).put("ownerEmail", user.getEmail());
                ((java.util.HashMap<String, Object>) fileWithUserDetails).put("ownerProfileImage", user.getProfileImageUrl());
            } else {
                fileWithUserDetails = new java.util.HashMap<>(fileWithUserDetails);
                ((java.util.HashMap<String, Object>) fileWithUserDetails).put("ownerName", "Unknown User");
                ((java.util.HashMap<String, Object>) fileWithUserDetails).put("ownerEmail", "");
                ((java.util.HashMap<String, Object>) fileWithUserDetails).put("ownerProfileImage", "");
            }
            
            return fileWithUserDetails;
        }).collect(Collectors.toList());
    }

    public List<File> getFilesByUserId(Long userId) {
        // Method to get files by user ID
        return fileRepository.findByUserId(userId);
    }
    
    public File getFileById(Long fileId) {
        return fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found with id: " + fileId));
    }

    public void deleteFile(Long fileId) throws IOException {
        File file = fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));
        Files.deleteIfExists(Paths.get(file.getFilePath()));
        fileRepository.delete(file);
    }
} 