# 🔐 Secure Creds - Password Manager

A modern, secure password management application built with Next.js 15, React, and MongoDB. Store, manage, and access your passwords with enterprise-grade security.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![React](https://img.shields.io/badge/React-18-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)

## ✨ Features

### 🔐 Security Features

- **AES Encryption** - All passwords encrypted before database storage
- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - User passwords hashed with bcrypt
- **Environment Variables** - Secure configuration management

### 🚀 Core Functionality

- **User Authentication** - Sign up and login with email/password
- **Credential Management** - Add, edit, delete, and search credentials
- **Password Visibility Toggle** - Individual password show/hide controls
- **One-Click Copy** - Copy any field to clipboard instantly
- **Smart Search** - Find credentials by website name
- **Responsive Design** - Works perfectly on all devices

### 📱 User Experience

- **Modern UI** - Clean, intuitive interface with Tailwind CSS
- **Real-time Feedback** - Success/error messages with auto-dismiss
- **Loading States** - Smooth user experience with loading indicators
- **Mobile Responsive** - Optimized for desktop, tablet, and mobile

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens
- **Encryption**: CryptoJS (AES)
- **Password Hashing**: bcryptjs

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** database (local or MongoDB Atlas)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd secure-creds
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```bash
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/secure-creds?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here

# Encryption
ENCRYPTION_KEY=your-32-character-encryption-key-here
```

#### Generate Secure Keys

**JWT Secret:**

```bash
openssl rand -base64 32
```

**Encryption Key:**

```bash
openssl rand -base64 32
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
secure-creds/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   └── signup/
│   │   │   └── credentials/
│   │   │       ├── [id]/
│   │   │       └── search/
│   │   ├── dashboard/
│   │   ├── login/
│   │   ├── signup/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── lib/
│       ├── models/
│       │   ├── Credential.ts
│       │   └── User.ts
│       ├── encryption.ts
│       └── mongodb.ts
├── public/
├── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User authentication

### Credentials

- `GET /api/credentials` - Get all user credentials
- `POST /api/credentials` - Add new credential
- `PUT /api/credentials/[id]` - Update credential
- `DELETE /api/credentials/[id]` - Delete credential
- `GET /api/credentials/search` - Search credentials by sitename

## 📊 Database Schema

### User Model

```typescript
{
  email: string (unique, required),
  password: string (hashed, required),
  createdAt: Date,
  updatedAt: Date
}
```

### Credential Model

```typescript
{
  sitename: string (required),
  username: string (required),
  email: string (required),
  password: string (encrypted, required),
  other: string (optional),
  userId: ObjectId (required, ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Security Features

### Password Encryption

- **AES-256 encryption** for all stored passwords
- **Environment-based encryption key** for maximum security
- **Automatic encryption/decryption** - transparent to users

### Authentication

- **JWT tokens** for session management
- **bcrypt password hashing** for user passwords
- **Token expiration** (7 days)

### Data Protection

- **User isolation** - users can only access their own credentials
- **Input validation** - all inputs are validated and sanitized
- **Error handling** - secure error messages without data leakage

## 🎨 UI/UX Features

### Landing Page

- **Professional design** with gradient backgrounds
- **Feature highlights** with icons and descriptions
- **Call-to-action buttons** for signup/login
- **Responsive layout** for all screen sizes

### Dashboard

- **Clean table layout** for credential management
- **Inline editing** with save/cancel functionality
- **Individual password toggles** for each credential
- **One-click copy** for all fields
- **Search functionality** with instant results

### Authentication Pages

- **Simple forms** for login and signup
- **Error handling** with user-friendly messages
- **Loading states** for better UX
- **Automatic redirects** based on authentication status

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Code Style

- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for code formatting
- **Conventional commits** for version control

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

**Built with ❤️ using Next.js 15 and MongoDB**
