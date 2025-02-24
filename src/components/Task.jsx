import React from "react";

const Task = ({ task, onDragStart }) => {
  return (
    <div className="task" draggable onDragStart={onDragStart}>
      {task.text}
    </div>
  );
};

export default Task;
