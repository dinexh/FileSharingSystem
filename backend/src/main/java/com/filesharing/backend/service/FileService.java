package com.filesharing.backend.service;

import com.filesharing.backend.model.File;
import com.filesharing.backend.model.StarredFile;
import com.filesharing.backend.model.User;
import com.filesharing.backend.repository.FileRepository;
import com.filesharing.backend.repository.StarredFileRepository;
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
    private final StarredFileRepository starredFileRepository;

    public FileService(FileRepository fileRepository, UserRepository userRepository, StarredFileRepository starredFileRepository) {
        this.fileRepository = fileRepository;
        this.userRepository = userRepository;
        this.starredFileRepository = starredFileRepository;
        System.out.println("FileService initialized with uploadDir: " + uploadDir);
    }

    public File uploadFile(MultipartFile file, Long userId) throws IOException {
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
            fileEntity.setOwnerId(userId); // Set to provided userId
            fileEntity.setUserId(userId);  // Set to provided userId
            
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

    public Long getUserIdByEmail(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            return userOptional.get().getId();
        }
        return 1L; // Default to 1 if user not found
    }

    public List<Map<String, Object>> getFilesWithUserDetailsByUserId(Long userId) {
        List<File> files = fileRepository.findByUserId(userId);
        
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

    /**
     * Star a file for a user
     * @param fileId the ID of the file to star
     * @param userId the ID of the user starring the file
     * @return true if the file was starred, false if it was already starred
     */
    public boolean starFile(Long fileId, Long userId) {
        if (starredFileRepository.existsByUserIdAndFileId(userId, fileId)) {
            return false; // Already starred
        }
        
        // Verify the file exists
        File file = fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found with id: " + fileId));
        
        // Create and save the starred file record
        StarredFile starredFile = new StarredFile(userId, fileId);
        starredFileRepository.save(starredFile);
        return true;
    }
    
    /**
     * Unstar a file for a user
     * @param fileId the ID of the file to unstar
     * @param userId the ID of the user unstarring the file
     * @return true if the file was unstarred, false if it wasn't starred
     */
    public boolean unstarFile(Long fileId, Long userId) {
        if (!starredFileRepository.existsByUserIdAndFileId(userId, fileId)) {
            return false; // Not starred
        }
        
        // Delete the starred file record
        starredFileRepository.deleteByUserIdAndFileId(userId, fileId);
        return true;
    }
    
    /**
     * Get starred file IDs for a user
     * @param userId the ID of the user
     * @return list of file IDs that are starred
     */
    public List<Long> getStarredFileIdsByUserId(Long userId) {
        List<StarredFile> starredFiles = starredFileRepository.findByUserId(userId);
        return starredFiles.stream()
                .map(StarredFile::getFileId)
                .collect(Collectors.toList());
    }
    
    /**
     * Get all starred files for a user with details
     * @param userId the ID of the user
     * @return list of file details that are starred
     */
    public List<Map<String, Object>> getStarredFilesWithDetailsByUserId(Long userId) {
        List<Long> starredFileIds = getStarredFileIdsByUserId(userId);
        List<File> starredFiles = starredFileIds.stream()
                .map(fileId -> fileRepository.findById(fileId).orElse(null))
                .filter(file -> file != null)
                .collect(Collectors.toList());
        
        return starredFiles.stream()
                .map(file -> {
                    Map<String, Object> fileDetails = new java.util.HashMap<>();
                    fileDetails.put("id", file.getId());
                    fileDetails.put("fileName", file.getFileName());
                    fileDetails.put("originalName", file.getOriginalName());
                    fileDetails.put("fileSize", file.getFileSize());
                    fileDetails.put("fileType", file.getFileType());
                    fileDetails.put("uploadDate", file.getUploadDate());
                    fileDetails.put("isPublic", file.isPublic());
                    fileDetails.put("accessCode", file.getAccessCode() != null ? file.getAccessCode() : "");
                    
                    // Add owner info
                    Optional<User> userOptional = userRepository.findById(file.getOwnerId());
                    if (userOptional.isPresent()) {
                        User user = userOptional.get();
                        fileDetails.put("ownerName", user.getFullName());
                        fileDetails.put("ownerEmail", user.getEmail());
                        fileDetails.put("ownerProfileImage", user.getProfileImageUrl());
                    } else {
                        fileDetails.put("ownerName", "Unknown User");
                        fileDetails.put("ownerEmail", "");
                        fileDetails.put("ownerProfileImage", "");
                    }
                    
                    return fileDetails;
                })
                .collect(Collectors.toList());
    }
    
    /**
     * Check if a file is starred by a user
     * @param fileId the ID of the file
     * @param userId the ID of the user
     * @return true if the file is starred by the user
     */
    public boolean isFileStarredByUser(Long fileId, Long userId) {
        return starredFileRepository.existsByUserIdAndFileId(userId, fileId);
    }
    
    /**
     * Add star status to file details
     * @param filesWithDetails list of file details
     * @param userId the ID of the user
     * @return list of file details with star status
     */
    public List<Map<String, Object>> addStarStatusToFiles(List<Map<String, Object>> filesWithDetails, Long userId) {
        List<Long> starredFileIds = getStarredFileIdsByUserId(userId);
        
        return filesWithDetails.stream()
                .peek(fileDetails -> {
                    Long fileId = ((Number) fileDetails.get("id")).longValue();
                    fileDetails.put("isStarred", starredFileIds.contains(fileId));
                })
                .collect(Collectors.toList());
    }
    
    /**
     * Get files with details by user ID including star status
     * @param userId the ID of the user
     * @return list of file details with star status
     */
    public List<Map<String, Object>> getFilesWithUserDetailsByUserIdWithStars(Long userId) {
        List<Map<String, Object>> filesWithDetails = getFilesWithUserDetailsByUserId(userId);
        return addStarStatusToFiles(filesWithDetails, userId);
    }
} 