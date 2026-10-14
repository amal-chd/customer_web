# The Kada — Customer Web App

Customer-facing web application for The Kada / Kada Dine ecosystem, providing dining discovery, menus, online checkout, live order tracking, group ordering, and customer account management.

## Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Routing**: [React Router](https://reactrouter.com/)
- **Backend & Realtime Data**: [Firebase Firestore](https://firebase.google.com/docs/firestore), Auth & Functions
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Fill in your Firebase project credentials in .env
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

This compiles TypeScript, bundles the app using Vite, and executes the SEO pre-rendering script (`scripts/generate-seo-pages.mjs`).

## Features

- 📍 **Location & Delivery Zone Awareness**: Automatically resolves user coordinates and displays nearby active restaurants.
- 🍔 **Restaurant & Menu Browsing**: Categorized food menus, dietary indicators (Veg/Non-veg), add-ons, and pricing.
- 🛒 **Cart & Group Ordering**: Real-time shared carts with split bills and live participant updates.
- 💳 **Secure Checkout**: Seamless payment processing and direct order creation.
- ⏱️ **Live Order Tracking**: Real-time status updates from kitchen prep to rider delivery with live maps.
