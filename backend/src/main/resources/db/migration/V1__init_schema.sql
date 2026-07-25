-- Requirement 1 & 2: Users (registration/login)
CREATE TABLE users (
    id            BIGSERIAL PRIMARY KEY,
    full_name     VARCHAR(150)  NOT NULL,
    email         VARCHAR(255)  NOT NULL UNIQUE,
    password_hash VARCHAR(255)  NOT NULL,
    created_at    TIMESTAMP     NOT NULL DEFAULT now()
);

-- Requirement 3: Job applications
CREATE TABLE applications (
    id               BIGSERIAL PRIMARY KEY,
    user_id          BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_name     VARCHAR(150) NOT NULL,
    job_title        VARCHAR(150) NOT NULL,
    application_date DATE         NOT NULL,
    status           VARCHAR(30)  NOT NULL DEFAULT 'APPLIED',
    job_url          VARCHAR(500),
    notes            TEXT,
    created_at       TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at       TIMESTAMP    NOT NULL DEFAULT now()
);

CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status  ON applications(status);

-- Requirement 4: Interviews (linked to an application)
CREATE TABLE interviews (
    id             BIGSERIAL PRIMARY KEY,
    application_id BIGINT       NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    interview_date TIMESTAMP    NOT NULL,
    type           VARCHAR(20)  NOT NULL, -- PHONE, VIDEO, ONSITE
    stage          VARCHAR(100),
    notes          TEXT,
    created_at     TIMESTAMP    NOT NULL DEFAULT now()
);

CREATE INDEX idx_interviews_application_id ON interviews(application_id);

-- Requirement 5: CV versions (linked to a user, optionally to one application)
CREATE TABLE cv_documents (
    id             BIGSERIAL PRIMARY KEY,
    user_id        BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    application_id BIGINT       REFERENCES applications(id) ON DELETE SET NULL,
    file_name      VARCHAR(255) NOT NULL,
    file_path      VARCHAR(500) NOT NULL,
    label          VARCHAR(150),
    uploaded_at    TIMESTAMP    NOT NULL DEFAULT now()
);

CREATE INDEX idx_cv_documents_user_id ON cv_documents(user_id);
