# 💬 Talkible (Wait for production)
Talkibe is a **real-time messaging platform** that allows users to communicate seamlessly through **private and group chats** 👥. It offers **media sharing 📁, user authentication 🔒, and live user tracking 🎯** to enhance the messaging experience. The platform is built with modern web technologies to ensure a fast ⚡, secure 🔐, and interactive 💡 experience.

---

## 📝 About the Project
Demo: https://drive.google.com/file/d/1Qx3J53pHfUWj5xV-MvOkHCfOQDivy1ja/view?usp=sharing


Talkible is designed for users who want **instant ⚡, reliable 🛡️, and feature-rich 🎁** communication. It includes functionalities such as **real-time messaging 💬, private/group chats 👥, multimedia sharing 🖼️🎥📄, and presence tracking 🎯**. The project was built as part of a learning initiative 📚of GraphQL API and subscription to enhance **full-stack development 🛠️** skills

---

## 🧑‍💻 Tech Stack ⚙️
[![My Skills](https://skillicons.dev/icons?i=react,nestjs,graphql,prisma,postgres,redis,docker,git)](https://skillicons.dev)

- **React JS** ⚛️: A JavaScript library for building dynamic and interactive user interfaces
- **Apollo Client** 📡: a comprehensive state management library for JavaScript. It enables you to manage both local and remote data with GraphQL.
- **Nest JS** 🏗️: A progressive Node.js framework for building scalable backend services  
- **GraphQL** 📊: A query language for APIs that enables efficient data fetching  
- **Prisma** 🗃️: A modern database ORM that simplifies database interactions  
- **PostgreSQL** 🐘: A powerful, open-source relational database system  
- **Redis** 🧠: An in-memory data store used for caching and real-time updates  
- **Docker** 🐳: A containerization tool for consistent deployments  
- **Git** 🔀: Version control system for tracking code changes  

---

## ✨ Features 🌟

- 💬 **Real-Time Messaging** - Instant message delivery ⚡  
- 🔐 **User Authentication** - Secure login with email/password 🔒  
- 👥 **Private & Group Chats** – 1:1 or group conversations 🏠  
- 🖼️ **Media Sharing** – Images, videos, documents 📁  
- 🎯 **Live User Tracking** – See who's online 🟢  
- ✍️ **Typing Indicator** – Visual feedback when others type 🖋️  
- 🚪 **System Messages** – Join/leave notifications 🔔  
- 🔄 **Live Updates** – Instant user list changes ♻️  
- 👤 **Profile Management** – Update avatar/info 🖊️  
- 📱 **Responsive Design** – Works on all devices 🖥️📱  

---
  
## 🛠️ Getting Started 🚀

### 📋 Prerequisites
- 🐳 Docker ([Install Guide](https://docs.docker.com/get-docker/))  
- ⬢ Node.js v16+ ([Download](https://nodejs.org/))  
- 📦 npm/yarn  

---

## 🚀 Setup Guide
**1️⃣ Clone repository**
```bash
# Clone repository
git clone https://github.com/qthais/Talkible.git
```
## 🖥️ Backend Setup ⚙️

#### Step-by-Step:

**1️⃣ Start containers (PostgreSQL + Redis)**
```bash
cd Talkible/backend
docker-compose up -d
```
**2️⃣ Install dependencies**
```bash
npm install --legacy-peer-deps
```
**3️⃣ Database setup**
```bash
npx prisma generate
npx prisma db push
```
**4️⃣ Start server**
```bash
npm run start:dev
```
## 📱 Frontend Setup

### Prerequisites
- Node.js v16 or later installed
- Backend server running (see Backend Setup section)
- Modern web browser (Chrome, Firefox, or Edge recommended)

### Installation Steps

**1️⃣ Navigate to frontend directory**
```bash
cd Talkible/frontend
```
**2️⃣ Install dependencies**
```bash
npm install 
```
**3️⃣ Start**
```bash
npm run dev
```
