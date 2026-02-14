# DeedVault - Quick Reference Guide

## What Changed?

### 🎨 Visual Changes

1. **Home Button → Home Icon**
   - Before: Text button "🏠 Home"
   - After: Glossy, clickable home icon (🏠) with gradient background

2. **Compact Forms**
   - Modal dialogs are now smaller (500px vs 600px)
   - Reduced padding and spacing throughout
   - Better fit on smaller screens

3. **User Photo in Marquee**
   - When logged in, your profile photo appears on the right side of the marquee bar
   - Circular photo with border and shadow effects

### 📝 Form Changes

1. **Edit Service Record**
   - Cost field is now EDITABLE (was read-only)
   - You can now change the cost value directly

2. **Add New Service Request**
   - Shows cost range as label: "₹1,000 - ₹5,000"
   - Default cost is set to MAX value automatically

3. **Profile Photo Upload**
   - New section in Edit Profile
   - Upload JPG, JPEG, or PNG images
   - Maximum size: 300KB
   - Shows preview before saving

### 🔒 Security Changes

1. **New Request Button**
   - Disabled when not logged in
   - Must be authenticated to create requests

2. **Service Records Grid**
   - Only visible when logged in
   - Hidden for anonymous users

### 💰 Price Display

1. **Service Tiles**
   - Now show: "₹{minPrice} - ₹{maxPrice}"
   - Calculated from new minPrice/maxPrice properties

2. **Services Data**
   - Each service now has minPrice and maxPrice fields
   - Example: minPrice: 1000, maxPrice: 2500

### 📊 Data Grid

1. **Reduced Spacing**
   - Table cells are more compact
   - Better use of screen space
   - Easier to see more records at once

## File Structure

```
DeedVault/
├── data/
│   ├── images/                    # NEW: User profile photos
│   │   └── {firstName}_{lastName}_{userId}.json
│   ├── services.json              # UPDATED: Added minPrice/maxPrice
│   └── users.json
├── src/
│   ├── components/
│   │   ├── EditProfile.tsx        # UPDATED: Photo upload
│   │   ├── EditProfile.css        # UPDATED: Photo preview styles
│   │   ├── Header.tsx             # UPDATED: Glossy home icon
│   │   ├── Header.css             # UPDATED: Icon styles
│   │   ├── Marquee.tsx            # UPDATED: User photo display
│   │   ├── Marquee.css            # UPDATED: Photo container styles
│   │   ├── RequestForm.tsx        # UPDATED: Cost field, default value
│   │   ├── ServiceModal.tsx       # UPDATED: Disable button
│   │   ├── ServiceTiles.tsx       # UPDATED: Multiple changes
│   │   └── ServiceTiles.css       # UPDATED: Reduced spacing
│   └── ...
├── server.js                      # UPDATED: Photo endpoints
├── package.json                   # UPDATED: Added multer
└── CHANGES_SUMMARY.md             # NEW: This document

```

## API Changes

### New Endpoints

1. **POST /api/users/upload-photo**
   - Upload profile photo
   - FormData: photo, userId, firstName, lastName
   - Validates file type and size

2. **GET /api/users/:userId/photo**
   - Retrieve user profile photo
   - Returns base64 encoded image

## How to Use New Features

### Upload Profile Photo

1. Go to Edit Profile
2. Scroll to "Profile Photo" section
3. Click "Choose File"
4. Select JPG/JPEG/PNG under 300KB
5. Preview appears immediately
6. Click "Save Changes" to upload

### View Your Photo

- After uploading, your photo appears in the marquee bar (top)
- Only visible when you're logged in
- Circular photo on the right side

### Edit Service Cost

1. Click edit icon (✏️) on any service record
2. Find "Cost" field
3. Type new cost value
4. Click "Save"

### Create New Request

1. Must be logged in (button disabled otherwise)
2. Click "Learn More" on any service
3. Click "New Request"
4. Cost is automatically set to maximum price
5. Fill in details and save

## Troubleshooting

### Photo Upload Issues

**Error: "Please upload the file with size less than or equal to 300 KB"**
- Solution: Compress your image or choose a smaller file

**Error: "Please upload a JPG, JPEG, or PNG image"**
- Solution: Convert your image to one of these formats

**Photo not showing in marquee**
- Make sure you're logged in
- Refresh the page after uploading
- Check that the upload was successful

### Button Disabled Issues

**"New Request" button is grayed out**
- You need to log in first
- Create an account if you don't have one

**Can't see service records**
- You need to log in to view records
- This is for security and privacy

## Developer Notes

### Photo Storage Format

Photos are stored as JSON files in `data/images/`:

```json
{
  "userid": "1770830993903",
  "extension": ".jpg",
  "image": "base64_encoded_string_here..."
}
```

### Service Data Format

```json
{
  "id": 1,
  "title": "Service Name",
  "priceRange": "₹1,000 - ₹2,500",
  "minPrice": 1000,
  "maxPrice": 2500
}
```

### CSS Variables

Key spacing values changed:
- Modal padding: 24px → 14-18px
- Form gap: 20px → 10px
- Input padding: 12px → 8px
- Button padding: 12px 24px → 8px 18px

## Testing Commands

```bash
# Install dependencies
npm install

# Run development server with backend
npm run dev-with-server

# Run only frontend
npm run dev

# Run only backend
npm run server
```

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Responsive design

## Performance Notes

- Photo upload limited to 300KB for fast loading
- Base64 encoding used for easy storage
- Photos cached in browser for better performance
- Compact forms reduce page load time

## Security Considerations

- File type validation on client and server
- File size limits enforced
- User authentication required for sensitive operations
- Photos stored per user with unique identifiers

---

**Need Help?** Check the CHANGES_SUMMARY.md for detailed technical information.
