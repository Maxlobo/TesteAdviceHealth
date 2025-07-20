import React, { useState, useEffect } from "react";
import api from "../services/api";
import "../styles/taskForm.css";


function TaskForm() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [completed, setCompleted] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description);
            setCompleted(task.completed);
        } else {
            setTitle("");
            setDescription("");
            setCompleted(false);
        }
    }, [task]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const taskData = { title, description, completed };

        try {
            if (task) {
                await api.patch(`tasks/${task.id}/`, taskData);
            } else {
                await api.post("tasks/", taskData);
            }
            onClose();
        } catch (error) {
            setError(error.response?.data?.detail || "An error occurred while saving the task.");
            console.error("Error saving task:", error);
        }
    };

    return (
        <div className="task_form">
            <div className="form_container">
                <h3>{task ? 'Edit Task' : 'Add New Task'}</h3>
                <form onSubmit={handleSubmit}>

                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="formTitle">Title:</label>
                        <input
                            type="text"
                            id="formTitle"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="formDescription">Description:</label>
                        <textarea
                            id="formDescription"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="3"
                        />
                    </div>

                    <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
                        <input
                            type="checkbox"
                            id="formCompleted"
                            checked={completed}
                            onChange={(e) => setCompleted(e.target.checked)}
                            style={{ marginRight: '10px' }}
                        />
                        <label htmlFor="formCompleted">Completed</label>
                    </div>

                    {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button type="button" onClick={onClose} className="cancel_button">
                            Cancel
                        </button>
                        <button type="submit" className="submit_button">
                            Save Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TaskForm;
