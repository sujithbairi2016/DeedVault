-- =============================================
-- DeedVault Schema Creation Script
-- Connect to deedvault database before running
-- =============================================

-- Create Schema
CREATE SCHEMA IF NOT EXISTS deedvault_schema AUTHORIZATION postgres;

COMMENT ON SCHEMA deedvault_schema IS 'Main schema for DeedVault application';

-- Set search path
SET search_path TO deedvault_schema, public;
