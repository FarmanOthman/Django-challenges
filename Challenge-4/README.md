# Real-Time Chat Application

A modern real-time chat application built with Django and React, featuring WebSocket communication for instant messaging.

## 🚀 Features

- Real-time messaging using WebSocket technology
- Modern, responsive UI built with React and Tailwind CSS
- Secure authentication using JWT tokens
- RESTful API backend with Django REST framework
- Containerized deployment with Docker

## 🛠️ Tech Stack

### Backend
- Django 5.0+
- Django Channels for WebSocket support
- Django REST Framework
- Redis for WebSocket message broker
- JWT Authentication
- Daphne ASGI server

### Frontend
- React 19
- TypeScript
- Tailwind CSS
- Material Tailwind components
- Vite build tool
- React Router for navigation

## 📋 Prerequisites

- Docker and Docker Compose
- Node.js (v18 or higher)
- Python 3.13+

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Backend Setup**
   ```bash
   cd backend
   # Using Docker
   docker-compose up --build
   
   # Without Docker
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 🚀 Running the Application

### Using Docker (Recommended)
```bash
docker-compose up
```
The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000

### Without Docker
1. Start the backend server:
   ```bash
   cd backend
   python manage.py runserver
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

## 🔒 Environment Variables

Create a `.env` file in the backend directory with the following variables:
```env
SECRET_KEY=your_secret_key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Farman Othman 

## 🙏 Acknowledgments

- React.js community
- Django community
- Material Tailwind for the UI components 