# Testing Guide - New Features

## How to Test the New Features

### 1. User Name Display in Marquee
**Steps:**
1. Login to the application
2. Look at the marquee bar at the top
3. You should see your profile picture with your name displayed next to it on the right side

**Expected Result:** User's full name (First Name + Last Name) appears next to profile picture

---

### 2. Clickable Marquee with Dialog
**Steps:**
1. Click anywhere on the scrolling marquee text
2. A dialog popup should appear with:
   - Marquee title
   - Detailed description
   - Reference links as bullet points
3. Try closing the dialog by:
   - Clicking the "X" button in top-right corner
   - Pressing ESC key on keyboard
   - Clicking outside the dialog (on grey background)

**Expected Result:** Dialog opens and closes properly with all three methods

---

### 3. Logout Functionality
**Steps:**
1. Click the hamburger menu (☰) in top-left
2. Click "Logout" button
3. You should be logged out and redirected to login screen

**Expected Result:** User is logged out successfully

---

### 4. New Request with Default Status
**Steps:**
1. Login to the application
2. Click "Learn More" on any service tile
3. Click "New Request" button
4. Fill in Subject and Details
5. Click "Save"
6. Check the grid - new record should appear

**Expected Result:** New request is created with StatusId=1 (New) and IsActive=1

---

### 5. Deactivate Icon (🚫)
**Steps:**
1. Login and view the Service Records grid
2. Find any record in the grid
3. Click the 🚫 (deactivate) icon in the Actions column
4. The record's status should be updated to "Inactive" (StatusId=5)

**Expected Result:** Record status changes to Inactive

---

### 6. Delete Icon (🗑️)
**Steps:**
1. Login and view the Service Records grid
2. Find any record in the grid
3. Click the 🗑️ (delete) icon in the Actions column
4. The record should immediately disappear from the grid

**Expected Result:** Record is soft-deleted (IsActive=0) and removed from view

---

### 7. Refresh Button (🔄)
**Steps:**
1. Login and view the Service Records grid
2. Look for the "🔄 Refresh" button on the right side above the grid
3. Click the Refresh button
4. Grid should reload with latest data from server

**Expected Result:** Grid refreshes and shows current data

---

### 8. Active Records Filter
**Steps:**
1. Login and view the Service Records grid
2. Only records with IsActive=1 should be visible
3. Any records you deleted (IsActive=0) should not appear

**Expected Result:** Grid shows only active records

---

## Data Files to Verify

### Check JSON Files:
1. **data/marquee.json** - Contains 4 marquee items with titles, descriptions, and links
2. **data/metadata.json** - Contains 6 request status definitions
3. **data/requests_*.json** - All records should have:
   - StatusId property (default: 1)
   - IsActive property (default: 1)

---

## Icon Reference

| Icon | Action | Effect |
|------|--------|--------|
| ✏️ | Edit | Opens edit dialog for the record |
| 🚫 | Deactivate | Sets StatusId to 5 (Inactive) |
| 🗑️ | Delete | Sets IsActive to 0 (soft delete) |
| 🔄 | Refresh | Reloads grid data from server |

---

## Status Definitions

| StatusId | Status Name | Display Name | Color |
|----------|-------------|--------------|-------|
| 1 | New | New | Grey |
| 2 | InProgress | In Progress | Yellow |
| 3 | Resolved | Resolved | Orange |
| 4 | Received | Received | Olive Green |
| 5 | Inactive | Inactive | Dark Grey |
| 6 | Closed | Closed | Green |

---

## Troubleshooting

### If marquee dialog doesn't open:
- Make sure you're clicking on the marquee text itself
- Check browser console for any errors

### If user name doesn't show:
- Make sure you're logged in
- Check that user has firstName and lastName in profile

### If grid doesn't refresh:
- Check that server is running on port 3001
- Check browser console for API errors
- Verify network tab shows successful API calls

### If delete doesn't work:
- Check that record has an 'id' and 'serviceId'
- Verify server is running
- Check that IsActive is being set to 0 in the JSON file

---

## Server Requirements

Make sure the server is running:
```bash
node server.js
```

Server should be accessible at: `http://localhost:3001`

---

## Browser Compatibility

Tested and working on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

---

## Notes

- All changes are backward compatible
- Existing functionality remains unchanged
- Data is preserved (soft delete, not hard delete)
- All operations update timestamps automatically
