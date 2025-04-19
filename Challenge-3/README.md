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

5. Set up PostgreSQL:
   - Create a database called `blog_db`
   - Update database settings in `blog_project/settings.py` if needed

6. Run migrations:
   ```
   python manage.py makemigrations
   python manage.py migrate
   ```

7. Create a superuser:
   ```
   python manage.py createsuperuser
   ```

8. Start the development server:
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