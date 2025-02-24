export const loadTasksFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem("tasks"));
};

export const saveTasksToLocalStorage = (tasks) => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};
