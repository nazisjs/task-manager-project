import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from '../api/client';
import styles from './tasks.module.css';
import logo from "../landing page/photos/logo.svg";
interface Task {
    id: number;
    title: string;
    description?: string;
    status: 'to_do' | 'in_progress' | 'completed';
    priority?: 'low' | 'medium' | 'high';
    due_date?: string;
    completed: boolean;
}

const TASK_STATUSES = {
    to_do: {
        label: 'To Do',
        color: '#754c17',
        lightColor: '#ece8d7',
        icon: ''
    },
    in_progress: {
        label: 'In Progress',
        color: '#9f9a58',
        lightColor: '#feffed',
        icon: '✓'
    },
    completed: {
        label: 'Completed',
        color: '#797456',
        lightColor: '#f4f3ee',
        icon: '✓'
    }
};

const PRIORITY_COLORS = {
    low: { color: '#8b7355', bgColor: '#f5e6d3', label: '◯ Low' },
    medium: { color: '#d97706', bgColor: '#fef3c7', label: '◉ Medium' },
    high: { color: '#dc2626', bgColor: '#fee2e2', label: '● High' }
};

export default function KanbanBoard() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access'));
    const handleLogout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh_token');
        setIsLoggedIn(false);
        navigate('/login');
    }
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState('');
    const [draggedTask, setDraggedTask] = useState<Task | null>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState<Partial<Task>>({});
    const [filterPriority, setFilterPriority] = useState<string | null>(null);


    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = () => {
        api.get('/api/tasks/')
            .then(res => setTasks(res.data))
            .catch(err => console.error('Tasks error:', err));
    };

    const addTask = () => {
        if (!newTask.trim()) return;
        api.post('/api/tasks/', {
            title: newTask,
            status: 'to_do',
            priority: 'medium',
            completed: false
        })
            .then(res => {
                setTasks([...tasks, res.data]);
                setNewTask('');
            })
            .catch(err => console.error('Add task error:', err));
    };

    const deleteTask = (id: number) => {
        api.delete(`/api/tasks/${id}/`)
            .then(() => setTasks(tasks.filter(t => t.id !== id)))
            .catch(err => console.error('Delete error:', err));
    };

    const updateTask = (taskId: number, updates: Partial<Task>) => {
        api.patch(`/api/tasks/${taskId}/`, updates)
            .then(res => {
                setTasks(tasks.map(t => t.id === taskId ? res.data : t));
                setSelectedTask(res.data);
            })
            .catch(err => console.error('Update error:', err));
    };

    const updateTaskStatus = (taskId: number, newStatus: string) => {
        updateTask(taskId, { status: newStatus as Task['status'] });
    };

    const handleDragStart = (task: Task) => setDraggedTask(task);

    const handleDragOver = (e: React.DragEvent) => e.preventDefault();

    const handleDrop = (e: React.DragEvent, status: string) => {
        e.preventDefault();
        if (draggedTask) {
            updateTaskStatus(draggedTask.id, status);
            setDraggedTask(null);
        }
    };

    const getTasksByStatus = (status: string) =>
        tasks.filter(t => {
            if (t.status !== status) return false;
            if (filterPriority && t.priority !== filterPriority) return false;
            return true;
        });

    const openTaskModal = (task: Task) => {
        setSelectedTask(task);
        setEditingTask({ ...task });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedTask(null);
        setEditingTask({});
    };


    return (
        <>
            <nav className={styles.nav}>
                <div className={styles.navLogo} onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                    <img
                        src={logo}
                        className={styles.logo}
                        alt="Logo"
                    />
                    <span className={styles.navWordmark}>SunDo</span>
                </div>

                <div className={styles.navSpacer} />

                <div className={styles.navLinks}>
                    {isLoggedIn ? (
                        <>
                            <span className={styles.navLink} onClick={() => navigate("/account")}>
                                Account
                            </span>
                            <span className={styles.navLink} onClick={() => navigate("/tasks")}>
                                Daily Tasks
                            </span>
                            <span className={styles.navLink} onClick={() => navigate("/courses")}>
                                My Courses
                            </span>
                            <span className={styles.navLink} onClick={() => navigate("/settings")}>Settings</span>
                            <span
                                className={`${styles.navLink} ${styles.navLinkOutline}`}
                                onClick={handleLogout}
                            >
                                Log out
                            </span>
                        </>
                    ) : (
                        <span
                            className={`${styles.navLink} ${styles.navLinkCta}`}
                            onClick={() => navigate("/login")}
                        >
                            Get started
                        </span>
                    )}
                </div>
            </nav>
            <div className={styles.container}>
                <div className={styles.inputSection}>
                    <div className={styles.inputGroup}>
                        <input
                            placeholder="What needs to be done?"
                            value={newTask}
                            onChange={e => setNewTask(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addTask()}
                            className={`${styles.input} ${newTask ? styles['input--active'] : ''}`}
                        />
                        <button onClick={addTask} className={styles.addButton}>
                            + Add
                        </button>
                    </div>

                    <div className={styles.filterContainer}>
                        <span className={styles.filterLabel}>Filter:</span>
                        <button
                            onClick={() => setFilterPriority(null)}
                            className={`${styles.filterButton} ${filterPriority === null ? styles['filterButton--active'] : ''}`}
                            style={filterPriority === null ? { backgroundColor: '#af923a' } : undefined}
                        >
                            All
                        </button>
                        {Object.entries(PRIORITY_COLORS).map(([key, config]) => (
                            <button
                                key={key}
                                onClick={() => setFilterPriority(key)}
                                className={`${styles.filterButton} ${filterPriority === key ? styles['filterButton--active'] : ''}`}
                                style={filterPriority === key ? { backgroundColor: config.color } : undefined}
                            >
                                {config.label}
                            </button>
                        ))}
                    </div>
                </div>


                <div className={styles.boardContainer}>
                    {Object.entries(TASK_STATUSES).map(([statusKey, statusConfig]) => (
                        <div
                            key={statusKey}
                            onDragOver={handleDragOver}
                            onDrop={e => handleDrop(e, statusKey)}
                            className={styles.column}
                            style={{
                                backgroundColor: statusConfig.lightColor,
                                borderColor: statusConfig.color
                            }}
                        >
                            <div
                                className={styles.columnHeader}
                                style={{ borderBottomColor: `${statusConfig.color}40` }}
                            >
                                <span className={styles.columnIcon}>{statusConfig.icon}</span>
                                <h3
                                    className={styles.columnTitle}
                                    style={{ color: statusConfig.color }}
                                >
                                    {statusConfig.label}
                                </h3>
                                <span
                                    className={styles.columnCount}
                                    style={{ backgroundColor: statusConfig.color }}
                                >
                                    {getTasksByStatus(statusKey).length}
                                </span>
                            </div>

                            <div className={styles.tasksContainer}>
                                {getTasksByStatus(statusKey).length === 0 ? (
                                    <div className={styles.emptyState}>
                                        {filterPriority ? 'No tasks with this priority' : ' No tasks yet'}
                                    </div>
                                ) : (
                                    getTasksByStatus(statusKey).map(task => (
                                        <div
                                            key={task.id}
                                            draggable
                                            onDragStart={() => handleDragStart(task)}
                                            onClick={() => openTaskModal(task)}
                                            className={`${styles.taskCard} ${draggedTask?.id === task.id ? styles['taskCard--dragging'] : ''}`}
                                            style={{
                                                borderColor: `${statusConfig.color}40`,
                                                borderLeftColor: statusConfig.color,
                                            }}
                                        >
                                            <div className={styles.taskHeader}>
                                                <p className={styles.taskTitle}>{task.title}</p>
                                                <button
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        deleteTask(task.id);
                                                    }}
                                                    className={styles.deleteButton}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                            <div className={styles.taskFooter}>
                                                {task.priority && (
                                                    <span
                                                        className={styles.priorityBadge}
                                                        style={{
                                                            color: PRIORITY_COLORS[task.priority].color,
                                                            backgroundColor: PRIORITY_COLORS[task.priority].bgColor
                                                        }}
                                                    >
                                                        {PRIORITY_COLORS[task.priority].label}
                                                    </span>
                                                )}
                                                {task.due_date && (
                                                    <span className={styles.dueDate}>
                                                        📅 {task.due_date}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                {showModal && selectedTask && (
                    <div className={styles.modal}>
                        <div className={styles.modalContent}>
                            <div className={styles.modalHeader}>
                                <h2 className={styles.modalTitle}>Edit Task</h2>
                                <button onClick={closeModal} className={styles.modalCloseButton}>
                                    ✕
                                </button>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Title</label>
                                <input
                                    type="text"
                                    value={editingTask.title || ''}
                                    onChange={e => setEditingTask({ ...editingTask, title: e.target.value })}
                                    className={styles.formControl}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Priority</label>
                                <select
                                    value={editingTask.priority || 'medium'}
                                    onChange={e => setEditingTask({ ...editingTask, priority: e.target.value as Task['priority'] })}
                                    className={styles.formControl}
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Due Date</label>
                                <input
                                    type="date"
                                    value={editingTask.due_date || ''}
                                    onChange={e => setEditingTask({ ...editingTask, due_date: e.target.value })}
                                    className={styles.formControl}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Description</label>
                                <textarea
                                    value={editingTask.description || ''}
                                    onChange={e => setEditingTask({ ...editingTask, description: e.target.value })}
                                    className={`${styles.formControl} ${styles.textarea}`}
                                    placeholder="Add task description"
                                />
                            </div>

                            <div className={styles.buttonGroup}>
                                <button
                                    onClick={() => {
                                        if (selectedTask) updateTask(selectedTask.id, editingTask);
                                        closeModal();
                                    }}
                                    className={styles.saveButton}
                                >
                                    Save Changes
                                </button>
                                <button onClick={closeModal} className={styles.cancelButton}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>

                )}
            </div>
            <footer className={styles.footer}>
                <span>© 2026 SunDo. All rights reserved.</span>
            </footer>
        </>
    );
}