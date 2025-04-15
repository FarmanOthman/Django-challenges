import React, { useState, useEffect } from 'react';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import axios from 'axios';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  // Fetch tasks from the API
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/tasks/');
      setTasks(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks. Please try again later.');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Create a new task
  const handleCreateTask = async (taskData) => {
    try {
      console.log('Creating task with data:', taskData);
      const response = await axios.post('/api/tasks/', taskData);
      setTasks([...tasks, response.data]);
      setShowForm(false);
    } catch (err) {
      console.error('Error creating task:', err);
      
      // Provide more detailed error message if available
      if (err.response && err.response.data) {
        if (typeof err.response.data === 'object') {
          // Format detailed validation errors
          const errorDetails = Object.entries(err.response.data)
            .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
            .join(' | ');
          setError(`Failed to create task: ${errorDetails}`);
        } else {
          setError(`Failed to create task: ${err.response.data}`);
        }
      } else if (err.message) {
        setError(`Failed to create task: ${err.message}`);
      } else {
        setError('Failed to create task. Please try again.');
      }
    }
  };

  // Update an existing task
  const handleUpdateTask = async (taskData) => {
    try {
      const response = await axios.put(`/api/tasks/${taskData.id}/`, taskData);
      setTasks(tasks.map(task => task.id === taskData.id ? response.data : task));
      setShowForm(false);
      setCurrentTask(null);
    } catch (err) {
      setError('Failed to update task. Please try again.');
      console.error('Error updating task:', err);
    }
  };

  // Delete a task
  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`/api/tasks/${taskId}/`);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err) {
      setError('Failed to delete task. Please try again.');
      console.error('Error deleting task:', err);
    }
  };

  // Toggle task completion status
  const handleToggleComplete = async (taskId, completedStatus) => {
    try {
      const taskToUpdate = tasks.find(task => task.id === taskId);
      if (!taskToUpdate) return;

      const response = await axios.patch(`/api/tasks/${taskId}/`, {
        completed: completedStatus
      });
      
      setTasks(tasks.map(task => task.id === taskId ? response.data : task));
    } catch (err) {
      setError('Failed to update task status. Please try again.');
      console.error('Error updating task status:', err);
    }
  };

  // Open the form for editing
  const handleEditTask = (task) => {
    setCurrentTask(task);
    setShowForm(true);
  };

  // Handle form submission (create or update)
  const handleFormSubmit = (taskData) => {
    if (currentTask) {
      handleUpdateTask(taskData);
    } else {
      handleCreateTask(taskData);
    }
  };

  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Task Manager</h1>
        {!showForm && (
          <button
            onClick={() => {
              setCurrentTask(null);
              setShowForm(true);
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add New Task
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading tasks...</p>
        </div>
      ) : (
        <>
          {showForm ? (
            <div className="mb-6">
              <TaskForm
                task={currentTask}
                onSubmit={handleFormSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setCurrentTask(null);
                }}
              />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-3 text-gray-800">Pending Tasks</h2>
                {pendingTasks.length === 0 ? (
                  <p className="text-gray-500 italic">No pending tasks</p>
                ) : (
                  <div className="space-y-2">
                    {pendingTasks.map(task => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onToggleComplete={handleToggleComplete}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3 text-gray-800">Completed Tasks</h2>
                {completedTasks.length === 0 ? (
                  <p className="text-gray-500 italic">No completed tasks</p>
                ) : (
                  <div className="space-y-2">
                    {completedTasks.map(task => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onToggleComplete={handleToggleComplete}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TaskList;
