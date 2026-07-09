# CampusHub Management Portal

CampusHub is a full-stack university management portal built for Admin, Faculty, and Student users. It supports account management, departments, courses, student enrollment, faculty course assignment, assignments, announcements, attendance, and role-based authentication.

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Redux Toolkit
- Axios
- Sonner

### Backend
- NestJS
- Prisma
- MySQL
- JWT Authentication
- bcrypt
- Role Guards
- Swagger API Docs

## User Roles

### Admin
- Create Admin, Faculty, and Student accounts
- Activate/deactivate users
- Manage departments
- Manage courses
- Manage student profiles
- Manage faculty profiles
- Assign faculty to courses
- Enroll students in courses

### Faculty
- View assigned courses
- Upload assignments
- Post announcements
- Mark attendance
- View student submissions

### Student
- View enrolled courses
- View assignments
- Submit assignments
- View announcements
- View attendance
- Update profile

## Features

- Secure JWT login
- Password hashing with bcrypt
- Role-based access control
- Admin-only user creation
- Forgot password flow
- Swagger API documentation
- MySQL database integration
- Prisma ORM
- Protected frontend routes
- Responsive dashboard UI
- CI/CD with GitHub Actions

## Project Structure

```text
campushub/
├── backend/
│   ├── prisma/
│   ├── src/
│   └── package.json
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── services/
│   ├── store/
│   └── package.json
│
└── README.md