# DeedVault - Property Services Platform

A modern React + Vite application for property-related deals and transactions.

## Features

- 🏛️ **Property Document Verification** - Verify property documents instantly
- 📄 **Document Services** - Comprehensive document preparation and management
- 📰 **Newspaper Notices** - Publish legal notices in leading newspapers
- ⚖️ **Legal Opinion** - Expert legal advice from certified professionals
- 🏠 **Properties for Sale** - Browse verified properties

## Tech Stack

- **React 18** - UI library
- **Vite** - Frontend build tool
- **TypeScript** - Type-safe development
- **CSS3** - Modern styling with animations

## Project Structure

```
src/
├── components/
│   ├── Header.tsx         # Top navigation with menu and logo
│   ├── Sidebar.tsx        # Navigation menu (Create Account, Sign In, etc.)
│   ├── Marquee.tsx        # Scrolling announcement bar
│   └── ServiceTiles.tsx   # Service cards grid
├── App.tsx                # Main application component
├── main.tsx               # Entry point
└── index.css              # Global styles
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd D:\DeedVault
```

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

The app will open at `http://localhost:5173`

### Build

Create an optimized production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Features Implemented

### Header
- DeedVault branding with icon in top-right corner
- Hamburger menu button on top-left

### Sidebar Menu
- Create Account
- Sign In
- Logout
- About Us
- Smooth slide-in animation

### Marquee (Announcement Bar)
- Scrolling information display
- Auto-rotating announcements
- Pauses on hover

### Service Tiles
- 5 service cards with icons and descriptions
- Hover animations
- Responsive grid layout
- Call-to-action buttons

## Customization

### Replace the Logo Icon
The DeedVault logo currently uses an emoji (🏛️). To replace it with your own icon:

1. Place your icon file in the `public/` folder
2. Update the `Header.tsx` component to use an `<img>` tag instead of the emoji

### Update Marquee Text
Edit the `examples` array in `Marquee.tsx` to customize announcement messages.

### Styling
All components use CSS modules. Modify the respective `.css` files to change colors, spacing, and animations.

## License

MIT License - Feel free to use this project for your needs.
