import React, { useState } from "react";
import "../index.css";

const AddTaskForm = ({ columns, onAddTask, onClose }) => {
  const [taskText, setTaskText] = useState("");
  const [selectedColumn, setSelectedColumn] = useState(columns[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskText.trim() && selectedColumn) {
      onAddTask(taskText, selectedColumn);
      setTaskText("");
      onClose();
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Add Task</h2>
      <input
        type="text"
        placeholder="Enter task text"
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
        required
      />
      <select
        value={selectedColumn}
        onChange={(e) => setSelectedColumn(e.target.value)}
        required
      >
        {columns.map((column) => (
          <option key={column} value={column}>
            {column}
          </option>
        ))}
      </select>
      <button type="submit">Add Task</button>
    </form>
  );
};

export default AddTaskForm;
