# Lief - Fullstack Case Notes App

## Overview
Lief is a fullstack web application for uploading, managing, and OCR-processing medical case notes. It features a React frontend and a Node.js/Express backend, with image uploads handled via Cloudinary and OCR via Tesseract.js. The project is deployed on Vercel (frontend) and Render (backend).

- **System Design:** [Tech-system-design-doc](https://docs.google.com/document/d/1hpgztN1y2Nx2hjq0cINTL2ssMyJIw0JfPz5crHOcYKg/edit?usp=sharing)

---

## Project Structure

```
lief/
├── client/        # React frontend (Vite, React Router, Tailwind)
├── api/           # Node.js/Express backend (MongoDB, Cloudinary, Tesseract.js)
├── vercel.json    # Vercel deployment config (routes, builds)
├── package.json   # Root package.json
└── README.md      # README
```

---

## URLs

- **Frontend (Vercel):** [https://lief-nu.vercel.app/](https://lief-nu.vercel.app/)
- **Backend (Render):** [https://lief.onrender.com/](https://lief.onrender.com/)

---

## Features
- User authentication (signup/login)
- Upload case notes as text or images
- Images are uploaded to Cloudinary
- OCR is performed on images using Tesseract.js
- Notes are stored in MongoDB
- Status indicator for OCR processing
- Responsive UI with Tailwind CSS

---

## Deployment

### Vercel (Frontend)
- The React app is built and deployed to Vercel.
- Static files are served from `client/build/client`.
- All API requests are proxied to `/api`.

### Render (Backend)
- The Express backend is deployed to Render.
- Handles all API routes under `/api`.
- Connects to MongoDB and Cloudinary.

---

## API Endpoints

- `POST /auth/signup` - User signup
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user
- `POST /case-notes/upload-image` - Upload image note (OCR processed asynchronously)
- `POST /case-notes/upload-text` - Upload text note
- `GET /case-notes` - List all notes for user
- `GET /health-check` - Health check endpoint

---

## Environment Variables

### Frontend (`client/.env`)
```
VITE_API_URL=https://lief.onrender.com/
```

### Backend (`api/.env`)
```
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
JWT_SECRET=your_jwt_secret
```

---

## How to Run Locally

### 1. Clone the repo
```
git clone https://github.com/shivam-shukla-25/lief.git
cd lief
```

### 2. Setup Backend
```
cd api
npm install
# Add .env file with your secrets
npm run dev
```

### 3. Setup Frontend
```
cd ../client
npm install
# Add .env file with VITE_API_URL
npm run dev
```

---

## Vercel Configuration
- See `vercel.json` for build and routing setup.
- All `/api/*` routes are proxied to the backend.
- All other routes are served by the frontend.
