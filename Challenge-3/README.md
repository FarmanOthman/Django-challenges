# Blog Application

A full-stack blog application built with Django, Django REST Framework and React.

## Features

- User authentication (login, register)
- Create, read, update, and delete blog posts
- Filter posts by category
- Comment on posts
- Markdown support for blog content
- Responsive design

## Project Structure

The project is divided into two main parts:

- `backend/`: Django + DRF API
- `frontend/`: React frontend with Tailwind CSS

## Setup Instructions

### Backend

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Unix/MacOS: `source venv/bin/activate`

4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the values in `.env` according to your setup
   - Make sure to update database credentials

6. Set up PostgreSQL:
   - Create a database that matches the name in your `.env` file (default: `blog_db`)

7. Run migrations:
   ```
   python manage.py makemigrations
   python manage.py migrate
   ```

8. Create a superuser:
   ```
   python manage.py createsuperuser
   ```

9. Start the development server:
   ```
   python manage.py runserver
   ```

### Frontend

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. The frontend application will be available at `http://localhost:5173`

## API Endpoints

- `/api/categories/`: List and create categories
- `/api/posts/`: List and create blog posts
- `/api/comments/`: List and create comments
- `/api/auth/`: Authentication endpoints

## Environment Variables

The backend uses environment variables for configuration. These are stored in the `.env` file.
Key variables include:

- `SECRET_KEY`: Django's secret key
- `DEBUG`: Whether to run in debug mode (True/False)
- `DB_NAME`, `DB_USER`, `DB_PASSWORD`: Database configuration
- `CORS_ALLOWED_ORIGINS`: Allowed origins for CORS

## Technologies Used

### Backend
- Django
- Django REST Framework
- PostgreSQL
- CORS Headers

### Frontend
- React
- React Query / SWR
- React Router
- Tailwind CSS
- Axios
- React Markdown 