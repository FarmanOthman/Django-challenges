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

4. Set up PostgreSQL database:
   - Create a database named `blog_db`
   - Update database settings in `blog_project/settings.py` if needed

5. Run migrations:
   ```
   python manage.py makemigrations
   python manage.py migrate
   ```

6. Create a superuser:
   ```
   python manage.py createsuperuser
   ```

7. Run the development server:
   ```
   python manage.py runserver
   ```

## API Endpoints

- `/api/categories/` - List and create categories
- `/api/posts/` - List and create blog posts
- `/api/comments/` - List and create comments
- `/api/auth/` - Authentication endpoints 