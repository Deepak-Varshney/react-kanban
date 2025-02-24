import React, { useState, useEffect } from "react";
import Column from "./Column";
import UndoButton from "./UndoButton";
import Header from "./Header";
import Modal from "./Modal";
import AddTaskForm from "./AddTaskForm";
import AddColumnForm from "./AddColumnForm";
import { loadTasksFromLocalStorage, saveTasksToLocalStorage } from "../utils/storage";
import "../index.css";

const KanbanBoard = () => {
    const [tasks, setTasks] = useState({
        Todo: [],
        InProgress: [],
        Done: [],
    });
    const [columns, setColumns] = useState(["Todo", "InProgress", "Done"]);
    const [newTaskText, setNewTaskText] = useState("");
    const [searchText, setSearchText] = useState("");
    const [deletedTask, setDeletedTask] = useState(null);
    const [undoTimeout, setUndoTimeout] = useState(null);
    const [draggedTask, setDraggedTask] = useState(null);
    const [draggedOverColumn, setDraggedOverColumn] = useState(null);
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);

    useEffect(() => {
        const storedTasks = loadTasksFromLocalStorage();
        if (storedTasks) {
            setTasks(storedTasks);
        }
    }, []);

    useEffect(() => {
        saveTasksToLocalStorage(tasks);
    }, [tasks]);

    const handleAddTask = (taskText, column) => {
        const newTask = {
            id: Math.random().toString(36).substring(7),
            text: taskText,
        };

        setTasks((prevTasks) => {
            const newTasks = { ...prevTasks };
            newTasks[column] = [...newTasks[column], newTask];
            return newTasks;
        });
    };

    const handleSearchChange = (event) => {
        setSearchText(event.target.value.toLowerCase());
    };

    const filteredTasks = (columnTasks) => {
        return columnTasks.filter((task) =>
            task.text.toLowerCase().includes(searchText)
        );
    };

    const handleDeleteTask = (taskId, column) => {
        // Find the task to be deleted
        const taskToDelete = tasks[column].find((task) => task.id === taskId);

        setTasks((prevTasks) => {
            const newTasks = { ...prevTasks };
            newTasks[column] = newTasks[column].filter((task) => task.id !== taskId);
            return newTasks;
        });

        // Store the deleted task temporarily
        setDeletedTask({ task: taskToDelete, column });
        // Show the undo button for 5 seconds
        const timeoutId = setTimeout(() => setDeletedTask(null), 5000);
        setUndoTimeout(timeoutId);
    };

    const handleUndoDelete = () => {
        if (deletedTask) {
            // Restore the deleted task to its original column
            setTasks((prevTasks) => {
                const newTasks = { ...prevTasks };
                newTasks[deletedTask.column] = [
                    ...newTasks[deletedTask.column],
                    deletedTask.task,
                ];
                return newTasks;
            });
            setDeletedTask(null);
            clearTimeout(undoTimeout); // Clear the timeout if the undo was clicked
        }
    };

    const handleDragStart = (event, task, fromColumn) => {
        event.dataTransfer.setData("task", JSON.stringify({ task, fromColumn }));
        setDraggedTask(task);
    };

    const handleDrop = (event, toColumn, toIndex = null) => {
        event.preventDefault();
        const { task, fromColumn } = JSON.parse(event.dataTransfer.getData("task"));

        if (fromColumn !== toColumn || toIndex !== null) {
            setTasks((prevTasks) => {
                const newTasks = { ...prevTasks };
                newTasks[fromColumn] = newTasks[fromColumn].filter((t) => t.id !== task.id);
                if (toIndex !== null) {
                    newTasks[toColumn].splice(toIndex, 0, task);
                } else {
                    newTasks[toColumn] = [...newTasks[toColumn], task];
                }
                return newTasks;
            });
        }
        setDraggedTask(null);
        setDraggedOverColumn(null);
    };

    const handleDragOver = (event, column) => {
        event.preventDefault();
        setDraggedOverColumn(column);
    };

    const handleEditTask = (taskId, newText, column) => {
        setTasks((prevTasks) => {
            const newTasks = { ...prevTasks };
            newTasks[column] = newTasks[column].map((task) =>
                task.id === taskId ? { ...task, text: newText } : task
            );
            return newTasks;
        });
    };

    const handleAddColumn = (columnName) => {
        setColumns([...columns, columnName]);
        setTasks((prevTasks) => ({ ...prevTasks, [columnName]: [] }));
    };

    return (
        <div className="kanban-board">
            <Header />
            <div className="headersection">
                <input
                    type="text"
                    placeholder="Search tasks"
                    value={searchText}
                    onChange={handleSearchChange}
                    className="search-bar"
                />
                <button onClick={() => setIsAddTaskModalOpen(true)}>Add Task</button>
                <button onClick={() => setIsAddColumnModalOpen(true)}>Add Column</button>
            </div>
            <div className="columns">
                {columns.map((columnKey) => (
                    <div
                        key={columnKey}
                        className="column-wrapper"
                    >
                        <Column
                            title={columnKey}
                            tasks={filteredTasks(tasks[columnKey])}
                            columnKey={columnKey}
                            onDragStart={handleDragStart}
                            onDrop={handleDrop}
                            onDragOver={(e) => handleDragOver(e, columnKey)}
                            onDeleteTask={handleDeleteTask}
                            onEditTask={handleEditTask}
                            isDraggedOver={draggedOverColumn === columnKey}
                            draggedTask={draggedTask}
                        />
                    </div>
                ))}
            </div>

            {/* Undo Button */}
            {deletedTask && (
                <UndoButton onUndo={handleUndoDelete} duration={5} />
            )}

            {/* Add Task Modal */}
            <Modal isOpen={isAddTaskModalOpen} onClose={() => setIsAddTaskModalOpen(false)}>
                <AddTaskForm columns={columns} onAddTask={handleAddTask} onClose={() => setIsAddTaskModalOpen(false)} />
            </Modal>

            {/* Add Column Modal */}
            <Modal isOpen={isAddColumnModalOpen} onClose={() => setIsAddColumnModalOpen(false)}>
                <AddColumnForm onAddColumn={handleAddColumn} onClose={() => setIsAddColumnModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default KanbanBoard;
