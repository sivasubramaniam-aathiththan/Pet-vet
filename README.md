# Pet Management System - Full Stack Application

A comprehensive Pet Management System built with Java Spring Boot backend and React frontend.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [User Roles](#user-roles)

## ✨ Features

### User Features
- **Pet Management**: Create, view, update, and delete pets
- **Doctor Appointments**: View available doctors, check availability, book appointments
- **Vaccination Management**: Track vaccinations with due date alerts
- **Expense Tracking**: Monthly expense tracking per pet with summaries
- **Pet Adoption**: Submit adoption posts for abandoned/found pets
- **Trainer Packages**: View training packages from certified trainers
- **Product Suggestions**: Browse recommended pet products

### Admin Features
- **Dashboard**: View system statistics
- **User Management**: View all users, add/delete doctors and trainers
- **Adoption Review**: Approve or reject adoption posts
- **Product Management**: Add and manage product suggestions

## 🛠 Tech Stack

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Security with JWT
- Spring Data JPA
- MySQL Database
- Lombok

### Frontend
- React 18
- Vite
- Axios
- React Router DOM
- React Toastify

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
    user_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20),
    address VARCHAR(255),
    role ENUM('ADMIN', 'USER', 'DOCTOR', 'TRAINER') NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE,
    specialization VARCHAR(100),
    availability VARCHAR(100),
    expertise VARCHAR(100),
    created_at DATETIME,
    updated_at DATETIME
);
```

### Pets Table
```sql
CREATE TABLE pets (
    pet_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    pet_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    pet_image TEXT,
    breed VARCHAR(100) NOT NULL,
    species VARCHAR(50),
    gender VARCHAR(20),
    color VARCHAR(50),
    weight DOUBLE,
    notes TEXT,
    user_id BIGINT NOT NULL,
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

### Appointments Table
```sql
CREATE TABLE appointments (
    appointment_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    reason TEXT,
    notes TEXT,
    pet_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (pet_id) REFERENCES pets(pet_id),
    FOREIGN KEY (doctor_id) REFERENCES users(user_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

### Vaccinations Table
```sql
CREATE TABLE vaccinations (
    vaccination_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    vaccine_name VARCHAR(100) NOT NULL,
    vaccination_date DATE NOT NULL,
    next_vaccination_date DATE NOT NULL,
    veterinarian VARCHAR(100),
    clinic_name VARCHAR(100),
    notes TEXT,
    pet_id BIGINT NOT NULL,
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (pet_id) REFERENCES pets(pet_id)
);
```

### Expenses Table
```sql
CREATE TABLE expenses (
    expense_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    category VARCHAR(50) NOT NULL,
    amount DOUBLE NOT NULL,
    expense_date DATE NOT NULL,
    month VARCHAR(20),
    description TEXT,
    pet_id BIGINT NOT NULL,
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (pet_id) REFERENCES pets(pet_id)
);
```

### Adoption Posts Table
```sql
CREATE TABLE adoption_posts (
    post_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    pet_details TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    pet_image TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    pet_type VARCHAR(50),
    age VARCHAR(20),
    gender VARCHAR(20),
    description TEXT,
    user_id BIGINT NOT NULL,
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

### Trainer Packages Table
```sql
CREATE TABLE trainer_packages (
    package_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    package_name VARCHAR(100) NOT NULL,
    description TEXT,
    duration VARCHAR(50) NOT NULL,
    price DOUBLE NOT NULL,
    pet_type VARCHAR(50),
    training_type VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    trainer_id BIGINT NOT NULL,
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (trainer_id) REFERENCES users(user_id)
);
```

### Products Table
```sql
CREATE TABLE products (
    product_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    description TEXT,
    external_link TEXT NOT NULL,
    image_url TEXT,
    category VARCHAR(50),
    brand VARCHAR(50),
    price DOUBLE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME,
    updated_at DATETIME
);
```

## 📁 Project Structure

```
pet-management-system/
├── backend/
│   ├── src/main/java/com/petmanagement/
│   │   ├── config/
│   │   │   └── CorsConfig.java
│   │   ├── controller/
│   │   │   ├── AuthController.java
│   │   │   ├── PetController.java
│   │   │   ├── UserController.java
│   │   │   ├── AdminController.java
│   │   │   ├── AppointmentController.java
│   │   │   ├── VaccinationController.java
│   │   │   ├── ExpenseController.java
│   │   │   ├── AdoptionPostController.java
│   │   │   ├── TrainerPackageController.java
│   │   │   └── ProductController.java
│   │   ├── dto/
│   │   │   ├── request/
│   │   │   └── response/
│   │   ├── entity/
│   │   │   ├── User.java
│   │   │   ├── Role.java
│   │   │   ├── Pet.java
│   │   │   ├── Appointment.java
│   │   │   ├── Vaccination.java
│   │   │   ├── Expense.java
│   │   │   ├── AdoptionPost.java
│   │   │   ├── TrainerPackage.java
│   │   │   └── Product.java
│   │   ├── repository/
│   │   ├── security/
│   │   │   ├── JwtService.java
│   │   │   ├── JwtAuthenticationFilter.java
│   │   │   ├── CustomUserDetailsService.java
│   │   │   └── SecurityConfig.java
│   │   ├── service/
│   │   └── PetManagementApplication.java
│   └── src/main/resources/
│       └── application.properties
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── Dashboard.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    └── vite.config.js
```

## 🚀 Setup Instructions

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8.0+
- Maven 3.8+

### Backend Setup

1. **Create MySQL Database**
```sql
CREATE DATABASE pet_management_db;
```

2. **Configure application.properties**
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/pet_management_db
spring.datasource.username=root
spring.datasource.password=your_password
```

3. **Create First Admin User** (Run in MySQL)
```sql
INSERT INTO users (username, email, password, first_name, last_name, role, is_enabled, created_at, updated_at)
VALUES ('admin', 'admin@petmanagement.com', '$2a$10$YourBCryptEncodedPassword', 'Admin', 'User', 'ADMIN', true, NOW(), NOW());
```

4. **Run Backend**
```bash
cd backend
mvn spring-boot:run
```

### Frontend Setup

1. **Install Dependencies**
```bash
cd frontend
npm install
```

2. **Run Development Server**
```bash
npm run dev
```

3. **Access Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration (USER role only)
- `POST /api/auth/refresh` - Refresh access token

### Pets
- `GET /api/pets` - Get user's pets
- `GET /api/pets/{id}` - Get pet by ID
- `POST /api/pets` - Create pet
- `PUT /api/pets/{id}` - Update pet
- `DELETE /api/pets/{id}` - Delete pet

### Appointments
- `GET /api/appointments/doctors` - Get available doctors
- `GET /api/appointments/user` - Get user's appointments
- `POST /api/appointments` - Book appointment
- `PUT /api/appointments/{id}/status` - Update status

### Vaccinations
- `GET /api/vaccinations` - Get user's vaccinations
- `GET /api/vaccinations/due-soon` - Get due vaccinations
- `POST /api/vaccinations` - Add vaccination

### Expenses
- `GET /api/expenses` - Get user's expenses
- `POST /api/expenses` - Add expense
- `GET /api/expenses/pet/{id}/summary/monthly` - Monthly summary

### Adoption
- `GET /api/adoption/approved` - Get approved posts (public)
- `POST /api/adoption` - Submit adoption post
- `PUT /api/adoption/{id}/approve` - Approve post (Admin)

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/users` - Get all users
- `POST /api/admin/staff` - Create doctor/trainer
- `DELETE /api/admin/users/{id}` - Delete user

## 👥 User Roles

| Role | Permissions |
|------|-------------|
| **ADMIN** | Full system access, manage users, approve adoption posts, manage products |
| **USER** | Manage pets, book appointments, track expenses, submit adoption posts |
| **DOCTOR** | View and manage appointments |
| **TRAINER** | Create and manage training packages |

## 📝 Notes

- Only USER role can self-register
- ADMIN must be created manually in database
- JWT tokens expire after 15 minutes (access) and 7 days (refresh)
- File uploads support images up to 10MB

## 📄 License

This project is created for ITP (Information Technology Project) coursework.
