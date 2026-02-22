-- =============================================
-- DeedVault Seed Data Script
-- =============================================

SET search_path TO deedvault_schema, public;

-- =============================================
-- Insert Themes
-- =============================================
INSERT INTO themes (theme_name, primary_color, secondary_color, accent_color, background_color, text_color, header_gradient_start, header_gradient_end) VALUES
('Ocean Blue', '#1e3c72', '#2a5298', '#667eea', '#f3f4f8', '#333333', '#1e3c72', '#2a5298'),
('Forest Green', '#0f5132', '#198754', '#20c997', '#f1f8f4', '#212529', '#0f5132', '#198754'),
('Sunset Orange', '#d63384', '#fd7e14', '#ffc107', '#fff5f0', '#2c2c2c', '#d63384', '#fd7e14'),
('Royal Purple', '#6f42c1', '#8b5cf6', '#a78bfa', '#f8f7fc', '#1f1f1f', '#6f42c1', '#8b5cf6'),
('Midnight Dark', '#1a1a2e', '#16213e', '#0f3460', '#e8e8e8', '#0a0a0a', '#1a1a2e', '#16213e');

-- =============================================
-- Insert Services
-- =============================================
INSERT INTO services (title, description, icon, price_range, min_price, max_price) VALUES
('Raise Property Document Verification', 'Get your property documents verified by legal experts instantly', '✓', '₹1,000 - ₹2,500', 1000, 2500),
('Property Documents Services', 'Comprehensive document preparation and management services', '📄', '₹500 - ₹1,500', 500, 1500),
('Newspaper Notices', 'Publish and manage legal notices in leading newspapers', '📰', '₹2,500 - ₹10,000', 2500, 10000),
('Legal Opinion', 'Expert legal opinions from certified professionals', '⚖️', '₹1,000 - ₹5,000', 1000, 5000),
('Properties for Sale', 'Browse verified properties available for purchase', '🏠', '0.5% - 10% (sale value)', 0.5, 10),
('Title Insurance', 'Protect your property investment with comprehensive title insurance', '🛡️', '₹1,000 - ₹5,000', 1000, 5000);

-- =============================================
-- Insert Marquees
-- =============================================
INSERT INTO marquees (marquee_title, marquee_description, marquee_reference_links, display_order) VALUES
('Welcome to DeedVault', 
 'Your trusted property services partner providing quick transactions, verified documents, and legal certainty for all your property needs.',
 ARRAY['Fast-track property document verification', 'Expert legal opinions from certified professionals', 'Comprehensive document preparation services'],
 1),
('New Feature Launch',
 'Fast-track property document verification is now available! Get your documents verified by legal experts in just 2-3 business days.',
 ARRAY['Upload scanned copies of title documents', 'Provide ID proof for verification', 'Receive expert legal validation'],
 2),
('Property Market Updates',
 'Stay informed with the latest property market trends, legal updates, and real estate news in our comprehensive News section.',
 ARRAY['Market analysis and trends', 'Legal compliance updates', 'Investment opportunities'],
 3),
('Monthly Success Milestone',
 'We are proud to announce that over 1000+ successful transactions have been completed this month, helping families secure their property dreams.',
 ARRAY['Property document verification services', 'Legal opinion consultations', 'Document preparation and management'],
 4);

-- =============================================
-- Insert Request Status
-- =============================================
INSERT INTO request_status (status_name, status_description) VALUES
('Submitted', 'Request has been submitted'),
('In Progress', 'Request is being processed'),
('Under Review', 'Request is under review'),
('Completed', 'Request has been completed'),
('Cancelled', 'Request has been cancelled'),
('On Hold', 'Request is on hold');

-- =============================================
-- Insert Sample Users (for testing)
-- =============================================
INSERT INTO users (user_id, first_name, last_name, middle_name, email, password, dob, gender, phone_number, address, theme_id) VALUES
(1770830993903, 'Sujith', 'Bairi', 'Mr', 'bairi.sujith@gmail.com', '123456', '1981-12-09', 'Male', '7702778554', 'Kondapur Sheshadri Marg', 2),
(1770914120318, 'Akshaj', 'Bairi', '', 'bairi.akshaj@gmail.com', '654321', '2011-09-10', 'Male', '8522819178', '4-1332, Kondapur, Hyderabad', 4),
(1771080887919, 'Sridhar', 'Barenkala', '', 'sridhar.barenkala@gmail.com', '456789', '1971-05-06', 'Male', '9885012390', 'Bandlaguda Jagir', 3);

-- =============================================
-- Insert Sample Service Requests
-- =============================================
INSERT INTO service_requests (request_id, service_id, user_id, subject, details, cost, status_id, created_by, modified_by) VALUES
(1770915861611, 1, 1770830993903, 'Requesting for property at kondapur', 'I am planning to buy a property at kondapur in OU Prof colony', 800, 5, 'Sujith Bairi', 'Akshaj Bairi'),
(1770915901815, 1, 1770830993903, 'Request for Agrictulture land deal', 'I am Sujith Bairi to buy a agri land', 940, 1, 'Sujith Bairi', 'Sujith Bairi');

-- =============================================
-- Insert Sample Request History
-- =============================================
INSERT INTO request_history (request_id, comment, commented_by, commented_at) VALUES
(1770915861611, 'Please share more details, will work on it', 'Sujith Bairi', '2026-02-12 17:06:04'),
(1770915861611, 'Where is the property exactly located. please share the gmap location', 'Sujith Bairi', '2026-02-12 17:08:41'),
(1770915861611, 'Where is the property exactly located. please share the gmap location', 'Anonymous', '2026-02-13 12:07:00'),
(1770915861611, 'Where is the property exactly located. please share the gmap location', 'Akshaj Bairi', '2026-02-13 16:51:07');
