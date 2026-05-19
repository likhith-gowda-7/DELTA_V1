# DELTA_V1 - Real-Time Chat Application

![Delta Cover](https://via.placeholder.com/1200x400?text=DELTA+Chat+Application)

## 📖 Project Introduction
**DELTA_V1** is a full-stack, real-time chat application built using the MERN stack (MongoDB, Express, React, Node.js) and Socket.IO. It provides a seamless, instant-messaging experience with features like 1-on-1 chatting, group creations, real-time typing indicators, and instant notifications.

## 🎯 Motivation
This project was initially built during my learning phase to master full-stack web development. 
The primary goals were to:
- Understand how to build and structure RESTful APIs.
- Learn how to implement secure JWT-based authentication.
- Grasp the complexities of bidirectional, real-time communication using WebSockets.
- Build a responsive, accessible user interface using a modern component library.

## ✨ Features
- **Secure Authentication**: User signup and login utilizing JWT (JSON Web Tokens) and bcrypt password hashing.
- **Real-Time Messaging**: Instant message delivery powered by Socket.IO without needing manual page refreshes.
- **Group Chats**: Create groups, add/remove users, and rename groups dynamically.
- **Live Typing Indicators**: See when the other person is typing in real-time.
- **Instant Notifications**: Receive red-dot alerts and dropdown notifications for unread messages.
- **User Search**: Search for other registered users by name or email to start a conversation.
- **Responsive UI**: Fully responsive, modern interface built with Chakra UI, featuring a persistent Light/Dark mode.

---

## 💻 Tech Stack

### Frontend
- **React.js**: UI component library.
- **Chakra UI**: Component library for styling, dark mode, and accessibility.
- **React Router**: For client-side routing and protected routes.
- **Context API**: For global state management.

### Backend
- **Node.js & Express.js**: Server and API framework.
- **Socket.IO**: For real-time, bidirectional communication.
- **JSON Web Token (JWT)**: For stateless user authentication.
- **Bcrypt.js**: For secure password hashing.

### Database
- **MongoDB**: NoSQL database for flexible data storage.
- **Mongoose**: Object Data Modeling (ODM) library for MongoDB.

---

## 🚀 Installation Guide

Follow these steps to run the project locally on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/likhith-gowda-7/DELTA_V1
cd DELTA_V1
```

### 2. Install Dependencies
You need to install dependencies for both the backend and frontend.
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory and add the following required variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
```

### 4. Run the Application
You can run the backend and frontend concurrently (ensure you have setup concurrently, or run them in separate terminals):

**Terminal 1 (Backend):**
```bash
npm start
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm start
```

The app will be available at `http://localhost:3000`.

---

## 🔐 Environment Variables Explained
- `PORT`: The port on which the Express server will run (default: 5000).
- `MONGO_URI`: Your MongoDB Atlas connection string. Required to connect to the database.
- `JWT_SECRET`: A secret string used to sign and verify JSON Web Tokens. Keep this secure!
- `NODE_ENV`: Set to `development` locally. When deployed, set to `production` so Express serves the built React files.

---

## 📂 Project Structure

```text
DELTA_V1/
├── backend/
│   ├── config/        # Database connection setup
│   ├── controllers/   # Business logic for routes
│   ├── middleware/    # Auth and Error handling
│   ├── models/        # Mongoose database schemas
│   ├── routes/        # API endpoints
│   └── server.js      # Main Express & Socket.IO server
├── frontend/
│   ├── public/        # Static assets (HTML, Favicons)
│   └── src/
│       ├── components/# Reusable Chakra UI components
│       ├── config/    # Helper logic functions
│       ├── Context/   # React Context API setup
│       └── Pages/     # Main route pages (Home, Chat)
├── .env               # Environment variables (Ignored by Git)
└── package.json       # Root dependencies and scripts
```

---

## 🔄 Workflow Explanation

1. **User Login/Signup Flow**: User submits credentials -> Backend hashes password (signup) or compares hash (login) -> Returns a JWT -> Frontend saves JWT in LocalStorage and updates Context state.
2. **Messaging Flow**: User sends a message -> Frontend makes a POST request -> Backend saves message to MongoDB -> Backend updates the Chat's `latestMessage` -> Backend responds with saved message -> Frontend emits Socket.IO event to notify other users.
3. **Socket Connection Flow**: Upon successful login, the frontend connects to the Socket server and joins a personal "Room" corresponding to their User ID to listen for incoming events.

---

## ⚠️ Known Issues
- Tokens are stored in LocalStorage, which is susceptible to XSS attacks.
- Socket.IO connection trusts the User ID sent by the client without re-verifying the JWT, which is a potential security flaw in production.
- No pagination on messages. Opening a chat with thousands of messages may cause slow load times.

---

## 🔮 Future Improvements
- **Security**: Move JWT storage to HttpOnly cookies. Implement Socket.IO middleware to authenticate WebSocket connections via JWT.
- **Performance**: Implement infinite scrolling/pagination for chat messages.
- **Architecture**: Migrate to TypeScript for better type safety and developer experience.
- **Scaling**: Add Redis Adapter for Socket.IO to allow scaling the backend across multiple server instances.

---

## 📸 Screenshots
*(Add screenshots of your application here)*

![Login Screen](https://via.placeholder.com/800x400?text=Login+Screen)
![Chat Interface](https://via.placeholder.com/800x400?text=Chat+Interface)

---

## ☁️ Deployment Guide

This project is configured to be hosted as a single monolithic unit (Backend serving Frontend). **Render.com** is highly recommended.

1. Create a `build` of the frontend: `cd frontend && npm run build`
2. Push your code to GitHub (Ensure `.env` and `node_modules` are in your `.gitignore`).
3. Connect your repo to Render as a **Web Service**.
4. **Build Command**: `npm install && npm run build --prefix frontend`
5. **Start Command**: `npm start`
6. Add your `.env` variables in the Render dashboard. Make sure to set `NODE_ENV=production`.

---

## 🤝 Contribution Guide
Contributions, issues, and feature requests are welcome! 
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.
