package com.filesharing.backend.controller;

import com.filesharing.backend.model.File;
import com.filesharing.backend.service.FileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.io.FileInputStream;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.util.StreamUtils;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = {"http://localhost:3000", "http://docs.google.com", "https://docs.google.com"}, 
             allowedHeaders = "*", 
             exposedHeaders = {HttpHeaders.CONTENT_DISPOSITION, HttpHeaders.CONTENT_TYPE})
public class FileController {
    private final FileService fileService;
    @Value("${file.upload-dir}")
    private String uploadDir;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping("/upload")
    public ResponseEntity<File> uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        System.out.println("Upload endpoint hit!");
        File uploadedFile = fileService.uploadFile(file);
        return ResponseEntity.ok(uploadedFile);
    }

    @GetMapping
    public ResponseEntity<List<File>> getAllFiles() {
        List<File> files = fileService.getAllFiles();
        return ResponseEntity.ok(files);
    }
    
    @GetMapping("/with-details")
    public ResponseEntity<List<Map<String, Object>>> getAllFilesWithDetails() {
        List<Map<String, Object>> filesWithDetails = fileService.getAllFilesWithUserDetails();
        return ResponseEntity.ok(filesWithDetails);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<File>> getFilesByUserId(@PathVariable Long userId) {
        List<File> files = fileService.getFilesByUserId(userId);
        return ResponseEntity.ok(files);
    }
    
    @GetMapping("/download/{fileId}")
    public void downloadFile(@PathVariable Long fileId, HttpServletResponse response) throws IOException {
        try {
            File file = fileService.getFileById(fileId);
            Path filePath = Paths.get(file.getFilePath());
            java.io.File fileObject = filePath.toFile();
            
            if (!fileObject.exists()) {
                response.sendError(HttpStatus.NOT_FOUND.value(), "File not found");
                return;
            }
            
            // Set CORS headers manually
            response.setHeader("Access-Control-Allow-Origin", "*");
            response.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
            response.setHeader("Access-Control-Allow-Headers", "*");
            response.setHeader("Access-Control-Expose-Headers", "Content-Disposition, Content-Type, Content-Length");
            response.setHeader("Cache-Control", "max-age=86400");
            
            // Set content type
            response.setContentType(file.getFileType());
            response.setContentLengthLong(fileObject.length());
            
            // Determine if we should display inline (for PDFs) or as attachment (for other files)
            if (file.getFileType() != null && file.getFileType().equals("application/pdf")) {
                response.setHeader("Content-Disposition", "inline; filename=\"" + file.getOriginalFileName() + "\"");
            } else {
                response.setHeader("Content-Disposition", "attachment; filename=\"" + file.getOriginalFileName() + "\"");
            }
            
            // Copy the file content directly to the response output stream
            try (InputStream inputStream = new FileInputStream(fileObject)) {
                StreamUtils.copy(inputStream, response.getOutputStream());
                response.getOutputStream().flush();
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Error downloading file: " + e.getMessage());
        }
    }
    
    @GetMapping("/view/{fileId}")
    public void viewFile(@PathVariable Long fileId, HttpServletResponse response) throws IOException {
        try {
            File file = fileService.getFileById(fileId);
            
            // For now we only support PDF viewing
            if (file.getFileType() == null || !file.getFileType().equals("application/pdf")) {
                response.sendError(HttpStatus.BAD_REQUEST.value(), "Only PDF files can be viewed");
                return;
            }
            
            Path filePath = Paths.get(file.getFilePath());
            java.io.File fileObject = filePath.toFile();
            
            if (!fileObject.exists()) {
                response.sendError(HttpStatus.NOT_FOUND.value(), "File not found");
                return;
            }
            
            // Set headers for in-browser viewing (iframe-friendly)
            response.setHeader("Content-Type", "application/pdf");
            response.setHeader("Content-Disposition", "inline; filename=\"" + file.getOriginalFileName() + "\"");
            response.setHeader("Cache-Control", "public, max-age=86400");
            
            // CORS headers for iframe viewing
            response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
            response.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
            response.setHeader("Access-Control-Allow-Headers", "*");
            response.setHeader("Access-Control-Allow-Credentials", "true");
            response.setHeader("Access-Control-Expose-Headers", "Content-Disposition, Content-Type, Content-Length");
            response.setHeader("X-Frame-Options", "SAMEORIGIN");
            
            // Content length
            response.setContentLengthLong(fileObject.length());
            
            // Stream the file directly
            try (InputStream inputStream = new FileInputStream(fileObject)) {
                StreamUtils.copy(inputStream, response.getOutputStream());
                response.getOutputStream().flush();
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Error viewing file: " + e.getMessage());
        }
    }

    @GetMapping("/pdf/{fileId}")
    public ResponseEntity<Resource> viewPdf(@PathVariable Long fileId) throws IOException {
        File file = fileService.getFileById(fileId);
        
        // Check if it's a PDF
        if (file.getFileType() == null || !file.getFileType().equals("application/pdf")) {
            return ResponseEntity.badRequest().build();
        }
        
        Path filePath = Paths.get(file.getFilePath());
        Resource resource = new UrlResource(filePath.toUri());
        
        if (!resource.exists()) {
            throw new IOException("PDF file not found: " + file.getOriginalFileName());
        }
        
        // Create headers with CORS settings specifically for PDF viewing
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getOriginalFileName() + "\"");
        headers.add(HttpHeaders.CACHE_CONTROL, "max-age=3600");
        headers.add(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "*");
        headers.add(HttpHeaders.ACCESS_CONTROL_ALLOW_METHODS, "GET, OPTIONS");
        headers.add(HttpHeaders.ACCESS_CONTROL_ALLOW_HEADERS, "*");
        headers.add(HttpHeaders.ACCESS_CONTROL_MAX_AGE, "3600");
        
        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(resource);
    }

    @DeleteMapping("/{fileId}")
    public ResponseEntity<Void> deleteFile(@PathVariable Long fileId) throws IOException {
        fileService.deleteFile(fileId);
        return ResponseEntity.ok().build();
    }
} 