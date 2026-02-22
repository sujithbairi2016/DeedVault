-- =============================================
-- DeedVault Master Setup Script
-- Execute this script to set up the entire database
-- =============================================

-- STEP 1: Create Database (Run this first in postgres database)
-- \i 'f:/DeedVaultMobile/database/01_create_database.sql'

-- STEP 2: Connect to deedvault database
\c deedvault

-- STEP 3: Create Schema
\i 'f:/DeedVaultMobile/database/02_create_schema.sql'

-- STEP 4: Create Tables
\i 'f:/DeedVaultMobile/database/03_create_tables.sql'

-- STEP 5: Create Stored Procedures
\i 'f:/DeedVaultMobile/database/04_create_procedures.sql'

-- STEP 6: Insert Seed Data
\i 'f:/DeedVaultMobile/database/05_seed_data.sql'

-- Verify Installation
SELECT 'Database setup completed successfully!' as status;
SELECT 'Total themes: ' || COUNT(*) FROM deedvault_schema.themes;
SELECT 'Total services: ' || COUNT(*) FROM deedvault_schema.services;
SELECT 'Total users: ' || COUNT(*) FROM deedvault_schema.users;
SELECT 'Total marquees: ' || COUNT(*) FROM deedvault_schema.marquees;
