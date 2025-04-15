# Todo List Application

A full-stack Todo List application with React frontend and Django backend.

## Features

- Create, read, update, and delete tasks
- Mark tasks as completed or pending
- Responsive UI with separate sections for pending and completed tasks
- Form validation
- Real-time updates

## Technology Stack

- **Frontend**: React, Tailwind CSS, Axios
- **Backend**: Django, Django REST Framework

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

3. Apply migrations:
   ```
   python manage.py migrate
   ```

4. Start the backend server:
   ```
   python manage.py runserver
   ```

### Frontend Setup

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
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## API Endpoints

- **GET /api/tasks/**: Get all tasks
- **POST /api/tasks/**: Create a new task
- **GET /api/tasks/:id/**: Get a single task
- **PUT /api/tasks/:id/**: Update a task
- **DELETE /api/tasks/:id/**: Delete a task

## Project Structure

- **backend/**: Django backend application
  - **tasks/**: Django app for task management
  
- **frontend/**: React frontend application
  - **src/components/**: React components
    - **TaskList.js**: Component to display tasks
    - **TaskForm.js**: Component for task creation/editing
    - **TaskItem.js**: Component for individual task display 