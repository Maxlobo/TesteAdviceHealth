import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AuthContext from "../context/AuthContext";
import TaskItem from "../components/TaskItem";
import TaskForm from "../components/TaskForm";
import "../styles/taskList.css";


function TaskList() {
    const { isAuthenticated, loading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [filter, setFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchTasks = async (page = 1, currentFilter = filter) => {
        if (!isAuthenticated) return;

        try {
            let url = `tasks/?page=${page}`;
            if (currentFilter !== 'all') {
                url += `&completed=${currentFilter === 'completed'}`;
            }
            const response = await api.get(url);
            setTasks(response.data.results);
            setTotalPages(Math.ceil(response.data.count / 10));
        } catch (error) {
            console.error("Error fetching tasks:", error.response.data || error.message);
            if (error.response && error.response.status === 401) {
                navigate('/login');
            }
        }
    };

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/login');
            return;
        } else if (!loading && isAuthenticated) {
            fetchTasks(currentPage, filter);
        }
    }, [isAuthenticated, loading, currentPage, filter, navigate]);

    const handleAddTask = (task) => {
        setEditingTask(null);
        setShowTaskForm(true);
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setShowTaskForm(true);
    };

    const handleTaskFormClose = () => {
        setShowTaskForm(false);
        setEditingTask(null);
        fetchTasks(currentPage, filter);
    };

    const handleToggleComplete = async (taskId, currentCompletedStatus) => {
        try {
            await api.patch(`tasks/${taskId}/`, { completed: !currentCompletedStatus });
            fetchTasks(currentPage, filter);
        } catch (error) {
            console.error("Error updating task:", error.response.data || error.message);
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            try {
                await api.delete(`tasks/${taskId}/`);
                fetchTasks(currentPage, filter);
            } catch (error) {
                console.error("Error deleting task:", error.response.data || error.message);
            }
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            fetchTasks(currentPage - 1, filter);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            fetchTasks(currentPage + 1, filter);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return null;
    }


    return (
        <div>
            <h2>My Tasks</h2>
            <button onClick={handleAddTask} className="add_task_button">
                Add Task
            </button>

            {showTaskForm && (
                <TaskForm
                    task={editingTask}
                    onClose={handleTaskFormClose}
                />
            )}

            <div style={{ marginBottom: '15px' }}>
                Filter:
                <button onClick={() => setFilter('all')} className="filter_button">
                    All
                </button>
                <button onClick={() => setFilter('completed')} className="filter_button">
                    Completed
                </button>
                <button onClick={() => setFilter('pending')} className="filter_button">
                    Pending
                </button>
            </div>

            <div className="task_list">
                {tasks.length === 0 && <p>No tasks found</p>}
                {tasks.map(task => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                        onToggleComplete={handleToggleComplete}
                    />
                ))}
            </div>

            <div className="pagination">
                <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
}

export default TaskList;
