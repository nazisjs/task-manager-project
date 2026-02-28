import React, { useState, useEffect } from "react";
import styles from './account.module.css';
import { useNavigate } from "react-router-dom";
import api from '../api/client'; // ✅ import your api client

// Types
interface Course {
    id: number
    title: string
    status: string
}

interface Task {
    id: number
    title: string
    completed: boolean
}

export default (props: any) => {
    const navigate = useNavigate();

    const [input1, onChangeInput1] = useState('');
    const [input2, onChangeInput2] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    // ✅ Real data from Django
    const [courses, setCourses] = useState<Course[]>([])
    const [tasks, setTasks] = useState<Task[]>([])
    const [newTask, setNewTask] = useState('')

    // ✅ Fetch courses and tasks on load
    useEffect(() => {
        api.get('/courses/')
            .then(res => setCourses(res.data))
            .catch(err => console.error('Courses error:', err))

        api.get('/tasks/')
            .then(res => setTasks(res.data))
            .catch(err => console.error('Tasks error:', err))
    }, [])

    // ✅ Add task
    const addTask = () => {
        if (!newTask.trim()) return
        api.post('/tasks/', { title: newTask, completed: false })
            .then(res => setTasks([...tasks, res.data]))
        setNewTask('')
    }

    // ✅ Delete task
    const deleteTask = (id: number) => {
        api.delete(`/tasks/${id}/`)
            .then(() => setTasks(tasks.filter(t => t.id !== id)))
    }

    // ✅ Toggle task complete
    const toggleTask = (task: Task) => {
        api.patch(`/tasks/${task.id}/`, { completed: !task.completed })
            .then(res => setTasks(tasks.map(t => t.id === task.id ? res.data : t)))
    }

    const handleLogout = () => {
        setIsLoggedIn(false);
        navigate("/login");
    };

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    return (
        <div className={styles["contain"]}>
            <div className={styles["column"]}>

                {/* --- Your existing navbar stays the same --- */}

                {/* ✅ REPLACE hardcoded courses with real data */}
                <div className={styles["row-view6"]}>
                    <div className={styles["column5"]}>
                        <span className={styles["text5"]}>{"Your Courses"}</span>
                        <span className={styles["text6"]}>{"Current courses you are enrolled in."}</span>
                    </div>
                    <div className={styles["column6"]}>
                        {courses.length === 0 ? (
                            <span className={styles["text6"]}>No courses yet.</span>
                        ) : (
                            courses.map(course => (
                                <div key={course.id} className={styles["row-view7"]}>
                                    <div className={styles["view3"]}>
                                        <span className={styles["text11"]}>{"📘"}</span>
                                    </div>
                                    <div className={styles["view4"]}>
                                        <span className={styles["text12"]}>{course.title}</span>
                                    </div>
                                    <span className={styles["text12"]}>{course.status}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* ✅ NEW Tasks section */}
                <div className={styles["row-view6"]}>
                    <div className={styles["column8"]}>
                        <span className={styles["text5"]}>{"Your Tasks"}</span>
                        <span className={styles["text6"]}>{"Manage your tasks."}</span>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                            <input
                                placeholder="New task..."
                                value={newTask}
                                onChange={e => setNewTask(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && addTask()}
                                className={styles["input"]}
                            />
                            <button className={styles["button5"]} onClick={addTask}>
                                <span className={styles["text7"]}>Add</span>
                            </button>
                        </div>
                    </div>
                    <div className={styles["column9"]}>
                        {tasks.length === 0 ? (
                            <span className={styles["text6"]}>No tasks yet.</span>
                        ) : (
                            tasks.map(task => (
                                <div key={task.id} className={styles["row-view9"]} style={{ alignItems: 'center', gap: '8px' }}>
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => toggleTask(task)}
                                    />
                                    <span className={styles["text13"]} style={{
                                        textDecoration: task.completed ? 'line-through' : 'none',
                                        flex: 1
                                    }}>
                                        {task.title}
                                    </span>
                                    <button onClick={() => deleteTask(task.id)} className={styles["button"]}>
                                        <span className={styles["text6"]}>Delete</span>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* --- Rest of your existing component stays the same --- */}

            </div>
        </div>
    )
}