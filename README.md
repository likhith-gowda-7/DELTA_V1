# DELTA_V1 — Real-Time Chat Application

![Delta Cover](docs/delta_cover_banner.png)

<p align="center">
  <strong>A full-stack, real-time chat application built with the MERN stack and Socket.IO.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Socket.IO-4.8-010101?logo=socket.io&logoColor=white" />
  <img src="https://img.shields.io/badge/Chakra_UI-2.8-319795?logo=chakraui&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-blue" />
</p>

---

## 📖 Project Introduction

**DELTA_V1** is a full-stack, real-time chat application that delivers seamless instant messaging with features like one-on-one conversations, group chats, real-time typing indicators, instant notifications, and a clean dark/light mode interface — all built from scratch using the MERN stack and Socket.IO.

## 🎯 Motivation

This project was built during my learning phase to master full-stack web development. The primary goals were to:

- Understand how to build and structure **RESTful APIs** with Express.js.
- Learn how to implement **secure JWT-based authentication** with password hashing.
- Grasp the complexities of **bidirectional, real-time communication** using WebSockets.
- Build a **responsive, accessible UI** using a modern component library (Chakra UI).

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Secure Authentication** | User signup and login with JWT tokens and bcrypt password hashing |
| 💬 **Real-Time Messaging** | Instant message delivery powered by Socket.IO |
| 👥 **Group Chats** | Create groups, add/remove members, rename groups dynamically |
| ⌨️ **Live Typing Indicators** | See when someone is typing in real-time with animated indicators |
| 🔔 **Instant Notifications** | Red-dot badge alerts and dropdown notifications for unread messages |
| 🔍 **User Search** | Search for registered users by name or email to start a conversation |
| 🌗 **Dark / Light Mode** | Persistent theme toggle with full dark mode support |
| 👤 **User Profiles** | View user profiles with avatar and email information |
| 🛡️ **Protected Routes** | Unauthenticated users are redirected to the login page |

---

## 📸 Screenshots

### Login Page
![Login Page](docs/screenshots/login_page.png)

### Chat Interface — Light Mode
![Chat Light Mode](docs/screenshots/chat_light_mode.png)

### Chat Interface — Dark Mode
![Chat Dark Mode](docs/screenshots/chat_dark_mode.png)

### Group Chat Creation
![Group Chat Modal](docs/screenshots/group_chat_modal.png)

### User Search
![User Search](docs/screenshots/user_search.png)

---

## 🏗️ System Architecture

![Architecture Diagram](docs/architecture_diagram.png)

The application follows a three-tier architecture:

1. **React Frontend** — SPA with Chakra UI, manages state via React Context, communicates with the backend through REST APIs and a persistent WebSocket connection.
2. **Node.js / Express Backend** — Handles HTTP REST endpoints (authentication, CRUD operations) and manages real-time WebSocket connections via Socket.IO.
3. **MongoDB Atlas** — Cloud-hosted NoSQL database storing Users, Chats, and Messages.

---

## 💻 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI component library |
| Chakra UI | Styling, theming, dark mode, accessibility |
| React Router v5 | Client-side routing and protected routes |
| Context API | Global state management (user, chats, notifications) |
| Socket.IO Client | Real-time WebSocket communication |
| Axios | HTTP API calls |
| Framer Motion | Animations |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | JavaScript runtime |
| Express.js | REST API framework |
| Socket.IO | Real-time bidirectional communication server |
| JSON Web Token | Stateless user authentication |
| Bcrypt.js | Secure password hashing |
| Mongoose | MongoDB Object Data Modeling |

### Database
| Technology | Purpose |
|------------|---------|
| MongoDB Atlas | Cloud-hosted NoSQL database |
| Mongoose | Schema definitions and validation |

---

## 🚀 Installation Guide

### Prerequisites
- **Node.js** (v16+)
- **npm** (v8+)
- A **MongoDB Atlas** account (free tier works)

### 1. Clone the repository
```bash
git clone https://github.com/likhith-gowda-7/DELTA_V1
cd DELTA_V1
```

### 2. Install Dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
```

### 4. Run the Application

**Terminal 1 — Backend:**
```bash
npm start
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm start
```

The app will be available at `http://localhost:3000`.

---

## 🔐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Express server port | `5000` |
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `my_super_secret_key` |
| `NODE_ENV` | Environment mode | `development` or `production` |

---

