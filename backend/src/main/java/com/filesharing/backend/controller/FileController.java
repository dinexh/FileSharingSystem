package com.filesharing.backend.controller;

import com.filesharing.backend.model.File;
import com.filesharing.backend.service.FileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "http://localhost:3000")
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

    @DeleteMapping("/{fileId}")
    public ResponseEntity<Void> deleteFile(@PathVariable Long fileId) throws IOException {
        fileService.deleteFile(fileId);
        return ResponseEntity.ok().build();
    }
} 