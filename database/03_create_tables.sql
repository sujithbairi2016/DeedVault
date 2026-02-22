-- =============================================
-- DeedVault Tables Creation Script
-- =============================================

SET search_path TO deedvault_schema, public;

-- =============================================
-- Table: themes
-- =============================================
CREATE TABLE themes (
    theme_id SERIAL PRIMARY KEY,
    theme_name VARCHAR(100) NOT NULL UNIQUE,
    primary_color VARCHAR(7) NOT NULL,
    secondary_color VARCHAR(7) NOT NULL,
    accent_color VARCHAR(7) NOT NULL,
    background_color VARCHAR(7) NOT NULL,
    text_color VARCHAR(7) NOT NULL,
    header_gradient_start VARCHAR(7) NOT NULL,
    header_gradient_end VARCHAR(7) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE themes IS 'Application theme configurations';

-- =============================================
-- Table: users
-- =============================================
CREATE TABLE users (
    user_id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    dob DATE,
    gender VARCHAR(20),
    phone_number VARCHAR(20) NOT NULL,
    address TEXT,
    theme_id INTEGER REFERENCES themes(theme_id) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE users IS 'User account information';

-- =============================================
-- Table: user_photos
-- =============================================
CREATE TABLE user_photos (
    photo_id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    photo_data TEXT NOT NULL,
    file_name VARCHAR(255),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

COMMENT ON TABLE user_photos IS 'User profile photos stored as base64';

-- =============================================
-- Table: services
-- =============================================
CREATE TABLE services (
    service_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(10),
    price_range VARCHAR(100),
    min_price DECIMAL(10,2),
    max_price DECIMAL(10,2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE services IS 'Available services in the platform';

-- =============================================
-- Table: marquees
-- =============================================
CREATE TABLE marquees (
    marquee_id SERIAL PRIMARY KEY,
    marquee_title VARCHAR(255) NOT NULL,
    marquee_description TEXT,
    marquee_reference_links TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE marquees IS 'Marquee announcements displayed on homepage';

-- =============================================
-- Table: request_status
-- =============================================
CREATE TABLE request_status (
    status_id SERIAL PRIMARY KEY,
    status_name VARCHAR(50) NOT NULL UNIQUE,
    status_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE request_status IS 'Status lookup for service requests';

-- =============================================
-- Table: service_requests
-- =============================================
CREATE TABLE service_requests (
    request_id BIGSERIAL PRIMARY KEY,
    service_id INTEGER NOT NULL REFERENCES services(service_id),
    user_id BIGINT NOT NULL REFERENCES users(user_id),
    subject VARCHAR(500) NOT NULL,
    details TEXT,
    cost DECIMAL(10,2),
    status_id INTEGER NOT NULL REFERENCES request_status(status_id) DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_by VARCHAR(255),
    modified_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE service_requests IS 'Service requests submitted by users';

-- =============================================
-- Table: request_history
-- =============================================
CREATE TABLE request_history (
    history_id BIGSERIAL PRIMARY KEY,
    request_id BIGINT NOT NULL REFERENCES service_requests(request_id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    commented_by VARCHAR(255) NOT NULL,
    commented_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE request_history IS 'History/comments for service requests';

-- =============================================
-- Create Indexes
-- =============================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_theme ON users(theme_id);
CREATE INDEX idx_service_requests_user ON service_requests(user_id);
CREATE INDEX idx_service_requests_service ON service_requests(service_id);
CREATE INDEX idx_service_requests_status ON service_requests(status_id);
CREATE INDEX idx_request_history_request ON request_history(request_id);
