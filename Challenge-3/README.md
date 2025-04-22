# Full Stack Blog Application

A modern full-stack blog application built with Django REST Framework and React.js.

## Features

- User authentication (login/register)
- Create, read, update, and delete blog posts
- Responsive design
- User profiles
- Real-time post creation and updates
- Post detail views
- Rich text content support

## Tech Stack

### Backend
- Django 4.x
- Django REST Framework
- SQLite3 Database
- Python 3.x

### Frontend
- React.js
- React Router DOM
- Axios for API calls
- Context API for state management
- Modern CSS with Flexbox/Grid

## Prerequisites

Before you begin, ensure you have installed:
- Python 3.x
- Node.js (v14 or higher)
- npm or yarn

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
- Windows:
```bash
.\venv\Scripts\activate
```
- Unix or MacOS:
```bash
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install django djangorestframework django-cors-headers
```

5. Run migrations:
```bash
python manage.py migrate
```

6. Create a superuser:
```bash
python manage.py createsuperuser
```

7. Start the development server:
```bash
python manage.py runserver
```

### Frontend Setup

1. Navigate to the frontend directory:
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

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- Admin Interface: http://localhost:8000/admin

## Project Structure

```
├── backend/
│   ├── blog/                 # Blog app
│   │   ├── models.py        # Database models
│   │   ├── serializers.py   # API serializers
│   │   ├── urls.py          # URL routing
│   │   └── views.py         # API views
│   └── core/                # Project settings
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/      # React components
│       ├── contexts/        # Context providers
│       └── utils/           # Utility functions
```

## API Endpoints

- `POST /api/auth/login/` - User login
- `POST /api/auth/register/` - User registration
- `GET /api/posts/` - List all posts
- `POST /api/posts/` - Create a new post
- `GET /api/posts/<id>/` - Get post details
- `PUT /api/posts/<id>/` - Update a post
- `DELETE /api/posts/<id>/` - Delete a post

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Django documentation
- React.js documentation
- Django REST Framework documentation