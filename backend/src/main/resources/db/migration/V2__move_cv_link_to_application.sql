-- A CV should be reusable across many applications, not tied to a single one.
-- Move the link from cv_documents.application_id to applications.cv_id.
ALTER TABLE applications ADD COLUMN cv_id BIGINT REFERENCES cv_documents(id) ON DELETE SET NULL;

UPDATE applications a
SET cv_id = c.id
FROM cv_documents c
WHERE c.application_id = a.id;

ALTER TABLE cv_documents DROP COLUMN application_id;

CREATE INDEX idx_applications_cv_id ON applications(cv_id);
