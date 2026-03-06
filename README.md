# 🏥 CareConnect — Cloud-Native Medical Platform

![ASP.NET Core](https://img.shields.io/badge/ASP.NET%20Core-9.0-512BD4?style=flat&logo=dotnet)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![Azure](https://img.shields.io/badge/Microsoft%20Azure-Cloud-0078D4?style=flat&logo=microsoftazure)
![Entity Framework](https://img.shields.io/badge/Entity%20Framework-Core-512BD4?style=flat&logo=dotnet)
![JWT](https://img.shields.io/badge/Auth-JWT%20%2B%20OAuth2-000000?style=flat&logo=jsonwebtokens)
![SendGrid](https://img.shields.io/badge/Email-SendGrid-1A82E2?style=flat&logo=sendgrid)
![License](https://img.shields.io/badge/License-Academic-green?style=flat)

> A secure, cloud-native medical platform demonstrating full-stack development, cloud architecture, role-based access control, OAuth 2.0 authentication, and serverless email automation. Built as a final year academic project at Cardiff Metropolitan University.

---

## 🌐 Live Demo

| Service | URL |
|---|---|
| **Frontend** | [https://thankful-moss-0dc357303.2.azurestaticapps.net](https://thankful-moss-0dc357303.2.azurestaticapps.net) |
| **API** | [https://careconnect-api-erfydubrckd7e0gk.ukwest-01.azurewebsites.net](https://careconnect-api-erfydubrckd7e0gk.ukwest-01.azurewebsites.net) |

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [User Roles](#user-roles)
- [API Endpoints](#api-endpoints)
- [Azure Functions](#azure-functions)
- [Microsoft OAuth 2.0](#microsoft-oauth-20)
- [Security](#security)
- [CI/CD Pipeline](#cicd-pipeline)
- [Getting Started](#getting-started)
- [Academic Disclaimer](#academic-disclaimer)

---

## 📌 Overview

CareConnect is a full-stack cloud-native healthcare platform that demonstrates how modern cloud computing can improve accessibility, organisation, and efficiency in healthcare services. The platform allows doctors and patients to interact through a secure digital system supporting appointment booking, medical record management, and automated email notifications.

The project showcases:
- **Secure system design** with JWT authentication and OAuth 2.0
- **Cloud integration** using Microsoft Azure services
- **Serverless architecture** with Azure Functions
- **Role-based access control** across three distinct user roles
- **GDPR-compliant** data handling with synthetic/fictional data only
- **CI/CD pipelines** via GitHub Actions for automated deployment

---

## ✨ Features

### Patient
- Register and login (email/password or Microsoft account)
- Book appointments by medical specialization
- View, reschedule, and cancel appointments
- View medical records and prescriptions
- Manage allergies (CRUD) with severity levels
- Update personal and medical profile (NHS number, blood type, emergency contact)
- Change password

### Doctor
- Secure login with admin-created credentials
- View and manage all assigned appointments
- Add notes and mark appointments as complete
- Create, edit, and delete medical records
- Add prescriptions to medical records
- View full patient profiles (overview, records, allergies)
- Update professional profile (GMC number, specialization, qualifications)

### Admin
- System statistics dashboard
- Create and manage doctor accounts (triggers automated welcome email)
- Create and manage patient accounts
- Full oversight of platform users

---

## 🔧 Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| ASP.NET Core 9 | RESTful Web API |
| Entity Framework Core | ORM and database management |
| ASP.NET Identity | User management and password hashing |
| JWT Bearer Tokens | Stateless authentication |
| Microsoft OAuth 2.0 | Social login via Microsoft accounts |

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| React Router | Client-side routing |
| Axios | HTTP client with JWT interceptor |
| Tailwind CSS | Utility-first styling |
| Lucide React | Icon library |

### Cloud & Infrastructure
| Service | Purpose |
|---|---|
| Azure App Service | Hosts the ASP.NET Core API |
| Azure Static Web Apps | Hosts the React frontend (free tier) |
| Azure SQL Database | Production relational database |
| Azure Functions | Serverless email automation |
| Azure Blob Storage | Timer state management for Functions |
| Microsoft Entra ID | OAuth 2.0 identity provider |
| SendGrid | Transactional email delivery |
| Application Insights | Monitoring and logging |
| GitHub Actions | CI/CD pipelines for all three projects |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     React Frontend                       │
│              Azure Static Web Apps (Free)                │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS + JWT
┌──────────────────────▼──────────────────────────────────┐
│                  ASP.NET Core API                        │
│                 Azure App Service                        │
│   AuthController │ PatientController │ DoctorController  │
│   AppointmentController │ MedicalRecordController        │
│   AdminController                                        │
└──────┬───────────────────────────────────┬──────────────┘
       │                                   │
┌──────▼──────┐                   ┌────────▼────────┐
│  Azure SQL  │                   │ Azure Functions  │
│  Database   │                   │                  │
│             │                   │ DoctorWelcome    │
│  Patients   │                   │ Email (HTTP)     │
│  Doctors    │                   │                  │
│  Appts      │                   │ Appointment      │
│  Records    │◄──────────────────│ Reminders (Timer)│
│  etc.       │                   └────────┬─────────┘
└─────────────┘                            │
                                  ┌────────▼─────────┐
                                  │    SendGrid       │
                                  │  Email Delivery   │
                                  └──────────────────┘
```

---

## 👥 User Roles

| Role | Access | Created By |
|---|---|---|
| **Patient** | Own profile, appointments, records, allergies | Self-registration or Microsoft OAuth |
| **Doctor** | Assigned patients, appointments, medical records | Admin only |
| **Admin** | All users, system statistics | Pre-seeded on startup |

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Patient self-registration | Public |
| POST | `/api/auth/login` | Login for all roles | Public |
| GET | `/api/auth/microsoft-login` | Initiate Microsoft OAuth | Public |
| GET | `/api/auth/microsoft-callback` | Handle OAuth callback | Public |

### Patient
| Method | Endpoint | Description |
|---|---|---|
| GET/PUT | `/api/patient/profile` | View/update own profile |
| GET/POST/PUT/DELETE | `/api/patient/allergy` | Manage allergies |

### Doctor
| Method | Endpoint | Description |
|---|---|---|
| GET/PUT | `/api/doctor/profile` | View/update own profile |
| GET | `/api/doctor/specializations` | Get all specializations |
| GET | `/api/doctor/patients/{id}` | View patient profile |
| GET | `/api/doctor/patients/{id}/allergies` | View patient allergies |

### Appointments
| Method | Endpoint | Description |
|---|---|---|
| GET/POST | `/api/appointment` | Get all / create appointment |
| GET/PUT/DELETE | `/api/appointment/{id}` | View / update / cancel |

### Medical Records
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/medicalrecord` | Create record (doctor only) |
| GET | `/api/medicalrecord/patient/{patientId}` | Get patient records |
| GET/PUT/DELETE | `/api/medicalrecord/{id}` | View / edit / delete |
| GET | `/api/medicalrecord/my-records` | Doctor's created records |
| GET | `/api/medicalrecord/search/patient/{patientId}` | Search records |
| POST/GET | `/api/medicalrecord/{recordId}/prescriptions` | Add / view prescriptions |

### Admin
| Method | Endpoint | Description |
|---|---|---|
| POST/GET/DELETE | `/api/admin/doctors` | Manage doctors |
| GET/DELETE | `/api/admin/patients` | Manage patients |
| GET | `/api/admin/stats` | Dashboard statistics |

---

## ⚡ Azure Functions

Two serverless functions handle automated email notifications:

### 1. DoctorWelcomeEmail
- **Trigger:** HTTP POST
- **Called by:** AdminService when a new doctor account is created
- **Purpose:** Sends a styled HTML welcome email containing login credentials to the newly created doctor
- **Error handling:** Email failure never blocks doctor creation

### 2. AppointmentReminders
- **Trigger:** Timer — runs daily at 8:00 AM UTC (`0 0 8 * * *`)
- **Purpose:** Queries the database for tomorrow's scheduled appointments and sends reminder emails to each patient
- **Email includes:** Date/time, doctor name, specialization, appointment type, reason for visit
- **Error handling:** One failed email never stops remaining emails from sending

---

## 🔐 Microsoft OAuth 2.0

Patients can sign in using any Microsoft account (personal or organisational) via the "Sign in with Microsoft" button.

**Flow:**
1. Patient clicks "Sign in with Microsoft"
2. React redirects to `GET /api/auth/microsoft-login`
3. API challenges with Microsoft OAuth scheme (Azure Entra ID)
4. Patient authenticates on Microsoft's login page
5. Microsoft redirects back to `/signin-microsoft` (handled by ASP.NET middleware)
6. Middleware calls `GET /api/auth/microsoft-callback`
7. Controller extracts claims (email, name) from Microsoft
8. AuthService finds existing patient or creates new account automatically
9. JWT token issued and patient redirected to `/oauth-callback?token=...`
10. React extracts token from URL and logs patient in

> Doctors and admins use email/password only — OAuth is restricted to patients for security reasons.

---

## 🔒 Security

- JWT authentication with configurable expiry and clock skew
- Role-based access control on every endpoint
- Password hashing via ASP.NET Identity (PBKDF2)
- HTTPS enforced across all services
- CORS restricted to known frontend URLs only
- OAuth secrets and connection strings stored in Azure environment variables
- Microsoft Entra ID app registration with specific redirect URIs

---

## 🚀 CI/CD Pipeline

All three projects are connected to GitHub with automated deployment pipelines:

| Project | Workflow File | Deploys To |
|---|---|---|
| Frontend | `azure-static-web-apps-thankful-moss.yml` | Azure Static Web Apps |
| API | `main_careconnect-api.yml` | Azure App Service |
| Functions | `main_careconnect-functions.yml` | Azure Function App |

Every push to the `main` branch automatically triggers a build and deployment for all three projects.

---

## 🛠️ Getting Started

### Prerequisites
- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)
- [Visual Studio 2022](https://visualstudio.microsoft.com/) or VS Code
- [Azure SQL Database](https://azure.microsoft.com/en-gb/products/azure-sql/database/)
- [SendGrid Account](https://sendgrid.com/) (free tier)
- [Microsoft Azure Account](https://azure.microsoft.com/)

### Clone the Repository
```bash
git clone https://github.com/Beba03/CareConnect.git
cd CareConnect
```

### Backend Setup
```bash
cd CareConnect.Api
# Copy example config and fill in your values
cp appsettings.example.json appsettings.json
# Run database migrations
dotnet ef database update
# Start the API
dotnet run
```

### Frontend Setup
```bash
cd CareConnect.Client
# Install dependencies
npm install
# Create environment file
cp .env.example .env
# Add your API URL to .env
# Start the dev server
npm run dev
```

### Azure Functions Setup
```bash
cd CareConnect.Functions
# Copy example settings
cp local.settings.example.json local.settings.json
# Fill in SendGrid and database connection string
# Start functions locally
func start
```

---

---

## ⚠️ Academic Disclaimer

This project was developed as a final year academic submission for **CST6000 Development Project** at **Cardiff Metropolitan University (2025-2026)**.

- This is **not** a real medical system and should not be used for clinical purposes
- **No real patient data** is collected or stored — all data is synthetic and fictional
- The platform is designed to demonstrate software engineering, cloud computing, and security concepts
- All GDPR principles are applied to synthetic data as a demonstration of best practices

---

## 👤 Author

**Mohamed ElFeky**
- GitHub: [@Beba03](https://github.com/Beba03)
