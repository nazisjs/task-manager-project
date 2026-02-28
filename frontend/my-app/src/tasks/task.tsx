import { useState, useEffect } from 'react'
import api from '../api/client'
import { useNavigate } from 'react-router-dom'

interface Task {
    id: number
    title: string
    completed: boolean
}

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [newTask, setNewTask] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        api.get('/tasks/')
            .then(res => setTasks(res.data))
            .catch(err => console.error(err))
    }, [])

    const addTask = () => {
        if (!newTask.trim()) return
        api.post('/tasks/', { title: newTask, completed: false })
            .then(res => setTasks([...tasks, res.data]))
        setNewTask('')
    }

    const deleteTask = (id: number) => {
        api.delete(`/tasks/${id}/`)
            .then(() => setTasks(tasks.filter(t => t.id !== id)))
    }

    const toggleTask = (task: Task) => {
        api.patch(`/tasks/${task.id}/`, { completed: !task.completed })
            .then(res => setTasks(tasks.map(t => t.id === task.id ? res.data : t)))
    }

    return (
        <div style={{ maxWidth: '600px', margin: '40px auto', padding: '0 20px' }}>
            <button onClick={() => navigate('/account')} style={{ marginBottom: '20px' }}>
                ← Назад
            </button>
            <h1>Your Tasks</h1>

            <div style={{ display: 'flex', gap: '8px', margin: '20px 0' }}>
                <input
                    placeholder="New task..."
                    value={newTask}
                    onChange={e => setNewTask(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addTask()}
                    style={{ flex: 1, padding: '8px' }}
                />
                <button onClick={addTask}>Add</button>
            </div>

            {tasks.length === 0 ? (
                <p>No tasks yet.</p>
            ) : (
                tasks.map(task => (
                    <div key={task.id} style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '12px', border: '1px solid #eee', borderRadius: '8px', marginBottom: '8px'
                    }}>
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleTask(task)}
                        />
                        <span style={{
                            flex: 1,
                            textDecoration: task.completed ? 'line-through' : 'none',
                            color: task.completed ? '#999' : '#000'
                        }}>
                            {task.title}
                        </span>
                        <button onClick={() => deleteTask(task.id)}>Delete</button>
                    </div>
                ))
            )}
        </div>
    )
}