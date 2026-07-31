package com.careerhub.cv;

import com.careerhub.cv.dto.CvResponse;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/cv")
public class CvController {

    private final CvService cvService;

    public CvController(CvService cvService) {
        this.cvService = cvService;
    }

    @GetMapping
    public List<CvResponse> findAll() {
        return cvService.findAllForCurrentUser();
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CvResponse> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "label", required = false) String label
    ) {
        return ResponseEntity.ok(cvService.upload(file, label));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> download(@PathVariable Long id) {
        Resource file = cvService.loadFile(id);
        String fileName = cvService.fileNameOf(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .body(file);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        cvService.delete(id);
        return ResponseEntity.noContent().build();
    }
}