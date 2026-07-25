package com.careerhub.cv;

import com.careerhub.application.JobApplication;
import com.careerhub.application.JobApplicationRepository;
import com.careerhub.cv.dto.CvResponse;
import com.careerhub.user.User;
import com.careerhub.user.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class CvService {

    // Requirement 5, exceptional flow E1: only these file types are accepted.
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("pdf", "docx");

    private final CvRepository cvRepository;
    private final JobApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final Path storageDir;

    public CvService(CvRepository cvRepository,
                     JobApplicationRepository applicationRepository,
                     UserRepository userRepository,
                     @Value("${app.cv.storage-dir}") String storageDir) {
        this.cvRepository = cvRepository;
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.storageDir = Paths.get(storageDir).toAbsolutePath().normalize();
        createStorageDirIfMissing();
    }

    public List<CvResponse> findAllForCurrentUser() {
        return cvRepository.findByUserId(currentUser().getId()).stream().map(this::toResponse).toList();
    }

    public CvResponse upload(MultipartFile file, String label, Long applicationId) {
        String originalName = file.getOriginalFilename();
        String extension = extensionOf(originalName);

        // E1: unsupported file type
        if (!ALLOWED_EXTENSIONS.contains(extension.toLowerCase())) {
            throw new IllegalArgumentException("Only PDF or DOCX files are allowed");
        }
        // Note: max size is also enforced by spring.servlet.multipart.max-file-size in application.yml.
        if (file.isEmpty()) {
            throw new IllegalArgumentException("The uploaded file is empty");
        }

        User user = currentUser();
        JobApplication application = null;
        if (applicationId != null) {
            application = applicationRepository.findById(applicationId)
                    .filter(a -> a.getUser().getId().equals(user.getId()))
                    .orElseThrow(() -> new IllegalArgumentException("Application not found"));
        }

        String storedFileName = UUID.randomUUID() + "." + extension;
        Path destination = storageDir.resolve(storedFileName);

        try {
            file.transferTo(destination);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store CV file", e);
        }

        CvDocument cv = new CvDocument();
        cv.setUser(user);
        cv.setApplication(application);
        cv.setFileName(originalName);
        cv.setFilePath(destination.toString());
        cv.setLabel(label);
        cvRepository.save(cv);

        return toResponse(cv);
    }

    public Resource loadFile(Long id) {
        CvDocument cv = ownedCvOrThrow(id);
        try {
            Path path = Paths.get(cv.getFilePath());
            return new UrlResource(path.toUri());
        } catch (MalformedURLException e) {
            throw new RuntimeException("Could not read CV file", e);
        }
    }

    public String fileNameOf(Long id) {
        return ownedCvOrThrow(id).getFileName();
    }

    public void delete(Long id) {
        CvDocument cv = ownedCvOrThrow(id);
        try {
            Files.deleteIfExists(Paths.get(cv.getFilePath()));
        } catch (IOException ignored) {
            // File already gone from disk; still remove the DB record below.
        }
        cvRepository.delete(cv);
    }

    private CvDocument ownedCvOrThrow(Long id) {
        CvDocument cv = cvRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("CV not found"));
        if (!cv.getUser().getId().equals(currentUser().getId())) {
            throw new IllegalArgumentException("CV not found");
        }
        return cv;
    }

    private void createStorageDirIfMissing() {
        try {
            Files.createDirectories(storageDir);
        } catch (IOException e) {
            throw new RuntimeException("Could not create CV storage directory", e);
        }
    }

    private String extensionOf(String fileName) {
        if (fileName == null || !fileName.contains(".")) return "";
        return fileName.substring(fileName.lastIndexOf('.') + 1);
    }

    private User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow();
    }

    private CvResponse toResponse(CvDocument cv) {
        return new CvResponse(
                cv.getId(), cv.getFileName(), cv.getLabel(),
                cv.getApplication() != null ? cv.getApplication().getId() : null,
                cv.getUploadedAt()
        );
    }
}