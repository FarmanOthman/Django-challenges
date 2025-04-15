import React from 'react';
import './App.css';
import './output.css';
import TaskList from './components/TaskList';
import axios from 'axios';

// Set the base URL for axios
axios.defaults.baseURL = 'http://localhost:8000';

// Add request interceptor for debugging
axios.interceptors.request.use(request => {
  console.log('Starting Request:', request);
  return request;
});

// Add response interceptor for debugging
axios.interceptors.response.use(
  response => {
    console.log('Response:', response);
    return response;
  },
  error => {
    console.log('Response Error:', error.response || error);
    return Promise.reject(error);
  }
);

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <TaskList />
    </div>
  );
}

export default App;
