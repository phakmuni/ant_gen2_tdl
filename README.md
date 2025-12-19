# 📝 To-Do List

🚀 **NestJS Backend Setup & Deployment Guide**

---

## 🧩 Table of Contents

1. ⚙️ [Requirements](#-requirements)
2. 🛠 [Installation](#-installation)
3. 🧰 [Environment Configuration](#-environment-configuration)
4. 🚀 [Running the Application](#-running-the-application)
5. 📦 [Seeder](#-seeder)
6. 🌱 [Project Overview & Features](#-project-overview--features)

---

## ⚙️ Requirements

Before you begin, ensure your environment includes:

* **Node.js** (v18 or higher)
* **npm**
* **Git**
* **MySQL** (running and configured)
* **NestJS CLI** (optional, for development)

```bash
npm i -g @nestjs/cli
```

---

## 🛠 Installation

Clone this repository and install dependencies:

```bash
# Clone the project
git clone https://github.com/phakmuni/ant_gen2_tdl

# Move into the project directory
cd ant-g2

# Install dependencies
npm install
```

---

## 🧰 Environment Configuration

Create a `.env` file in the project root directory and add the following:

```bash

# SERVER
NODE_ENV=production

HOST=http://localhost:3000/api/v1
PORT=3000
PREFIX=/api
VERSION=/v1

# DATABAS
DB_TYPE=mysql
DB_NAME=ant_g2_tdl
DB_PASSWORD=your-db-password
DB_USER=root
DB_PORT=your-db-port
DB_HOST=localhost


# ADMIN
DEFAULT_FULLNAME="ADMIN SYSTEM"
DEFAULT_EMAIL=antadmin.tdl@gmail.com
DEFAULT_ADMIN_PASSWORD="AntAdmin@!99"


# JWT
SECRET_KEY=Your-secret-key


#SMTP
SMTP_HOST=host
SMTP_PORT=you-smtp-port
SMTP_MAIL=your-mail
SMTP_PASSWORD=your-password

# File validation
MAX_REPORT_FILES=3
MAX_FILE_SIZE=3145728


# FRONTEND
FRONTEND_URL=http://localhost:5173

```

> 💡 **Note:**
>
> * Update `DB_PASSWORD`, `FRONTEND_URL`, and `SECRET_KEY` with your own values.


---

## 🚀 Running the Application

Build and run in production mode:

```bash
# Build the project
npm run build

# Run in production mode
npm run start:prod
```

Once running, the API will be available at:
👉 **[http://localhost:3000/api/v1](http://localhost:3000/api/v1)**

---

## 📦 Seeder

The project includes a **UserAdminSeeder** that creates a default admin account automatically if it doesn’t exist.

### Default admin credentials (from `.env`):

* **Email:** `antadmin.tdl@gmail.com`
* **Password:** `AntAdmin@!99`

You can change these values in your `.env` before running the seeder.

To run the seeder:

```bash
npm run seed
```

---

## 🌱 Project Overview & Features

### Project Overview

The **To-Do List** application allows users to manage notes efficiently.

It supports:

* Creating notes
* Toggling completed notes
* Searching and filtering notes

---

### User Roles

🔹 **Normal User**

* Register, login, logout
* Create, update, delete notes
* Filter and search notes

🔹 **Admin**

* View list of users
* Manage / deactivate user accounts

---

### Core Features

#### 🔹 Authentication

* Register (email, username, password)
* Login
* Logout
* Change password
* Change email
* Forget password (OTP verification)
* View / Edit / Delete profile

#### 🔹 Note Management

* Create Note

  * Fields: `title`, rich-text description (Text Editor)
* Update Note
* Toggle note status (complete / incomplete)
* Delete Note
* Get Note by ID
* Get all Notes with optional filters:

  * Filter by `isComplete`
  * Search by `title`
  * Sort by `createdAt`, `updatedAt`, `title`

#### 🔹 User Management (Admin)

* View list of users
* Manage / deactivate user accounts

---
