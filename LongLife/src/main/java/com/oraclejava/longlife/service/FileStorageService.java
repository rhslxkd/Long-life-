package com.oraclejava.longlife.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.UUID;

@Service
public class FileStorageService {
    private final Path root;
    public FileStorageService(
            @Value("${file.upload-dir}") String uploadDir
    ) throws IOException {
        this.root = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(root);
    }

    public StoredFile storePoster(MultipartFile file) throws IOException {
        //파일이 없거나 파일 크기가 0이면 예외처리
        if (file == null || file.isEmpty())
            throw new IllegalArgumentException("File is null or empty");
        String mime = file.getContentType();
        if (mime == null || !mime.startsWith("image/")) {
            throw new IllegalArgumentException("File is not an image");
        }
        //파일크기 체크(10MB)
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new IllegalArgumentException("File is too large");
        }

        String originalFilename = file.getOriginalFilename();
        String ext = originalFilename.substring(
                originalFilename.lastIndexOf("."));
        String ymd = LocalDate.now().toString(); // yyyy-MM-dd
        Path dir = root.resolve(ymd);
        Files.createDirectories(dir);

        String stored = UUID.randomUUID().toString()
                .replace("-", "") + ext;
        Path target = dir.resolve(stored);
        Files.copy(file.getInputStream(), target);

        String publicUrl = "uploads/" + ymd + "/" + stored;

        return new StoredFile(stored, publicUrl, file.getSize(), mime, ymd);
    }

    public record StoredFile(String filename, String url,
                             long size, String mime, String subdir) {}

}
