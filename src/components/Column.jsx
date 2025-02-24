import React, { useState } from "react";
import "../index.css";

const Column = ({ title, tasks, columnKey, onDragStart, onDrop, onDragOver, onDeleteTask, onEditTask, isDraggedOver, draggedTask }) => {
    const [isEditing, setIsEditing] = useState(null);
    const [editedText, setEditedText] = useState("");

    const handleEditClick = (taskId, currentText) => {
        setIsEditing(taskId);
        setEditedText(currentText);
    };

    const handleSaveEdit = (taskId) => {
        if (editedText.trim()) {
            onEditTask(taskId, editedText, columnKey);
            setIsEditing(null);
            setEditedText("");
        }
    };

    const handleTaskDrop = (event, toIndex) => {
        event.preventDefault();
        onDrop(event, columnKey, toIndex);
    };

    return (
        <div
            className={`column ${isDraggedOver ? "dragged-over" : ""}`}
            onDrop={(e) => onDrop(e, columnKey)}
            onDragOver={onDragOver}
        >
            <h2>{title}</h2>
            <div className="task-list">
                {tasks.map((task, index) => (
                    <div
                        key={task.id}
                        className="task"
                        draggable
                        onDragStart={(e) => onDragStart(e, task, columnKey)}
                        onDrop={(e) => handleTaskDrop(e, index)}
                    >
                        {isEditing === task.id ? (
                            <div>
                                <input
                                    type="text"
                                    value={editedText}
                                    onChange={(e) => setEditedText(e.target.value)}
                                />
                                <button onClick={() => handleSaveEdit(task.id)}>Save</button>
                            </div>
                        ) : (
                            <div>
                                <p>{task.text}</p>
                                <button onClick={() => handleEditClick(task.id, task.text)}>Edit</button>
                                <button onClick={() => onDeleteTask(task.id, columnKey)}>Delete</button>
                            </div>
                        )}
                    </div>
                ))}
                {isDraggedOver && draggedTask && (
                    <div className="task dragged-preview">
                        {draggedTask.text}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Column;
