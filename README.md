# Social Media App

This project is a simple social media application built with a modern JavaScript stack including a client-side single-page application (SPA) and a server-side API.

## Structure

The application is divided into two main directories: `client` and `server`.

### Client

The `client` directory contains the frontend of the application, built with:

- React.js (Files: `App.jsx`, `index.js`, `main.jsx`)
- Tailwind CSS for styling (Config: `tailwind.config.js`)
- Vite as the build tool (Config: `vite.config.js`)

The frontend is organized into:

- `components`: Reusable React components
- `hooks`: Custom React hooks
- `stores`: State management stores
- `utils`: Utility functions
- `assets`: Static files like images and fonts

### Server

The `server` directory contains the backend of the application with Express.js controllers:

- `AuthController.js`: Handles authentication
- `NotificationController.js`: Manages notifications
- `PostController.js`: Post-related operations
- `RequestController.js`: Friend request operations
- `UserController.js`: User-related operations

And models for the database:

- `FollowRequest.js`: Model for follow requests
- `Notification.js`: Model for notifications
- `Post.js`: Model for posts

## Installation

To install the project, you need to have Node.js installed on your system.

```bash
# Clone the repository
git clone https://github.com/lawrencexbaron/social-media-app.git

# Navigate to the client directory
cd client

# Install dependencies for the client
npm install

# Navigate to the server directory
cd ../server

# Install dependencies for the server
npm install

# Start the client
cd client
npm run dev

# Start the server in a separate terminal
cd server
npm start

#Usage
After starting the server and client, access the application at http://localhost:3000
```
