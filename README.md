# 🏟️ Court Booking System (API)

A robust, real-time enterprise-grade backend system for managing sports courts and reservations. Built using **.NET 9**, adhering strictly to **Clean Architecture** and **CQRS (Command Query Responsibility Segregation)** patterns to ensure scalability, maintainability, and high performance.

---

## 🏗️ Architecture & Patterns

The project is structured into 4 distinct layers following Clean Architecture principles:
* **Domain:** Contains core entities, value objects, and business logic (e.g., `Court`, `Booking`, `SystemUser`).
* **Application:** Holds the business use cases, mapped explicitly through **MediatR** handles, commands, and queries, with strict validation using **FluentValidation**.
* **Infrastructure:** Manages data access via **Entity Framework Core (SQL Server)**, JWT Token Generation, SMS Fake services, and Real-time communication.
* **API (Presentation):** Exposed RESTful endpoints fully documented with .NET 9 OpenApi/Swagger tools.

### Key Technical Features:
* **CQRS Pattern:** Complete separation of Write operations (Commands) and Read operations (Queries) using **MediatR**.
* **Real-time Infrastructure:** Integrated **SignalR Hubs** to broadcast field availability updates to connected clients instantaneously.
* **Database Seeding & Automigrations:** Fully automated relational database updates and admin data seeding on application startup.

---

## 🔒 Security & Authentication

The system implements strict **Role-Based Access Control (RBAC)** powered by **JWT (JSON Web Tokens) Bearer Authentication**:
* **Public Access:** Critical client operations (Browsing fields, creating reservations) bypass token verification.
* **Admin Access:** Management and dashboard operations are tightly locked down behind administrative claims.

---

## 🚀 Core API Endpoints

### 🔐 Authentication Module
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/Auth/Login` | Public | Validates admin credentials and issues a secure JWT Bearer Token. |

### 📅 Bookings Module
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/Bookings` | Public | Creates a new court reservation (Anonymous client-facing). |
| `GET` | `/api/Bookings/available-slots` | Public | Fetches real-time available time frames for courts. |
| `GET` | `/api/Bookings/admin/dashboard-stats` | Admin Only | Retrieves financial and operational performance statistics. |
| `GET` | `/api/Bookings/Pending-Bookings` | Admin Only | Lists all reservations awaiting approval/review. |
| `PUT` | `/api/Bookings/confirm/{id}` | Admin Only | Confirms a pending court booking. |

### 🏟️ Courts Module
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/Courts` | Admin Only | Registers a new sports court into the system. |
| `PUT` | `/api/Courts/Update-price` | Admin Only | Modifies the per-hour rental pricing of a specific court. |
| `PUT` | `/api/Courts/Toggle-status` | Admin Only | Activates or temporarily deactivates a court (e.g., maintenance). |
| `GET` | `/api/Courts/admin/courts/{id}/performance` | Admin Only | Analyzes utilization rates and popularity of a court. |

---

## 🛠️ Tech Stack & Packages

* **Runtime:** .NET 9.0 (C# 13)
* **Database:** Microsoft SQL Server
* **ORM:** Entity Framework Core 9.0
* **Mediator:** MediatR
* **Security:** System.IdentityModel.Tokens.Jwt, BCrypt.Net-Next
* **Real-Time:** Microsoft.AspNetCore.SignalR
* **Documentation:** Microsoft.AspNetCore.OpenApi

---

## ⚙️ Setup & Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/tuhazem/CourtBookingSystem.git](https://github.com/tuhazem/CourtBookingSystem.git)
