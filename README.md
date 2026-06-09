# 🏟️ Court Booking System (API)

A robust, real-time enterprise-grade backend system for managing sports courts and reservations. Built using **.NET 9 / .NET 8**, adhering strictly to **Clean Architecture** and **CQRS** (Command Query Responsibility Segregation) patterns to ensure scalability, maintainability, and production-ready performance.

The system is fully **Containerized using Docker**, production-configured, and continuously monitored using an automated **GitHub Actions CI Pipeline**.

---

## 🏗️ Architecture & Patterns

The project is structured into 4 distinct layers following Domain-Driven Design and Clean Architecture principles:

*   **Domain:** Contains core entities, value objects, and business logic (e.g., `Court`, `Booking`, `SystemUser`).
*   **Application:** Holds business use cases, mapped explicitly through **MediatR** handlers, commands, and queries, with strict input validation using **FluentValidation**.
*   **Infrastructure:** Manages data access via **Entity Framework Core (SQL Server)**, JWT Token Generation, SMS/Notification Simulation, and Real-time communications.
*   **API (Presentation):** Exposed RESTful endpoints, configured with **CORS** for frontend integration and fully documented using OpenApi/Swagger tools.

### Key Technical Features:
*   **CQRS Pattern:** Complete separation of Write operations (Commands) and Read operations (Queries) using MediatR.
*   **Real-time Infrastructure:** Integrated **SignalR Hubs** to broadcast field availability updates to clients instantaneously.
*   **Automated DevOps & Production-Ready:** Includes healthchecks, automatic migrations, database seeding on startup, and multi-stage Docker orchestration.
*   **CI Pipeline:** Powered by **GitHub Actions** to automate builds, testing, and Docker validation on every push.

---

## 🐋 Docker & Local Environment Setup

The easiest way for Frontend developers or reviewers to run the entire backend infrastructure (API + SQL Server Database) locally with **zero prerequisites** (No Visual Studio, SDKs, or local SQL server installations required):

### Prerequisites:
*   Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Spin Up the System:
1.  Clone the repository:
    ```bash
    git clone https://github.com/tuhazem/CourtBookingSystem.git
    cd CourtBookingSystem
    ```

2.  Run the Docker Compose orchestration:
    ```bash
    docker-compose up --build
    ```

3.  Once running, the API handles migrations and database seeding automatically. Access the environment at:
    - Swagger API Documentation: http://localhost:5000/swagger
    - API Base URL: http://localhost:5000/api

---

## 🔒 Security, Authentication & Frontend Integration

*   **Authentication:** Strictly implements Role-Based Access Control (RBAC) powered by JWT Bearer Tokens.
*   **CORS Enabled:** Cross-Origin Resource Sharing is completely enabled globally (AllowAnyOrigin, AllowAnyHeader, AllowAnyMethod) making it instantly ready to integrate with any frontend client (Angular, React, Vue) running on local host ports (e.g., localhost:4200 or 3000).

---

## 🚀 Core API Endpoints

### 🔐 Authentication Module
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/Auth/Login` | Public | Validates credentials and issues a secure JWT Bearer Token. |

### 📅 Bookings Module
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/Bookings` | Public | Creates a new court reservation (Client-facing). |
| `GET` | `/api/Bookings/available-slots` | Public | Fetches real-time available time frames for courts. |
| `GET` | `/api/Bookings/admin/dashboard-stats` | Admin Only | Retrieves financial and operational performance statistics. |
| `GET` | `/api/Bookings/Pending-Bookings` | Admin Only | Lists all reservations awaiting administrative approval. |
| `PUT` | `/api/Bookings/confirm/{id}` | Admin Only | Confirms a pending court booking. |

### 🏟️ Courts Module
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/Courts` | Admin Only | Registers a new sports court into the database. |
| `PUT` | `/api/Courts/Update-price` | Admin Only | Modifies the per-hour rental pricing of a specific court. |
| `PUT` | `/api/Courts/Toggle-status` | Admin Only | Activates or temporarily deactivates a court (e.g., maintenance). |
| `GET` | `/api/Courts/admin/courts/{id}/performance` | Admin Only | Analyzes utilization rates and popularity of a court. |

---

## 🛠️ Tech Stack & Packages

*   **Runtime:** .NET Core / C#
*   **Database:** Microsoft SQL Server (Containerized)
*   **ORM:** Entity Framework Core
*   **Mediator:** MediatR
*   **Security:** System.IdentityModel.Tokens.Jwt, BCrypt.Net-Next
*   **Real-Time:** Microsoft.AspNetCore.SignalR
*   **CI/CD:** GitHub Actions
