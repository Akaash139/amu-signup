# AMU - Modern Signup Page

A premium, interactive signup experience built with React, Vite, and Tailwind CSS, featuring high-performance WebGL background effects and Google Authentication.

## Getting Started

To get the project running locally, follow these steps:

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```
🔗 **[Live Demo]
(https://amu-signup.netlify.app/)**

---

## Project Structure

src/
│
├── App.jsx            # Main application entry and layout shell
├── App.css            # Layout-specific styling
├── index.css          # Global styles & Tailwind CSS configuration
├── main.jsx           # React DOM mounting
│
├── assets/            # Static assets and design files
│   ├── Group1.svg     # Logo (Figma SVG)
│   ├── hero.png       # Landing illustration
│   └── ...            # Other images/icons
│
├── components/        # Reusable UI components
│   ├── Signup.jsx     # Signup form with Google OAuth
│   ├── ColorBends.jsx # WebGL animated gradient background
│   ├── DotField.jsx   # Interactive particle background
│   └── login          
│
## Design Decisions

### Interactive Backgrounds — WebGL & OGL
I chose to use **OGL** and **Three.js** to implement high-performance, GPU-accelerated background animations (`ColorBends` and `DotField`). This provides a premium "SaaS" feel without compromising the main thread's performance.

### Styling — Tailwind CSS v4
The project utilizes the latest **Tailwind CSS v4** via the Vite plugin. This allows for a zero-runtime CSS footprint while maintaining a highly customizable and modern UI system.

### Asset Creation — Figma to SVG
The brand identity and logo (`Group 1.svg`) were meticulously crafted in **Figma** and exported as optimized SVGs. This ensures the logo stays crisp at any resolution while remaining lightweight for fast page loads.

### Authentication Strategy
Integrated **Google OAuth 2.0** using `@react-oauth/google` to provide a seamless, modern registration flow alongside the traditional email/password form.

---

## Features Implemented

- [x] **Responsive Design**: Pixel-perfect layout across mobile, tablet, and desktop.
- [x] **Interactive UI**: Dynamic backgrounds that respond to user presence.
- [x] **Social Auth**: Ready-to-use Google Login integration.
- [x] **Form Validation**: Clean, user-friendly input handling.
- [x] **SEO Optimized**: Semantic HTML and accessibility-first approach.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Vite + React 19 |
| **Styling** | Tailwind CSS v4 |
| **Backgrounds** | OGL + Three.js |
| **Auth** | Google OAuth (@react-oauth/google) |
| **Icons** | Figma (Custom SVGs) |

---

