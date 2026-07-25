package com.careerhub.interview;

import com.careerhub.interview.dto.InterviewRequest;
import com.careerhub.interview.dto.InterviewResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class InterviewController {

    private final InterviewService service;

    public InterviewController(InterviewService service) {
        this.service = service;
    }

//    Nested under the application because every interview belongs to an application.

    @GetMapping("/api/applications/{applicationId}/interviews")
    public List<InterviewResponse> findByApplication(@PathVariable Long applicationId) {
        return service.findByApplication(applicationId);
    }

    @PostMapping("/api/applications/{applicationId}/interviews")
    public ResponseEntity<InterviewResponse> create(@PathVariable Long applicationId,
                                                    @Valid @RequestBody InterviewRequest request) {
        return ResponseEntity.ok(service.create(applicationId, request));
    }

    // Update and delete do not require the applicationId in the URL, as the interview ID alone is sufficient.    @PutMapping("/api/interviews/{id}")
    public ResponseEntity<InterviewResponse> update(@PathVariable Long id, @Valid @RequestBody InterviewRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/api/interviews/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}