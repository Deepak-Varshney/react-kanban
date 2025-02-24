import React, { useState } from "react";
import "../index.css";

const AddColumnForm = ({ onAddColumn, onClose }) => {
  const [columnName, setColumnName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (columnName.trim()) {
      onAddColumn(columnName);
      setColumnName("");
      onClose();
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Add Column</h2>
      <input
        type="text"
        placeholder="Enter column name"
        value={columnName}
        onChange={(e) => setColumnName(e.target.value)}
        required
      />
      <button type="submit">Add Column</button>
    </form>
  );
};

export default AddColumnForm;
