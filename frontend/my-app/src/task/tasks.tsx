import React, { useState, useEffect, CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import api from '../api/client';

interface Task {
    id: number;
    title: string;
    description?: string;
    status: 'in_progress' | 'completed' | 'denied';
    priority?: 'low' | 'medium' | 'high';
    due_date?: string;
    completed: boolean;
}

const TASK_STATUSES = {
    in_progress: {
        label: 'In Progress',
        color: '#0066cc',
        lightColor: '#e6f2ff',
        darkColor: '#003d99',
        icon: '⚡'
    },
    completed: {
        label: 'Completed',
        color: '#00aa44',
        lightColor: '#e6f7f0',
        darkColor: '#006b2d',
        icon: '✓'
    },
    denied: {
        label: 'Denied',
        color: '#dd0000',
        lightColor: '#ffe6e6',
        darkColor: '#990000',
        icon: '✕'
    }
};

const PRIORITY_COLORS = {
    low: { color: '#8b7355', bgColor: '#f5e6d3', label: '◯ Low' },
    medium: { color: '#d97706', bgColor: '#fef3c7', label: '◉ Medium' },
    high: { color: '#dc2626', bgColor: '#fee2e2', label: '● High' }
};

export default function KanbanBoard() {
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
        api.get('/tasks/')
            .then(res => setTasks(res.data))
            .catch(err => console.error('Tasks error:', err));
    };

    const addTask = () => {
        if (!newTask.trim()) return;
        api.post('/tasks/', {
            title: newTask,
            status: 'in_progress',
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
        api.delete(`/tasks/${id}/`)
            .then(() => setTasks(tasks.filter(t => t.id !== id)))
            .catch(err => console.error('Delete error:', err));
    };

    const updateTask = (taskId: number, updates: Partial<Task>) => {
        api.patch(`/tasks/${taskId}/`, updates)
            .then(res => {
                setTasks(tasks.map(t => t.id === taskId ? res.data : t));
                setSelectedTask(res.data);
            })
            .catch(err => console.error('Update error:', err));
    };

    const updateTaskStatus = (taskId: number, newStatus: string) => {
        updateTask(taskId, { status: newStatus as any });
    };

    const handleDragStart = (task: Task) => {
        setDraggedTask(task);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, status: string) => {
        e.preventDefault();
        if (draggedTask) {
            updateTaskStatus(draggedTask.id, status);
            setDraggedTask(null);
        }
    };

    const getTasksByStatus = (status: string) => {
        return tasks.filter(t => {
            if (t.status !== status) return false;
            if (filterPriority && t.priority !== filterPriority) return false;
            return true;
        });
    };

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

    const styles = {
        container: {
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f8fafc 0%, #eef2f7 100%)',
            padding: '40px 20px',
            fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
        } as CSSProperties,
        header: {
            maxWidth: '1400px',
            margin: '0 auto 40px',
            paddingBottom: '30px',
            borderBottom: '2px solid rgba(0,0,0,0.08)'
        } as CSSProperties,
        title: {
            fontSize: '42px',
            fontWeight: '800',
            margin: '0 0 8px 0',
            color: '#0f172a',
            letterSpacing: '-1px'
        } as CSSProperties,
        subtitle: {
            fontSize: '16px',
            color: '#64748b',
            margin: 0
        } as CSSProperties,
        inputSection: {
            maxWidth: '1400px',
            margin: '0 auto 40px',
            background: '#ffffff',
            padding: '28px',
            borderRadius: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.06)'
        } as CSSProperties,
        inputGroup: {
            display: 'flex',
            gap: '12px',
            marginBottom: '16px'
        } as CSSProperties,
        input: {
            flex: 1,
            padding: '12px 16px',
            border: '1.5px solid #e2e8f0',
            borderRadius: '10px',
            fontSize: '15px',
            fontFamily: 'inherit',
            transition: 'all 0.3s ease',
            outline: 'none'
        } as CSSProperties,
        addButton: {
            padding: '12px 28px',
            background: 'linear-gradient(135deg, #0066cc 0%, #003d99 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '15px',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(0, 102, 204, 0.3)'
        } as CSSProperties,
        filterContainer: {
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            flexWrap: 'wrap' as const
        } as CSSProperties,
        filterLabel: {
            fontSize: '13px',
            fontWeight: '600',
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
        } as CSSProperties,
        filterButton: (isActive: boolean, color: string): CSSProperties => ({
            padding: '6px 14px',
            backgroundColor: isActive ? color : '#e2e8f0',
            color: isActive ? 'white' : '#475569',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600',
            transition: 'all 0.2s ease'
        }),
        boardContainer: {
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '24px'
        } as CSSProperties,
        column: (config: any): CSSProperties => ({
            background: config.lightColor,
            border: `2px solid ${config.color}`,
            borderRadius: '16px',
            padding: '20px',
            minHeight: '700px',
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.3s ease'
        }),
        columnHeader: (config: any): CSSProperties => ({
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '20px',
            paddingBottom: '16px',
            borderBottom: `2px solid ${config.color}40`
        }),
        columnTitle: (config: any): CSSProperties => ({
            fontSize: '18px',
            fontWeight: '700',
            color: config.color,
            margin: 0,
            flex: 1,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
        }),
        columnCount: (config: any): CSSProperties => ({
            fontSize: '13px',
            fontWeight: '700',
            color: 'white',
            backgroundColor: config.color,
            padding: '6px 12px',
            borderRadius: '8px',
            minWidth: '32px',
            textAlign: 'center'
        }),
        tasksContainer: {
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            flex: 1
        } as CSSProperties,
        emptyState: {
            textAlign: 'center',
            color: '#94a3b8',
            fontSize: '14px',
            padding: '60px 20px',
            fontStyle: 'italic'
        } as CSSProperties,
        taskCard: (isDragged: boolean, config: any): CSSProperties => ({
            background: '#ffffff',
            border: `2px solid ${config.color}40`,
            borderLeft: `4px solid ${config.color}`,
            borderRadius: '12px',
            padding: '14px',
            cursor: 'grab',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: isDragged
                ? `0 20px 40px ${config.color}40`
                : '0 2px 8px rgba(0,0,0,0.06)',
            opacity: isDragged ? 0.6 : 1,
            transform: isDragged ? 'scale(1.05) rotate(2deg)' : 'scale(1) rotate(0deg)'
        }),
        taskTitle: {
            margin: '0 0 10px 0',
            fontSize: '15px',
            fontWeight: '600',
            color: '#1e293b',
            wordBreak: 'break-word'
        } as CSSProperties,
        taskFooter: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '8px'
        } as CSSProperties,
        priorityBadge: (priority: string): CSSProperties => ({
            fontSize: '11px',
            fontWeight: '700',
            color: PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS].color,
            backgroundColor: PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS].bgColor,
            padding: '4px 8px',
            borderRadius: '6px',
            textTransform: 'uppercase',
            letterSpacing: '0.3px'
        }),
        deleteButton: {
            background: 'none',
            border: 'none',
            color: '#ef4444',
            cursor: 'pointer',
            fontSize: '18px',
            padding: '0',
            fontWeight: '700',
            transition: 'all 0.2s ease'
        } as CSSProperties,
        modal: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
        } as CSSProperties,
        modalContent: {
            background: '#ffffff',
            borderRadius: '20px',
            padding: '40px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
            animation: 'slideUp 0.3s ease'
        } as CSSProperties,
        modalHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '28px'
        } as CSSProperties,
        modalTitle: {
            margin: 0,
            fontSize: '24px',
            fontWeight: '700',
            color: '#0f172a'
        } as CSSProperties,
        formGroup: {
            marginBottom: '20px'
        } as CSSProperties,
        label: {
            fontSize: '12px',
            fontWeight: '700',
            color: '#64748b',
            display: 'block',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
        } as CSSProperties,
        input2: {
            width: '100%',
            padding: '12px 16px',
            border: '1.5px solid #e2e8f0',
            borderRadius: '10px',
            fontSize: '15px',
            boxSizing: 'border-box',
            fontFamily: 'inherit',
            transition: 'all 0.3s ease'
        } as CSSProperties,
        buttonGroup: {
            display: 'flex',
            gap: '12px',
            marginTop: '32px'
        } as CSSProperties,
        saveButton: {
            flex: 1,
            padding: '12px',
            background: 'linear-gradient(135deg, #0066cc 0%, #003d99 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: '700',
            fontSize: '15px',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(0, 102, 204, 0.3)'
        } as CSSProperties,
        cancelButton: {
            flex: 1,
            padding: '12px',
            backgroundColor: '#f1f5f9',
            color: '#475569',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: '700',
            fontSize: '15px',
            transition: 'all 0.3s ease'
        } as CSSProperties
    };

    return (
        <div style={styles.container}>
            <style>{`
                @keyframes slideUp {
                    from {
                        transform: translateY(20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                input:focus {
                    border-color: #0066cc !important;
                    box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1) !important;
                }

                select:focus {
                    border-color: #0066cc !important;
                    box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1) !important;
                }

                button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12) !important;
                }
            `}</style>

            <div style={styles.header}>
                <h1 style={styles.title}>📋 Task Manager</h1>
                <p style={styles.subtitle}>Organize your tasks with drag-and-drop Kanban board</p>
            </div>

            <div style={styles.inputSection}>
                <div style={styles.inputGroup}>
                    <input
                        placeholder="✏️ What needs to be done?"
                        value={newTask}
                        onChange={e => setNewTask(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addTask()}
                        style={{ ...styles.input, borderColor: newTask ? '#0066cc' : '#e2e8f0' }}
                    />
                    <button
                        onClick={addTask}
                        style={styles.addButton}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        + Add
                    </button>
                </div>

                <div style={styles.filterContainer}>
                    <span style={styles.filterLabel}>Filter:</span>
                    <button
                        onClick={() => setFilterPriority(null)}
                        style={styles.filterButton(filterPriority === null, '#0066cc')}
                    >
                        All
                    </button>
                    {Object.entries(PRIORITY_COLORS).map(([key, config]) => (
                        <button
                            key={key}
                            onClick={() => setFilterPriority(key)}
                            style={styles.filterButton(filterPriority === key, config.color)}
                        >
                            {config.label}
                        </button>
                    ))}
                </div>
            </div>

            <div style={styles.boardContainer}>
                {Object.entries(TASK_STATUSES).map(([statusKey, statusConfig]: any) => (
                    <div
                        key={statusKey}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, statusKey)}
                        style={styles.column(statusConfig)}
                    >
                        <div style={styles.columnHeader(statusConfig)}>
                            <span style={{ fontSize: '24px' }}>{statusConfig.icon}</span>
                            <h3 style={styles.columnTitle(statusConfig)}>
                                {statusConfig.label}
                            </h3>
                            <span style={styles.columnCount(statusConfig)}>
                                {getTasksByStatus(statusKey).length}
                            </span>
                        </div>

                        <div style={styles.tasksContainer}>
                            {getTasksByStatus(statusKey).length === 0 ? (
                                <div style={styles.emptyState}>
                                    {filterPriority ? '🔍 No tasks with this priority' : '📭 No tasks yet'}
                                </div>
                            ) : (
                                getTasksByStatus(statusKey).map(task => (
                                    <div
                                        key={task.id}
                                        draggable
                                        onDragStart={() => handleDragStart(task)}
                                        onClick={() => openTaskModal(task)}
                                        style={styles.taskCard(draggedTask?.id === task.id, statusConfig)}
                                        onMouseOver={(e) => {
                                            if (draggedTask?.id !== task.id) {
                                                e.currentTarget.style.boxShadow = `0 12px 24px ${statusConfig.color}30`;
                                                e.currentTarget.style.transform = 'translateY(-4px)';
                                            }
                                        }}
                                        onMouseOut={(e) => {
                                            if (draggedTask?.id !== task.id) {
                                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                                                e.currentTarget.style.transform = 'translateY(0)';
                                            }
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '12px' }}>
                                            <p style={styles.taskTitle}>
                                                {task.title}
                                            </p>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteTask(task.id);
                                                }}
                                                style={styles.deleteButton}
                                                onMouseOver={(e) => e.currentTarget.style.fontSize = '20px'}
                                                onMouseOut={(e) => e.currentTarget.style.fontSize = '18px'}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                        <div style={styles.taskFooter}>
                                            {task.priority && (
                                                <span style={styles.priorityBadge(task.priority)}>
                                                    {PRIORITY_COLORS[task.priority as keyof typeof PRIORITY_COLORS].label}
                                                </span>
                                            )}
                                            {task.due_date && (
                                                <span style={{ fontSize: '12px', color: '#94a3b8' }}>
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
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <div style={styles.modalHeader}>
                            <h2 style={styles.modalTitle}>Edit Task</h2>
                            <button
                                onClick={closeModal}
                                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#94a3b8' }}
                            >
                                ✕
                            </button>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Title</label>
                            <input
                                type="text"
                                value={editingTask.title || ''}
                                onChange={e => setEditingTask({ ...editingTask, title: e.target.value })}
                                style={styles.input2}
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Priority</label>
                            <select
                                value={editingTask.priority || 'medium'}
                                onChange={e => setEditingTask({ ...editingTask, priority: e.target.value as any })}
                                style={styles.input2}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Due Date</label>
                            <input
                                type="date"
                                value={editingTask.due_date || ''}
                                onChange={e => setEditingTask({ ...editingTask, due_date: e.target.value })}
                                style={styles.input2}
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Description</label>
                            <textarea
                                value={editingTask.description || ''}
                                onChange={e => setEditingTask({ ...editingTask, description: e.target.value })}
                                style={{ ...styles.input2, minHeight: '100px', resize: 'vertical' }}
                                placeholder="Add task description..."
                            />
                        </div>

                        <div style={styles.buttonGroup}>
                            <button
                                onClick={() => {
                                    if (selectedTask) {
                                        updateTask(selectedTask.id, editingTask);
                                    }
                                    closeModal();
                                }}
                                style={styles.saveButton}
                            >
                                Save Changes
                            </button>
                            <button
                                onClick={closeModal}
                                style={styles.cancelButton}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