## 📂 Project Structure

```
DELTA_V1/
├── backend/
│   ├── config/             # Database connection (db.js) & token generator
│   ├── controllers/        # Business logic (user, chat, message handlers)
│   ├── middleware/          # JWT auth middleware & error handlers
│   ├── models/             # Mongoose schemas (User, Chat, Message)
│   ├── routes/             # Express route definitions
│   └── server.js           # Entry point: Express + Socket.IO server
├── frontend/
│   ├── public/             # Static assets, favicon, index.html
│   └── src/
│       ├── components/     # Reusable UI components (Chat, Modals, Auth)
│       ├── config/         # Helper functions (ChatLogics.js)
│       ├── Context/        # React Context API (ChatProvider.js)
│       ├── hooks/          # Custom hooks (useThemeColors.js)
│       └── Pages/          # Route-level pages (Homepage, ChatPage)
├── docs/                   # Architecture diagrams and screenshots
├── .env                    # Environment variables (Git-ignored)
├── .gitignore              # Files excluded from version control
├── PROJECT_DOCUMENTATION.md # Deep technical documentation
└── README.md               # This file
```

---

## 🔄 Workflow Explanation

### Authentication Flow
```
User submits credentials
  → Backend hashes password (signup) or compares hash (login)
  → Returns a signed JWT token
  → Frontend saves token to LocalStorage & updates Context state
  → User is redirected to the Chat page
```

### Real-Time Messaging Flow
```
User A types a message and hits Enter
  → Frontend POSTs to /api/message (saved to MongoDB)
  → Backend returns saved message with populated chat.users
  → Frontend emits Socket.IO "new message" event
  → Server broadcasts "message recieved" to all other users in that chat
  → User B's client receives the event
    → If User B has this chat open → message appears instantly
    → If User B is in a different chat → notification badge appears on bell icon
```

### Socket.IO Connection Flow
```
User logs in → Frontend connects to Socket.IO endpoint
  → Client emits "setup" with user data
  → Server joins the socket to a personal room (userId)
  → When user opens a chat → Client emits "join chat" (chatId room)
  → Typing/stop typing events are broadcast within chat rooms
  → On disconnect → Server cleans up the user's room
```

---

## ⚠️ Known Issues

- **Token Storage**: JWT tokens are stored in `localStorage`, which is susceptible to XSS attacks.
- **Socket Authentication**: The WebSocket connection trusts the User ID sent by the client without re-verifying the JWT.
- **No Pagination**: Opening a chat with thousands of messages may cause slow load times.
- **Single Server Only**: WebSocket state is not shared across multiple server instances.

---

## 🔮 Future Improvements

- 🔒 **Security**: Move JWT storage to HttpOnly cookies. Add Socket.IO JWT middleware.
- 📄 **Performance**: Implement infinite scrolling/pagination for chat messages.
- 🟦 **TypeScript**: Migrate codebase to TypeScript for type safety.
- 🔴 **Redis**: Add Redis Adapter for Socket.IO to enable horizontal scaling.
- 📱 **PWA**: Convert to a Progressive Web App for mobile install support.
- 🖼️ **Media Sharing**: Add image/file upload support in messages.

---

## ☁️ Deployment Guide

This project is configured to be hosted as a **single monolithic unit** (Backend serving Frontend). **Render.com** is recommended for free hosting with WebSocket support.

1. Push your code to GitHub (ensure `.env` and `node_modules` are in `.gitignore`).
2. Sign up at [Render.com](https://render.com) and create a new **Web Service**.
3. Connect your GitHub repository.
4. Configure:
   - **Build Command**: `npm install && npm run build --prefix frontend`
   - **Start Command**: `npm start`
5. Add your environment variables in the Render dashboard (`MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`, `PORT=5000`).
6. **Important**: In MongoDB Atlas → Network Access → Allow `0.0.0.0/0` so Render can connect.

---

## 🤝 Contribution Guide

Contributions, issues, and feature requests are welcome!

1. **Fork** the project
2. **Create** your feature branch: `git checkout -b feature/AmazingFeature`
3. **Commit** your changes: `git commit -m 'Add AmazingFeature'`
4. **Push** to the branch: `git push origin feature/AmazingFeature`
5. **Open** a Pull Request

---

## 👤 Author

**D M Likhith**
- GitHub: [@likhith-gowda-7](https://github.com/likhith-gowda-7)

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.
