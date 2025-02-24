import React from 'react';
import '../index.css';

const TaskForm = ({ newTaskText, setNewTaskText, handleAddTask }) => {
  return (
    <div className="task-input">
      <input
        type="text"
        placeholder="Enter new task"
        value={newTaskText}
        onChange={(e) => setNewTaskText(e.target.value)}
      />
      <button onClick={handleAddTask}>+ Add Task</button>
    </div>
  );
};

export default TaskForm;