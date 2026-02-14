# DeedVault - Final Testing Checklist

## Pre-Testing Setup

- [ ] Run `npm install` to install multer dependency
- [ ] Verify `data/images/` folder exists
- [ ] Start server: `npm run dev-with-server`
- [ ] Open browser: `http://localhost:5173`

## Test 1: Edit Service Record - Cost Field Enabled ✅

**Steps:**
1. [ ] Login to the application
2. [ ] Scroll down to "Service Records" grid
3. [ ] Click the edit icon (✏️) on any record
4. [ ] Find the "Cost" field
5. [ ] Verify it's an INPUT field (not a label)
6. [ ] Type a new cost value (e.g., 3000)
7. [ ] Click "Save"
8. [ ] Verify the cost is updated in the grid

**Expected Result:** Cost field is editable and saves successfully

---

## Test 2: Services JSON - Min and Max Price Properties ✅

**Steps:**
1. [ ] Open `data/services.json` in editor
2. [ ] Check Service ID 1
3. [ ] Verify `minPrice: 1000` exists
4. [ ] Verify `maxPrice: 2500` exists
5. [ ] Check all 6 services have both properties

**Expected Result:** All services have minPrice and maxPrice properties

---

## Test 3: Display Price Range on Service Tiles ✅

**Steps:**
1. [ ] Open the application homepage
2. [ ] Look at the service tiles (horizontal scroll)
3. [ ] Check the top-right corner of each tile
4. [ ] Verify format: "₹1000 - ₹2500"
5. [ ] Verify all tiles show price ranges

**Expected Result:** Price ranges displayed as "₹{min} - ₹{max}"

---

## Test 4: Cost Field in Add Service Form ✅

**Steps:**
1. [ ] Login to the application
2. [ ] Click "Learn More" on any service
3. [ ] Click "New Request" button
4. [ ] Look for "Cost" field
5. [ ] Verify it shows as a label (not input)
6. [ ] Verify format: "₹1000 - ₹2500"
7. [ ] Verify it's between "Requester Name" and "Subject"

**Expected Result:** Cost field displays as read-only label with range

---

## Test 5: Reduced Spacing in Forms and Modals ✅

**Steps:**
1. [ ] Open any modal (Edit or New Request)
2. [ ] Measure/observe the spacing:
   - [ ] Modal feels more compact
   - [ ] Less white space between fields
   - [ ] Buttons are closer together
   - [ ] Modal width is narrower
3. [ ] Scroll if content exceeds height
4. [ ] Verify scrollbar appears when needed

**Expected Result:** Forms are more compact with reduced spacing

---

## Test 6: Default Cost from Max Price ✅

**Steps:**
1. [ ] Login to the application
2. [ ] Click "Learn More" on Service 1 (max: 2500)
3. [ ] Click "New Request"
4. [ ] Fill in Subject and Details
5. [ ] Click "Save"
6. [ ] Check the grid for the new record
7. [ ] Verify Cost column shows ₹2500.00 (not ₹0.00)

**Expected Result:** New records have cost = maxPrice automatically

---

## Test 7: Disable New Request Button for Non-Logged Users ✅

**Steps:**
1. [ ] Logout (if logged in)
2. [ ] Click "Learn More" on any service
3. [ ] Look at "New Request" button
4. [ ] Verify button is GRAY/DISABLED
5. [ ] Try clicking it (should not work)
6. [ ] Login
7. [ ] Click "Learn More" again
8. [ ] Verify button is now GREEN/ENABLED

**Expected Result:** Button disabled when not logged in, enabled when logged in

---

## Test 8: Hide Grid for Non-Logged Users ✅

**Steps:**
1. [ ] Logout (if logged in)
2. [ ] Scroll down the page
3. [ ] Verify "Service Records" grid is NOT visible
4. [ ] Only service tiles should be visible
5. [ ] Login
6. [ ] Scroll down again
7. [ ] Verify "Service Records" grid IS NOW visible

**Expected Result:** Grid only visible when logged in

---

## Test 9: Reduced Data Grid Spacing ✅

**Steps:**
1. [ ] Login to the application
2. [ ] Scroll to "Service Records" grid
3. [ ] Observe the table:
   - [ ] Header cells are more compact
   - [ ] Data cells have less padding
   - [ ] Rows are closer together
   - [ ] More records visible on screen
