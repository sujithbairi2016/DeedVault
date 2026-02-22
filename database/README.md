# DeedVault PostgreSQL Database Setup

## Prerequisites
- PostgreSQL 12+ installed
- PostgreSQL running on localhost:5432
- pgAdmin or psql command line tool

## Quick Setup

### Option 1: Using psql Command Line

```bash
# Navigate to database folder
cd f:\DeedVaultMobile\database

# Connect to PostgreSQL
psql -U postgres -h localhost -p 5432

# Run master setup script
\i 00_master_setup.sql
```

### Option 2: Manual Step-by-Step

**Step 1: Create Database**
```bash
psql -U postgres -h localhost -p 5432 -f 01_create_database.sql
```

**Step 2: Create Schema**
```bash
psql -U postgres -h localhost -p 5432 -d deedvault -f 02_create_schema.sql
```

**Step 3: Create Tables**
```bash
psql -U postgres -h localhost -p 5432 -d deedvault -f 03_create_tables.sql
```

**Step 4: Create Stored Procedures**
```bash
psql -U postgres -h localhost -p 5432 -d deedvault -f 04_create_procedures.sql
```

**Step 5: Insert Seed Data**
```bash
psql -U postgres -h localhost -p 5432 -d deedvault -f 05_seed_data.sql
```

### Option 3: Using pgAdmin

1. Open pgAdmin
2. Connect to PostgreSQL server
3. Right-click on "Databases" → "Create" → "Database"
4. Name: `deedvault`
5. Open Query Tool
6. Open and execute each SQL file in order:
   - 02_create_schema.sql
   - 03_create_tables.sql
   - 04_create_procedures.sql
   - 05_seed_data.sql

## Database Structure

### Schema: `deedvault_schema`

### Tables:
1. **themes** - Application theme configurations
2. **users** - User accounts
3. **user_photos** - User profile photos (base64)
4. **services** - Available services
5. **marquees** - Homepage announcements
6. **request_status** - Status lookup table
7. **service_requests** - User service requests
8. **request_history** - Request comments/history

## Stored Procedures

### Themes
- `sp_get_all_themes()` - Get all themes
- `sp_get_theme_by_id(theme_id)` - Get specific theme

### Users
- `sp_create_user(...)` - Create new user
- `sp_get_user_by_email(email)` - Get user by email
- `sp_update_user(...)` - Update user profile

### User Photos
- `sp_upload_user_photo(user_id, photo_data, file_name)` - Upload/update photo
- `sp_get_user_photo(user_id)` - Get user photo

### Services
- `sp_get_all_services()` - Get all active services
- `sp_get_service_by_id(service_id)` - Get specific service

### Marquees
- `sp_get_all_marquees()` - Get all active marquees

### Service Requests
- `sp_create_service_request(...)` - Create new request
- `sp_get_requests_by_user(user_id)` - Get user's requests
- `sp_get_requests_by_service(service_id)` - Get requests for service
- `sp_update_service_request(...)` - Update request
- `sp_delete_service_request(request_id)` - Soft delete request

### Request History
- `sp_add_request_history(request_id, comment, commented_by)` - Add comment
- `sp_get_request_history(request_id)` - Get request history

## Connection Details

```
Host: localhost
Port: 5432
Database: deedvault
Schema: deedvault_schema
Username: postgres
Password: [your postgres password]
```

## Testing the Setup

```sql
-- Connect to database
\c deedvault

-- Set search path
SET search_path TO deedvault_schema, public;

-- Test queries
SELECT * FROM sp_get_all_themes();
SELECT * FROM sp_get_all_services();
SELECT * FROM sp_get_all_marquees();
SELECT * FROM sp_get_user_by_email('bairi.sujith@gmail.com');
```

## Next Steps

After database setup, update your Node.js application:
1. Install PostgreSQL driver: `npm install pg`
2. Create database connection configuration
3. Update API endpoints to use stored procedures
4. Test CRUD operations

## Troubleshooting

**Error: Database already exists**
```sql
DROP DATABASE IF EXISTS deedvault;
```

**Error: Permission denied**
- Ensure you're running as postgres user
- Check PostgreSQL service is running

**Error: Cannot connect**
- Verify PostgreSQL is running on port 5432
- Check pg_hba.conf for connection permissions
