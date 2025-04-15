import React from 'react';
import { format } from 'date-fns';

const TaskItem = ({ task, onToggleComplete, onEdit, onDelete }) => {
  const formattedDate = task.due_date ? format(new Date(task.due_date), 'MMM d, yyyy') : 'No due date';

  return (
    <div className={`border rounded-lg p-4 mb-2 shadow ${task.completed ? 'bg-green-50' : 'bg-white'}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className={`mt-1 text-sm ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
              {task.description}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-2">Due: {formattedDate}</p>
        </div>
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => onToggleComplete(task.id, !task.completed)}
            className={`px-2 py-1 text-xs rounded ${
              task.completed 
                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                : 'bg-green-100 text-green-800 hover:bg-green-200'
            }`}
          >
            {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
          </button>
          <button
            onClick={() => onEdit(task)}
            className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