4. [ ] Compare with old screenshots (if available)

**Expected Result:** Grid is more compact with reduced cell spacing

---

## Test 10: Glossy Home Icon Button ✅

**Steps:**
1. [ ] Look at the header (top of page)
2. [ ] Find the home icon (🏠) - should be near the menu
3. [ ] Verify it's an ICON only (no "Home" text)
4. [ ] Observe the glossy effect:
   - [ ] Gradient background
   - [ ] Border with transparency
   - [ ] Shadow effect
5. [ ] Hover over the icon
6. [ ] Verify hover effects:
   - [ ] Scales up slightly
   - [ ] Shadow increases
   - [ ] Background lightens
7. [ ] Click the icon
8. [ ] Verify it navigates to home page

**Expected Result:** Glossy, clickable home icon with hover effects

---

## Test 11: Profile Photo Upload ✅

### Test 11a: Valid Photo Upload
**Steps:**
1. [ ] Login to the application
2. [ ] Go to Edit Profile
3. [ ] Scroll to "Profile Photo" section
4. [ ] Click "Choose File"
5. [ ] Select a JPG image under 300KB
6. [ ] Verify preview appears (circular, 150x150px)
7. [ ] Click "Save Changes"
8. [ ] Verify success message
9. [ ] Check `data/images/` folder
10. [ ] Verify file exists: `{firstName}_{lastName}_{userId}.json`
11. [ ] Open the JSON file
12. [ ] Verify structure:
    - [ ] userid field
    - [ ] extension field (.jpg)
    - [ ] image field (base64 data)

**Expected Result:** Photo uploads successfully and JSON file is created

### Test 11b: File Size Validation
**Steps:**
1. [ ] Go to Edit Profile
2. [ ] Try uploading an image OVER 300KB
3. [ ] Verify error message appears:
    "Please upload the file with size less than or equal to 300 KB"
4. [ ] Verify photo is NOT uploaded

**Expected Result:** Error message shown for oversized files

### Test 11c: File Type Validation
**Steps:**
1. [ ] Go to Edit Profile
2. [ ] Try uploading a PDF or other non-image file
3. [ ] Verify error message appears
4. [ ] Try uploading a GIF file
5. [ ] Verify error message appears
6. [ ] Upload a PNG file (under 300KB)
7. [ ] Verify it works

**Expected Result:** Only JPG, JPEG, PNG accepted

---

## Test 12: User Photo in Marquee Bar ✅

**Steps:**
1. [ ] Logout (if logged in)
2. [ ] Look at the marquee bar (top, below header)
3. [ ] Verify NO photo is visible on the right
4. [ ] Login with an account that has a photo
5. [ ] Look at the marquee bar again
6. [ ] Verify photo appears on the EXTREME RIGHT
7. [ ] Verify photo is:
   - [ ] Circular (50x50px)
   - [ ] Has gold border
   - [ ] Has shadow effect
8. [ ] Hover over the photo
9. [ ] Verify it scales up slightly
10. [ ] Verify the photo matches the uploaded image

**Expected Result:** User photo displays in marquee when logged in

---

## Integration Tests

### Test A: Complete User Journey
**Steps:**
1. [ ] Create a new account
2. [ ] Login
3. [ ] Go to Edit Profile
4. [ ] Upload a profile photo
5. [ ] Verify photo appears in marquee
6. [ ] Go back to home
7. [ ] Click "Learn More" on a service
8. [ ] Click "New Request" (should be enabled)
9. [ ] Verify cost range is shown
10. [ ] Fill form and save
11. [ ] Verify new record appears in grid
12. [ ] Verify cost = maxPrice
13. [ ] Click edit icon on the record
14. [ ] Modify the cost
15. [ ] Save changes
16. [ ] Verify cost is updated
17. [ ] Logout
18. [ ] Verify photo disappears from marquee
19. [ ] Verify grid is hidden
20. [ ] Verify "New Request" is disabled

**Expected Result:** Complete flow works seamlessly

