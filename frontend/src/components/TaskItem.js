import React from 'react';
import "../styles/taskItem.css"

function TaskItem({ task, onToggleComplete, onEdit, onDelete }) {
    return (
        <div className="task_item">

            <div className='task_details'>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
            </div>

            <div className='task_actions'>
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onToggleComplete(task.id, task.completed)}
                />
                <button onClick={() => onEdit(task)} className='edit_button'>
                    Edit
                </button>
                <button onClick={() => onDelete(task.id)} className='delete_button'>
                    Delete
                </button>
            </div>
        </div>
    );
}

export default TaskItem;