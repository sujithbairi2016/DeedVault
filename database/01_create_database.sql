-- =============================================
-- DeedVault Database Creation Script
-- =============================================

-- Create Database
CREATE DATABASE deedvault
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    TEMPLATE = template0
    CONNECTION LIMIT = -1;

COMMENT ON DATABASE deedvault IS 'DeedVault Property Services Platform Database';
