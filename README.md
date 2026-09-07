# 🏟️ Malaabna - Court Booking System

<p align="center">
  <img src="frontend/public/images/logo.png" alt="Malaabna Logo" width="200"/>
</p>

<p align="center">
  <strong>ملاعبنا - منصة حجز الملاعب الرياضية</strong>
</p>

<p align="center">
  <a href="https://malaabna-app.vercel.app">
    <img src="https://img.shields.io/badge/Live%20Demo-Visit%20Site-brightgreen?style=for-the-badge" alt="Live Demo"/>
  </a>
  <img src="https://img.shields.io/badge/Performance-100%2F100-success?style=for-the-badge&logo=lighthouse" alt="Lighthouse Score"/>
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/.NET-9-512BD4?style=for-the-badge&logo=dotnet" alt=".NET"/>
</p>

> **Live Demo:** [https://malaabna-app.vercel.app](https://malaabna-app.vercel.app)

A full-stack, production-ready sports court booking platform featuring real-time availability updates, secure authentication, and an optimized user experience. This project demonstrates modern web development practices across the entire stack.

## 👥 Team

This is a collaborative portfolio project showcasing full-stack development expertise:

- **Backend Development:** [@tuhazem](https://github.com/tuhazem) - ASP.NET Core API with Clean Architecture
- **Frontend Development:** [@abdullah012039](https://github.com/abdullah012039) - Next.js 15 with performance optimization

---

## 🎯 Project Overview

**Malaabna** (ملاعبنا - "Our Playgrounds") is an enterprise-grade booking system for sports facilities, designed to handle high-traffic scenarios with real-time updates and optimized performance. The platform combines a robust .NET backend following Clean Architecture principles with a lightning-fast Next.js frontend achieving perfect Lighthouse scores.

### Key Achievements

**Backend:**
- ✅ Clean Architecture with CQRS pattern
- ✅ Real-time SignalR communication
- ✅ JWT-based authentication with RBAC
- ✅ Dockerized deployment pipeline
- ✅ Automated CI/CD with GitHub Actions

**Frontend:**
- ✅ **100/100/100/100** Lighthouse scores (Performance/Accessibility/Best Practices/SEO)
- ✅ Core Web Vitals: LCP 1.1s, FCP 1.0s, CLS 0
- ✅ Next.js 15 with App Router and React Server Components
- ✅ Optimized font loading (80KB saved)
- ✅ WCAG AA accessibility compliance
- ✅ Production deployment on Vercel

---

## 🏗️ Architecture & Technical Stack

### Backend Architecture (.NET 9)

The backend follows **Clean Architecture** and **CQRS** patterns with strict separation of concerns:

*   **Domain:** Core business entities, value objects, and domain logic (`Court`, `Booking`, `SystemUser`)
*   **Application:** CQRS handlers via **MediatR**, with **FluentValidation** for input validation
*   **Infrastructure:** **Entity Framework Core** with SQL Server, JWT generation, SignalR for real-time updates
*   **API Layer:** RESTful endpoints with Swagger documentation, CORS-secured for frontend integration

**Key Backend Features:**
- 🔄 **CQRS Pattern:** Complete command/query separation with MediatR
- ⚡ **Real-time Updates:** SignalR hubs broadcasting availability changes
- 🐳 **Docker Orchestration:** Multi-stage builds with automated migrations
- 🔒 **Security:** JWT authentication with role-based access control
- 🚀 **CI/CD:** GitHub Actions pipeline for automated testing and deployment

### Frontend Architecture (Next.js 15)

Modern React architecture with server-side rendering and aggressive performance optimization:

**Tech Stack:**
- ⚛️ **Next.js 15:** App Router with React Server Components
- 🎨 **Styling:** CSS Modules with mobile-first responsive design
- 📊 **State Management:** React Context + localStorage persistence
- 🚀 **Deployment:** Vercel with automatic preview deployments
- 📱 **PWA Support:** Web app manifest for mobile installation

**Performance Optimizations:**
- ✅ Next.js Image component for automatic optimization
- ✅ Font subsetting (Cairo 700/800, Chivo 900 only)
- ✅ Code splitting and lazy loading
- ✅ Server Components for reduced JavaScript bundle
- ✅ Static generation for marketing pages

---

## 🎨 Features

### User Features
- 🔍 **Browse Courts:** View available sports facilities with detailed information
- 📅 **Real-time Booking:** Check availability and book time slots instantly
- 📱 **My Bookings:** Track reservation history and status
- 🌐 **RTL Support:** Full Arabic language support with proper text direction
- 📲 **Mobile Responsive:** Optimized for all screen sizes (320px - 4K)

### Admin Features
- 📊 **Dashboard Analytics:** Revenue tracking and booking statistics
- ⚙️ **Court Management:** Add, update, and manage court inventory
- ✅ **Booking Approvals:** Review and confirm pending reservations
- 💰 **Dynamic Pricing:** Adjust hourly rates per court
- 🔧 **Status Control:** Toggle court availability (maintenance mode)

---

## 🚀 Quick Start

### Backend Setup (Docker - Recommended)

Run the entire backend with **zero local dependencies** (no Visual Studio, .NET SDK, or SQL Server required):

**Prerequisites:**
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

**Steps:**
```bash
# Clone the repository
git clone https://github.com/tuhazem/CourtBookingSystem.git
cd CourtBookingSystem

# Start all services (API + SQL Server)
docker-compose up --build

# API is now running at:
# - Swagger UI: http://localhost:5000/swagger
# - Base URL: http://localhost:5000/api
```

The container automatically handles:
- ✅ Database creation and migrations
- ✅ Initial data seeding
- ✅ Health checks and monitoring

### Frontend Setup (Local Development)

**Prerequisites:**
- Node.js 18+ and npm/yarn

**Steps:**
```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Production build
npm run build
npm start
```

**Environment Variables:**
Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 🔐 API Authentication

All protected endpoints require a JWT Bearer token obtained via login:

**Login Request:**
```bash
POST /api/Auth/Login
Content-Type: application/json

{
  "username": "admin",
  "password": "Admin123!"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiration": "2024-12-31T23:59:59Z",
  "role": "Admin"
}
```

**Using the Token:**
```bash
GET /api/Bookings/admin/dashboard-stats
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

## 🚀 Core API Endpoints

### 🔐 Authentication
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/Auth/Login` | Public | Authenticate and receive JWT token |

### 📅 Bookings
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/Bookings` | Public | Create new court reservation |
| `GET` | `/api/Bookings/available-slots` | Public | Get real-time available time slots |
| `GET` | `/api/Bookings/admin/dashboard-stats` | Admin | Retrieve booking analytics and revenue |
| `GET` | `/api/Bookings/Pending-Bookings` | Admin | List pending reservations |
| `PUT` | `/api/Bookings/confirm/{id}` | Admin | Confirm booking request |

### 🏟️ Courts Management
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/Courts` | Admin | Register new sports court |
| `PUT` | `/api/Courts/Update-price` | Admin | Update court hourly rate |
| `PUT` | `/api/Courts/Toggle-status` | Admin | Enable/disable court availability |
| `GET` | `/api/Courts/admin/courts/{id}/performance` | Admin | View court utilization metrics |

Full API documentation available at `/swagger` when running locally.

---

## 📊 Performance Metrics

### Lighthouse Scores (Production)
```
Performance:      100 / 100  ⚡
Accessibility:    100 / 100  ♿
Best Practices:   100 / 100  ✅
SEO:              100 / 100  🔍
```

### Core Web Vitals
- **First Contentful Paint (FCP):** 1.0s
- **Largest Contentful Paint (LCP):** 1.1s
- **Cumulative Layout Shift (CLS):** 0
- **Speed Index:** 1.3s

### Bundle Optimization
- Font loading optimized: **80KB saved** (3 weights instead of 9)
- Code splitting with React Server Components
- Optimized images with Next.js Image component
- Zero layout shift with proper sizing

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| .NET 9 / C# | Runtime framework |
| Entity Framework Core | ORM and database access |
| SQL Server | Relational database |
| MediatR | CQRS implementation |
| FluentValidation | Input validation |
| SignalR | Real-time communication |
| JWT | Authentication tokens |
| Docker | Containerization |
| GitHub Actions | CI/CD pipeline |

### Frontend
| Technology | Purpose |
|------------|---------|
| Next.js 15 | React framework with App Router |
| React 19 | UI library |
| TypeScript | Type safety |
| CSS Modules | Scoped styling |
| Vercel | Hosting and deployment |

---

## 🔒 Security Features

- ✅ **JWT Authentication:** Secure token-based authentication with expiration
- ✅ **Role-Based Access Control (RBAC):** Admin vs. User permissions
- ✅ **CORS Configuration:** Restricted to production frontend origin only
- ✅ **Password Hashing:** BCrypt encryption for user credentials
- ✅ **Input Validation:** FluentValidation rules on all endpoints
- ✅ **SQL Injection Prevention:** Parameterized queries via EF Core

---

## 📁 Project Structure

```
CourtBookingSystem/
├── CourtBookingSystem.API/          # Presentation layer
│   ├── Controllers/                 # API endpoints
│   ├── Hubs/                        # SignalR hubs
│   └── Program.cs                   # Application entry point
├── CourtBookingSystem.Application/  # Business logic layer
│   ├── Commands/                    # CQRS write operations
│   ├── Queries/                     # CQRS read operations
│   └── Validators/                  # FluentValidation rules
├── CourtBookingSystem.Domain/       # Core domain layer
│   ├── Entities/                    # Domain models
│   └── Interfaces/                  # Repository contracts
├── CourtBookingSystem.Infrastructure/ # Data access layer
│   ├── Data/                        # EF Core context
│   └── Repositories/                # Data access implementations
├── frontend/                        # Next.js application
│   ├── src/
│   │   ├── app/                     # App Router pages
│   │   ├── components/              # React components
│   │   ├── contexts/                # React Context providers
│   │   └── styles/                  # Global styles
│   └── public/                      # Static assets
└── docker-compose.yml               # Container orchestration
```

---

## 🚦 CI/CD Pipeline

Automated GitHub Actions workflow on every push:

1. **Build:** Compile .NET application
2. **Test:** Run unit and integration tests
3. **Docker:** Build and validate container images
4. **Deploy:** Automatic deployment to production (Vercel for frontend)

Frontend deployment preview links generated automatically for every pull request.

---

## 🤝 Contributing

This is a portfolio project, but feedback and suggestions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available for educational purposes.

---

## 🔗 Links

- **Live Demo:** [https://malaabna-app.vercel.app](https://malaabna-app.vercel.app)
- **Backend by:** [@tuhazem](https://github.com/tuhazem)
- **Frontend by:** [@abdullah012039](https://github.com/abdullah012039)
- **API Documentation:** Available at `/swagger` when running locally

---

## 📧 Contact

For questions or collaboration opportunities:

- **Backend:** [GitHub @tuhazem](https://github.com/tuhazem)
- **Frontend:** [GitHub @abdullah012039](https://github.com/abdullah012039)

---

<p align="center">Made with ❤️ by the Malaabna Team</p>