### Test B: Multiple Users
**Steps:**
1. [ ] Create User A with photo
2. [ ] Login as User A
3. [ ] Verify User A's photo in marquee
4. [ ] Logout
5. [ ] Create User B with different photo
6. [ ] Login as User B
7. [ ] Verify User B's photo in marquee (not User A's)
8. [ ] Check `data/images/` folder
9. [ ] Verify both JSON files exist
10. [ ] Verify correct naming convention

**Expected Result:** Each user has their own photo

---

## Browser Compatibility Tests

### Chrome/Edge
- [ ] All features work
- [ ] Glossy effects render correctly
- [ ] Photo upload works
- [ ] No console errors

### Firefox
- [ ] All features work
- [ ] Glossy effects render correctly
- [ ] Photo upload works
- [ ] No console errors

### Safari
- [ ] All features work
- [ ] Glossy effects render correctly
- [ ] Photo upload works
- [ ] No console errors

### Mobile Browser
- [ ] Responsive design works
- [ ] Touch interactions work
- [ ] Photo upload works
- [ ] Modals fit on screen

---

## Performance Tests

- [ ] Page loads in under 3 seconds
- [ ] Photo upload completes in under 2 seconds
- [ ] Modal animations are smooth
- [ ] No lag when scrolling
- [ ] Grid renders quickly with 10+ records

---

## Security Tests

- [ ] Cannot access grid without login
- [ ] Cannot create request without login
- [ ] Cannot upload files over 300KB
- [ ] Cannot upload non-image files
- [ ] Photo files are user-specific
- [ ] No sensitive data in console

---

## Regression Tests

### Existing Features Still Work
- [ ] User registration works
- [ ] User login works
- [ ] Profile editing works (non-photo fields)
- [ ] Service tiles display correctly
- [ ] Service modals open correctly
- [ ] Request history tracking works
- [ ] Marquee scrolling works
- [ ] Sidebar menu works
- [ ] Logout works

---

## Edge Cases

### Photo Upload Edge Cases
- [ ] Upload exactly 300KB file (should work)
- [ ] Upload 301KB file (should fail)
- [ ] Upload photo, then upload different photo (should replace)
- [ ] Upload photo with special characters in filename
- [ ] Upload photo with very long filename

### Form Edge Cases
- [ ] Edit cost to 0 (should work)
- [ ] Edit cost to negative number (should handle)
- [ ] Edit cost to very large number
- [ ] Submit form with empty fields
- [ ] Submit form with special characters

### Authentication Edge Cases
- [ ] Logout while modal is open
- [ ] Login while on different page
- [ ] Session timeout handling
- [ ] Multiple tabs open

---

## Documentation Review

- [ ] CHANGES_SUMMARY.md is accurate
- [ ] QUICK_REFERENCE.md is helpful
- [ ] IMPLEMENTATION_COMPLETE.md is complete
- [ ] VISUAL_CHANGES_MAP.md is clear
- [ ] All code comments are accurate

---

## Final Checklist

- [ ] All 12 requirements implemented
- [ ] All tests passed
- [ ] No console errors
- [ ] No broken features
- [ ] Documentation complete
- [ ] Code is clean and commented
- [ ] Ready for production

---

## Known Issues (If Any)

Document any issues found during testing:

1. Issue: _______________
   Status: _______________
   Priority: _______________

2. Issue: _______________
   Status: _______________
   Priority: _______________

---

## Sign-Off

- [ ] Developer tested: _______________
- [ ] QA tested: _______________
- [ ] Product owner approved: _______________
- [ ] Ready for deployment: _______________

**Date:** _______________
**Tester Name:** _______________
**Signature:** _______________

---

## Quick Commands Reference

```bash
# Install dependencies
npm install

# Start development server
npm run dev-with-server

# Start only frontend
npm run dev

# Start only backend
npm run server

# Build for production
npm run build

# Preview production build
npm run preview
```

## Troubleshooting

**Server won't start:**
```bash
# Check if port 3001 is in use
netstat -ano | findstr :3001

# Kill the process if needed
taskkill /PID <process_id> /F
```

**Photo upload fails:**
- Check server logs
- Verify data/images folder exists
- Check file permissions
- Verify multer is installed

**Grid not showing:**
- Verify user is logged in
- Check browser console
- Refresh the page

---

**Testing Status:** ⬜ Not Started | 🟡 In Progress | ✅ Complete

**Overall Status:** _____________

**Notes:** _____________________________________________
