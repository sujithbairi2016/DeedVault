-- =============================================
-- DeedVault Stored Procedures - CRUD Operations
-- =============================================

SET search_path TO deedvault_schema, public;

-- =============================================
-- THEMES PROCEDURES
-- =============================================

-- Get all themes
CREATE OR REPLACE FUNCTION sp_get_all_themes()
RETURNS TABLE (
    theme_id INTEGER,
    theme_name VARCHAR,
    primary_color VARCHAR,
    secondary_color VARCHAR,
    accent_color VARCHAR,
    background_color VARCHAR,
    text_color VARCHAR,
    header_gradient_start VARCHAR,
    header_gradient_end VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT t.theme_id, t.theme_name, t.primary_color, t.secondary_color, 
           t.accent_color, t.background_color, t.text_color, 
           t.header_gradient_start, t.header_gradient_end
    FROM themes t
    ORDER BY t.theme_id;
END;
$$ LANGUAGE plpgsql;

-- Get theme by ID
CREATE OR REPLACE FUNCTION sp_get_theme_by_id(p_theme_id INTEGER)
RETURNS TABLE (
    theme_id INTEGER,
    theme_name VARCHAR,
    primary_color VARCHAR,
    secondary_color VARCHAR,
    accent_color VARCHAR,
    background_color VARCHAR,
    text_color VARCHAR,
    header_gradient_start VARCHAR,
    header_gradient_end VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT t.theme_id, t.theme_name, t.primary_color, t.secondary_color, 
           t.accent_color, t.background_color, t.text_color, 
           t.header_gradient_start, t.header_gradient_end
    FROM themes t
    WHERE t.theme_id = p_theme_id;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- USERS PROCEDURES
-- =============================================

-- Create user
CREATE OR REPLACE FUNCTION sp_create_user(
    p_first_name VARCHAR,
    p_last_name VARCHAR,
    p_middle_name VARCHAR,
    p_email VARCHAR,
    p_password VARCHAR,
    p_dob DATE,
    p_gender VARCHAR,
    p_phone_number VARCHAR,
    p_address TEXT,
    p_theme_id INTEGER DEFAULT 1
)
RETURNS BIGINT AS $$
DECLARE
    v_user_id BIGINT;
BEGIN
    INSERT INTO users (first_name, last_name, middle_name, email, password, dob, gender, phone_number, address, theme_id)
    VALUES (p_first_name, p_last_name, p_middle_name, p_email, p_password, p_dob, p_gender, p_phone_number, p_address, p_theme_id)
    RETURNING user_id INTO v_user_id;
    
    RETURN v_user_id;
END;
$$ LANGUAGE plpgsql;

-- Get user by email
CREATE OR REPLACE FUNCTION sp_get_user_by_email(p_email VARCHAR)
RETURNS TABLE (
    user_id BIGINT,
    first_name VARCHAR,
    last_name VARCHAR,
    middle_name VARCHAR,
    email VARCHAR,
    password VARCHAR,
    dob DATE,
    gender VARCHAR,
    phone_number VARCHAR,
    address TEXT,
    theme_id INTEGER,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT u.user_id, u.first_name, u.last_name, u.middle_name, u.email, u.password,
           u.dob, u.gender, u.phone_number, u.address, u.theme_id, u.created_at, u.updated_at
    FROM users u
    WHERE u.email = p_email;
END;
$$ LANGUAGE plpgsql;

-- Update user
CREATE OR REPLACE FUNCTION sp_update_user(
    p_email VARCHAR,
    p_first_name VARCHAR,
    p_last_name VARCHAR,
    p_middle_name VARCHAR,
    p_dob DATE,
    p_gender VARCHAR,
    p_phone_number VARCHAR,
    p_address TEXT,
    p_theme_id INTEGER
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE users
    SET first_name = p_first_name,
        last_name = p_last_name,
        middle_name = p_middle_name,
        dob = p_dob,
        gender = p_gender,
        phone_number = p_phone_number,
        address = p_address,
        theme_id = p_theme_id,
        updated_at = CURRENT_TIMESTAMP
    WHERE email = p_email;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- USER PHOTOS PROCEDURES
-- =============================================

-- Upload user photo
CREATE OR REPLACE FUNCTION sp_upload_user_photo(
    p_user_id BIGINT,
    p_photo_data TEXT,
    p_file_name VARCHAR
)
RETURNS INTEGER AS $$
DECLARE
    v_photo_id INTEGER;
BEGIN
    INSERT INTO user_photos (user_id, photo_data, file_name)
    VALUES (p_user_id, p_photo_data, p_file_name)
    ON CONFLICT (user_id) 
    DO UPDATE SET photo_data = p_photo_data, file_name = p_file_name, uploaded_at = CURRENT_TIMESTAMP
    RETURNING photo_id INTO v_photo_id;
    
    RETURN v_photo_id;
END;
$$ LANGUAGE plpgsql;

-- Get user photo
CREATE OR REPLACE FUNCTION sp_get_user_photo(p_user_id BIGINT)
RETURNS TABLE (
    photo_id INTEGER,
    photo_data TEXT,
    file_name VARCHAR,
    uploaded_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT up.photo_id, up.photo_data, up.file_name, up.uploaded_at
    FROM user_photos up
    WHERE up.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- SERVICES PROCEDURES
-- =============================================

-- Get all services
CREATE OR REPLACE FUNCTION sp_get_all_services()
RETURNS TABLE (
    service_id INTEGER,
    title VARCHAR,
    description TEXT,
    icon VARCHAR,
    price_range VARCHAR,
    min_price DECIMAL,
    max_price DECIMAL,
    is_active BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT s.service_id, s.title, s.description, s.icon, s.price_range, 
           s.min_price, s.max_price, s.is_active
    FROM services s
    WHERE s.is_active = TRUE
    ORDER BY s.service_id;
END;
$$ LANGUAGE plpgsql;

-- Get service by ID
CREATE OR REPLACE FUNCTION sp_get_service_by_id(p_service_id INTEGER)
RETURNS TABLE (
    service_id INTEGER,
    title VARCHAR,
    description TEXT,
    icon VARCHAR,
    price_range VARCHAR,
    min_price DECIMAL,
    max_price DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT s.service_id, s.title, s.description, s.icon, s.price_range, 
           s.min_price, s.max_price
    FROM services s
    WHERE s.service_id = p_service_id;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- MARQUEES PROCEDURES
-- =============================================

-- Get all active marquees
CREATE OR REPLACE FUNCTION sp_get_all_marquees()
RETURNS TABLE (
    marquee_id INTEGER,
    marquee_title VARCHAR,
    marquee_description TEXT,
    marquee_reference_links TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT m.marquee_id, m.marquee_title, m.marquee_description, m.marquee_reference_links
    FROM marquees m
    WHERE m.is_active = TRUE
    ORDER BY m.display_order, m.marquee_id;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- SERVICE REQUESTS PROCEDURES
-- =============================================

-- Create service request
CREATE OR REPLACE FUNCTION sp_create_service_request(
    p_service_id INTEGER,
    p_user_id BIGINT,
    p_subject VARCHAR,
    p_details TEXT,
    p_cost DECIMAL,
    p_created_by VARCHAR
)
RETURNS BIGINT AS $$
DECLARE
    v_request_id BIGINT;
BEGIN
    INSERT INTO service_requests (service_id, user_id, subject, details, cost, created_by, modified_by)
    VALUES (p_service_id, p_user_id, p_subject, p_details, p_cost, p_created_by, p_created_by)
    RETURNING request_id INTO v_request_id;
    
    RETURN v_request_id;
END;
$$ LANGUAGE plpgsql;

-- Get service requests by user
CREATE OR REPLACE FUNCTION sp_get_requests_by_user(p_user_id BIGINT)
RETURNS TABLE (
    request_id BIGINT,
    service_id INTEGER,
    service_name VARCHAR,
    subject VARCHAR,
    details TEXT,
    cost DECIMAL,
    status_id INTEGER,
    status_name VARCHAR,
    is_active BOOLEAN,
    created_by VARCHAR,
    modified_by VARCHAR,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT sr.request_id, sr.service_id, s.title, sr.subject, sr.details, sr.cost,
           sr.status_id, rs.status_name, sr.is_active, sr.created_by, sr.modified_by,
           sr.created_at, sr.updated_at
    FROM service_requests sr
    JOIN services s ON sr.service_id = s.service_id
    JOIN request_status rs ON sr.status_id = rs.status_id
    WHERE sr.user_id = p_user_id
    ORDER BY sr.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Get service requests by service
CREATE OR REPLACE FUNCTION sp_get_requests_by_service(p_service_id INTEGER)
RETURNS TABLE (
    request_id BIGINT,
    user_id BIGINT,
    requester_name VARCHAR,
    subject VARCHAR,
    details TEXT,
    cost DECIMAL,
    status_id INTEGER,
    status_name VARCHAR,
    is_active BOOLEAN,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT sr.request_id, sr.user_id, 
           CONCAT(u.first_name, ' ', u.last_name) as requester_name,
           sr.subject, sr.details, sr.cost,
           sr.status_id, rs.status_name, sr.is_active,
           sr.created_at, sr.updated_at
    FROM service_requests sr
    JOIN users u ON sr.user_id = u.user_id
    JOIN request_status rs ON sr.status_id = rs.status_id
    WHERE sr.service_id = p_service_id
    ORDER BY sr.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Update service request
CREATE OR REPLACE FUNCTION sp_update_service_request(
    p_request_id BIGINT,
    p_subject VARCHAR,
    p_details TEXT,
    p_cost DECIMAL,
    p_status_id INTEGER,
    p_modified_by VARCHAR
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE service_requests
    SET subject = p_subject,
        details = p_details,
        cost = p_cost,
        status_id = p_status_id,
        modified_by = p_modified_by,
        updated_at = CURRENT_TIMESTAMP
    WHERE request_id = p_request_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Delete service request (soft delete)
CREATE OR REPLACE FUNCTION sp_delete_service_request(p_request_id BIGINT)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE service_requests
    SET is_active = FALSE,
        updated_at = CURRENT_TIMESTAMP
    WHERE request_id = p_request_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- REQUEST HISTORY PROCEDURES
-- =============================================

-- Add request history comment
CREATE OR REPLACE FUNCTION sp_add_request_history(
    p_request_id BIGINT,
    p_comment TEXT,
    p_commented_by VARCHAR
)
RETURNS BIGINT AS $$
DECLARE
    v_history_id BIGINT;
BEGIN
    INSERT INTO request_history (request_id, comment, commented_by)
    VALUES (p_request_id, p_comment, p_commented_by)
    RETURNING history_id INTO v_history_id;
    
    RETURN v_history_id;
END;
$$ LANGUAGE plpgsql;

-- Get request history
CREATE OR REPLACE FUNCTION sp_get_request_history(p_request_id BIGINT)
RETURNS TABLE (
    history_id BIGINT,
    comment TEXT,
    commented_by VARCHAR,
    commented_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT rh.history_id, rh.comment, rh.commented_by, rh.commented_at
    FROM request_history rh
    WHERE rh.request_id = p_request_id
    ORDER BY rh.commented_at ASC;
END;
$$ LANGUAGE plpgsql;
