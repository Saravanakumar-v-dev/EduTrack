# 🎓 EduTrack - Student Performance Analytics Platform

<div align="center">

![EduTrack Banner](https://img.shields.io/badge/EduTrack-Student%20Performance%20Analytics-6366f1?style=for-the-badge&logo=graduation-cap&logoColor=white)

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

**A comprehensive full-stack MERN application for managing, analyzing, and visualizing student academic performance with role-based dashboards, AI-powered insights, and real-time analytics.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [API Documentation](#-api-endpoints)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Usage](#-usage)
- [User Roles](#-user-roles)
- [API Endpoints](#-api-endpoints)
- [Security Features](#-security-features)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

EduTrack is a role-based web application designed to centralize student academic data, provide insightful analytics, and enable secure access for students, teachers, and administrators. Built using the **MERN stack** (MongoDB, Express.js, React, Node.js), it follows industry-standard security practices and modern UI/UX principles.

### Key Highlights

- 🔐 **Secure Authentication** - OTP-based registration with JWT tokens stored in HTTP-only cookies
- 📊 **Interactive Dashboards** - Role-specific dashboards with real-time analytics
- 📈 **Performance Analytics** - Subject-wise progress tracking and trend analysis
- 🎨 **Modern UI** - Beautiful dark/light mode with smooth animations
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

---

## ✨ Features

### 👨‍🎓 For Students
- Personal performance dashboard with grade visualization
- Subject-wise progress tracking
- Assignment submission with file uploads
- View grades and teacher feedback
- AI-generated improvement suggestions

### 👨‍🏫 For Teachers
- Class-level analytics and statistics
- Student management with performance indicators
- Assignment creation and grading
- Mark attendance and upload marks
- Identify top performers and at-risk students
- Generate performance reports

### 👨‍💼 For Administrators
- Full system access and user management
- Create teacher and student accounts
- Institution-wide analytics dashboard
- Backup system and system settings
- Security and audit monitoring
- Manage assignments across all classes

### 🔧 System Features
- **Dark/Light Mode** - Toggle between themes
- **Real-time Notifications** - Toast notifications for actions
- **CSV Upload** - Bulk data import functionality
- **PDF Reports** - Generate and download reports
- **Email Notifications** - Automated email alerts
- **Predictive Alerts** - Performance prediction system

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| Vite | Build Tool |
| TailwindCSS | Styling |
| Framer Motion | Animations |
| React Router DOM | Navigation |
| Axios | HTTP Client |
| Recharts | Data Visualization |
| Lucide React | Icons |
| React Hot Toast | Notifications |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime Environment |
| Express.js | Web Framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| Bcrypt.js | Password Hashing |
| Nodemailer | Email Service |
| Multer | File Uploads |

---

## 📁 Project Structure

```
EduTrack/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── api/              # Axios configuration
│   │   ├── components/       # Reusable components
│   │   │   ├── cards/        # Card components
│   │   │   ├── charts/       # Chart components
│   │   │   ├── common/       # Common components
│   │   │   ├── landing/      # Landing page components
│   │   │   ├── layout/       # Layout components
│   │   │   └── teacher/      # Teacher-specific components
│   │   ├── context/          # React Context (Auth, Theme)
│   │   ├── pages/            # Page components
│   │   │   ├── admin/        # Admin pages
│   │   │   ├── assignments/  # Assignment pages
│   │   │   ├── auth/         # Authentication pages
│   │   │   ├── dashboard/    # Dashboard pages
│   │   │   ├── reports/      # Report pages
│   │   │   └── settings/     # Settings pages
│   │   └── App.jsx           # Main App component
│   └── package.json
│
├── server/                    # Express Backend
│   ├── config/               # Configuration files
│   ├── controllers/          # Route controllers
│   ├── middleware/           # Custom middleware
│   ├── models/               # Mongoose models
│   ├── routes/               # API routes
│   ├── utils/                # Utility functions
│   └── server.js             # Entry point
│
└── package.json              # Root package.json
```

---

## 🚀 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Git

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/saravana0070/EduTrack.git
   cd EduTrack
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install client dependencies
   cd client
   npm install

   # Install server dependencies
   cd ../server
   npm install
   ```

3. **Set up environment variables**
   
   Create `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   
   # Email Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   ```

4. **Run the application**
   ```bash
   # Run both client and server (from root directory)
   npm run dev

   # Or run separately:
   # Terminal 1 - Server
   cd server
   npm run dev

   # Terminal 2 - Client
   cd client
   npm run dev
   ```

5. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

---

## ⚙️ Environment Variables

### Server (.env)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `NODE_ENV` | Environment (development/production) |
| `SMTP_HOST` | Email SMTP host |
| `SMTP_PORT` | Email SMTP port |
| `SMTP_USER` | Email username |
| `SMTP_PASS` | Email password/app password |

### Client (.env)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL |
| `VITE_FIREBASE_*` | Firebase configuration (optional) |

---

## 📖 Usage

### Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@edutrack.com | admin123 |

### Getting Started

1. **Admin Setup**: Login as admin to create teacher and student accounts
2. **Teacher Workflow**: Teachers can create assignments, upload marks, and view analytics
3. **Student Workflow**: Students can view their dashboard, submit assignments, and track progress

---

## 👥 User Roles

### 🔵 Student
- View personal performance dashboard
- Track subject-wise progress
- Submit assignments
- Receive AI-powered improvement suggestions

### 🟢 Teacher
- Manage assigned students
- Upload marks and attendance
- Create and grade assignments
- View class-level analytics
- Identify weak and strong performers

### 🔴 Admin
- Full system access
- User and role management
- Analytics across all departments
- System settings and backup
- Security monitoring

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/request-register-otp` | Request OTP for registration |
| POST | `/api/auth/verify-register` | Verify OTP and complete registration |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/auth/profile` | Get user profile |
| POST | `/api/auth/request-reset-otp` | Request password reset OTP |
| POST | `/api/auth/reset-password-otp` | Reset password with OTP |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users (Admin) |
| POST | `/api/users` | Create user (Admin) |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user (Admin) |

### Assignments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/assignments` | Get all assignments |
| POST | `/api/assignments` | Create assignment (Teacher/Admin) |
| GET | `/api/assignments/:id` | Get single assignment |
| PUT | `/api/assignments/:id` | Update assignment |
| DELETE | `/api/assignments/:id` | Delete assignment |
| POST | `/api/assignments/:id/submit` | Submit assignment (Student) |
| PUT | `/api/assignments/:id/submissions/:subId/review` | Grade submission (Teacher/Admin) |

---

## 🔒 Security Features

- **JWT Authentication** - Stored in HTTP-only cookies
- **Password Hashing** - Using bcrypt with salt rounds
- **OTP Verification** - For registration and password reset
- **Role-Based Access Control (RBAC)** - Protected routes and APIs
- **CORS Configuration** - Secure cross-origin requests
- **Input Validation** - Server-side validation and sanitization
- **Protected Routes** - Both frontend and backend route protection

---

## 🎨 UI/UX Features

- **Dark/Light Mode** - System-wide theme toggle
- **Responsive Design** - Mobile-first approach
- **Smooth Animations** - Framer Motion powered
- **Interactive Charts** - Recharts data visualization
- **Toast Notifications** - Real-time feedback
- **Modern Gradients** - Premium glassmorphism effects
- **Micro-interactions** - Hover effects and transitions

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Saravana** - [GitHub](https://github.com/saravana0070)

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

Made with ❤️ using the MERN Stack

</div>
