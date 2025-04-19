# Blog API Backend

A RESTful API for a blog application built with Django and Django REST Framework.

## Setup

1. Create a virtual environment:
   ```
   python -m venv venv
   ```

2. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Unix/MacOS: `source venv/bin/activate`

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the values in `.env` according to your setup
   - Especially make sure to update `DB_PASSWORD` to your actual PostgreSQL password

5. Set up PostgreSQL database:
   - Create a database named `blog_db` (or as configured in your .env file)
   - Update database settings in `.env` if needed

6. Run migrations:
   ```
   python manage.py makemigrations
   python manage.py migrate
   ```

7. Create a superuser:
   ```
   python manage.py createsuperuser
   ```

8. Run the development server:
   ```
   python manage.py runserver
   ```

## API Endpoints

- `/api/categories/` - List and create categories
- `/api/posts/` - List and create blog posts
- `/api/comments/` - List and create comments
- `/api/auth/` - Authentication endpoints 