# Django React Authentication System

A full-stack authentication system built with Django REST Framework and React, featuring JWT (JSON Web Token) authentication.

## Features

- User registration and login
- JWT authentication with access and refresh tokens
- Token refresh mechanism
- Protected routes
- Automatic token refresh on expiry
- Token blacklisting for logout
- Modern React hooks and context
- Clean and organized project structure

## Tech Stack

### Backend
- Django
- Django REST Framework
- SimpleJWT for JWT authentication
- SQLite database

### Frontend
- React
- React Router for routing
- Axios for API calls
- Context API for state management

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn

### Backend Setup

1. Create and activate virtual environment:
```bash
python -m venv env
source env/bin/activate  # On Windows: .\env\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run migrations:
```bash
python manage.py migrate
```

4. Start the development server:
```bash
python manage.py runserver
```

The backend will be running at http://localhost:8000

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will be running at http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Register a new user
- `POST /api/auth/login/` - Login and receive tokens
- `POST /api/auth/refresh/` - Refresh access token
- `POST /api/auth/logout/` - Logout and blacklist refresh token

## Project Structure

```
├── backend/
│   ├── accounts/          # Django app for authentication
│   └── backend/           # Django project settings
├── frontend/
│   ├── src/
│   │   ├── features/     # Feature-based components
│   │   ├── services/     # API services
│   │   ├── context/      # React context
│   │   └── components/   # Shared components
│   └── public/
├── requirements.txt       # Python dependencies
├── .gitignore
├── README.md
└── LICENSE
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 