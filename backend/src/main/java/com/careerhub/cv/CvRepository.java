package com.careerhub.cv;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CvRepository extends JpaRepository<CvDocument, Long> {
    List<CvDocument> findByUserId(Long userId);
}
