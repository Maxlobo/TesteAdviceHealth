import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AuthContext from "../context/AuthContext";
import TaskItem from "../components/TaskItem";
import TaskForm from "../components/TaskForm";
import "../styles/taskList.css";


function TaskList() {
    const { isAuthenticated, loading, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState("all");
    const [showFormModal, setShowFormModal] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
    const [apiError, setApiError] = useState('');

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/login/');
        }
    }, [isAuthenticated, loading, navigate]);

    const fetchTasks = async () => {
        setApiError('');
        try {
            const token = localStorage.getItem('access_token');
            if (token) {
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                const response = await api.get('tasks/');
                setTasks(response.data);
            }
        } catch (error) {
            console.error('Erro ao buscar tarefas:', error.response?.data || error.message);
            setApiError('Erro ao carregar tarefas. Por favor, tente novamente.');

            if (error.response && error.response.status === 401) {
                logout();
            }
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchTasks();
        }
    }, [isAuthenticated]);

    const filteredTasks = tasks.filter(task => {
        if (filter === 'completed') return task.completed;
        if (filter === 'incomplete') return !task.completed;
        return true;
    });


    const handleToggleComplete = async (id, completed) => {
        setApiError('');
        try {
            const token = localStorage.getItem('access_token');
            if (token) {
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                await api.patch(`tasks/${id}/`, { completed: !completed });
                fetchTasks();
            }
        } catch (error) {
            console.error('Erro ao alternar status da tarefa:', error.response?.data || error.message);
            setApiError('Erro ao atualizar status da tarefa.');
        }
    };

    const handleDelete = async (id) => {
        setApiError('');
        try {
            const token = localStorage.getItem('access_token');
            if (token) {
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                await api.delete(`tasks/${id}/`);
                fetchTasks();
            }
        } catch (error) {
            console.error('Erro ao excluir tarefa:', error.response?.data || error.message);
            setApiError('Erro ao excluir tarefa.');
        }
    };

    const handleEdit = (task) => {
        setCurrentTask(task);
        setShowFormModal(true);
    };

    const handleAddTask = () => {
        setCurrentTask(null);
        setShowFormModal(true);
    };

    const handleCloseFormModal = () => {
        setShowFormModal(false);
        setCurrentTask(null);
        fetchTasks();
    };


    if (loading) {
        return <div>Carregando aplicação...</div>;
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="task-list-container">
            <h1>Minhas Tarefas</h1>

            {apiError && <p className="error-message">{apiError}</p>}

            <div className="task-controls">
                <button onClick={handleAddTask} className="add-task-button">Add New Task</button>
                <div className="filter-buttons">
                    <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>All</button>
                    <button onClick={() => setFilter('completed')} className={filter === 'completed' ? 'active' : ''}>Completed</button>
                </div>
            </div>

            <div className="tasks-grid">
                {filteredTasks.length === 0 && <p>No tasks found.</p>}
                {filteredTasks.map(task => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        onToggleComplete={handleToggleComplete}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            {showFormModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button onClick={handleCloseFormModal} className="modal-close-button">X</button>
                        <TaskForm
                            task={currentTask}
                            onClose={handleCloseFormModal}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default TaskList;