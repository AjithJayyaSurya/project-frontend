# Quota Frontend

A full-stack web application for managing user quotas and messages. Users can send messages within their allocated quota, while administrators can manage users, quotas, and approve/reject messages.

## Features

### User Features
- **Authentication**: Secure login and signup system
- **Dashboard**: View quota usage, send messages, manage sent messages
- **Quota Management**: Track remaining quota, used quota, and expiry dates
- **Message Management**: Send, view, and delete messages (reverts quota)

### Admin Features
- **User Management**: View all users, set quotas, delete users
- **Message Moderation**: Approve or reject pending messages
- **Analytics**: View statistics on users and message statuses

## Tech Stack

### Frontend
- **React 18** - Modern JavaScript library for building user interfaces
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests

### Backend
- **Flask** - Lightweight Python web framework
- **MongoDB** - NoSQL database for data storage
- **JWT** - JSON Web Tokens for authentication

## Project Structure

```
quota-frontend/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── api/           # API configuration
│   │   ├── pages/         # React components for pages
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── UserDashboard.jsx
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # App entry point
│   │   └── index.css      # Global styles
│   ├── package.json
│   └── vite.config.js
├── server/                 # Flask backend
│   ├── app.py             # Main Flask application
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   └── requirements.txt   # Python dependencies
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- MongoDB

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd quota-frontend
   ```

2. **Setup Backend**
   ```bash
   cd server
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   # Configure MongoDB connection in your environment
   python run.py
   ```

3. **Setup Frontend**
   ```bash
   cd client
   npm install
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/signup` - User registration
- `GET /auth/profile` - Get user profile

### User Endpoints
- `GET /user/quota` - Get user quota information
- `GET /user/messages` - Get user's messages
- `POST /user/messages` - Send a new message
- `DELETE /user/messages/:id` - Delete a message

### Admin Endpoints
- `GET /admin/users` - Get all users
- `DELETE /admin/users/:id` - Delete a user
- `PUT /admin/users/:id/quota` - Update user quota
- `GET /admin/messages` - Get all messages
- `PUT /admin/messages/:id/status` - Update message status

## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **User Dashboard**: View your quota and send messages
3. **Admin Dashboard**: If you have admin role, manage users and messages
4. **Quota Tracking**: Monitor your remaining quota and message history

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
