import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from '../api/client';
import styles from './courses.module.css';
import logo from "../landing page/photos/logo.svg";

interface Checklist {
    id: number;
    title: string;
    completed: boolean;
    course: number;
}

interface Course {
    id: number;
    title: string;
    description?: string;
    status: 'to_do' | 'in_progress' | 'completed';
    priority?: 'low' | 'medium' | 'high';
    due_date?: string;
    checklists: Checklist[];
    progress_percent: number;
}

const STATUS_COLORS = {
    to_do: { label: 'To Do', color: '#754c17', bg: '#ece8d7' },
    in_progress: { label: 'In Progress', color: '#9f9a58', bg: '#feffed' },
    completed: { label: 'Completed', color: '#4a7c59', bg: '#eaf5ee' },
};

const PRIORITY_COLORS = {
    low: { color: '#8b7355', bg: '#f5e6d3' },
    medium: { color: '#d97706', bg: '#fef3c7' },
    high: { color: '#dc2626', bg: '#fee2e2' },
}

export default function Courses() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access'));
    const [courses, setCourses] = useState<Course[]>([]);
    const [expandedCourse, setExpandedCourse] = useState<number | null>(null);

    const [showNewCourse, setShowNewCourse] = useState(false);
    const [newCourseTitle, setNewCourseTitle] = useState('');
    const [newCourseDesc, setNewCourseDesc] = useState('');
    const [newCoursePriority, setNewCoursePriority] = useState<'low' | 'medium' | 'high'>('medium');
    const [newCourseDue, setNewCourseDue] = useState('');

    const [newChecklistInputs, setNewChecklistInputs] = useState<Record<number, string>>({});
    const handleLogout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        setIsLoggedIn(false);
        navigate('/login');
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = () => {
        api.get('/courses/')
            .then(res => setCourses(res.data))
            .catch(err => console.error('Courses error:', err));
    };

    const addCourse = () => {
        if (!newCourseTitle.trim()) return;
        api.post('/courses/', {
            title: newCourseTitle,
            description: newCourseDesc,
            status: 'to_do',
            priority: newCoursePriority,
            due_date: newCourseDue || null,
        })
            .then(res => {
                setCourses([...courses, { ...res.data, checklists: [], progress_percent: 0 }]);
                setNewCourseTitle('');
                setNewCourseDesc('');
                setNewCourseDue('');
                setNewCoursePriority('medium');
                setShowNewCourse(false);
            })
            .catch(err => console.error('Add course error:', err));
    };

    const deleteCourse = (id: number) => {
        api.delete(`/courses/${id}/`)
            .then(() => setCourses(courses.filter(c => c.id !== id)))
            .catch(err => console.error('Delete course error:', err));
    };

    const updateCourseStatus = (id: number, status: Course['status']) => {
        api.patch(`/courses/${id}/`, { status })
            .then(res => setCourses(courses.map(c => c.id === id ? { ...c, ...res.data } : c)))
            .catch(err => console.error('Update status error:', err));
    };

    const addChecklist = (courseId: number) => {
        const title = newChecklistInputs[courseId]?.trim();
        if (!title) return;
        api.post('/checklists/', { title, completed: false, course: courseId })
            .then(res => {
                setCourses(courses.map(c => {
                    if (c.id !== courseId) return c;
                    const updated = { ...c, checklists: [...c.checklists, res.data] };
                    updated.progress_percent = calcProgress(updated.checklists);
                    return updated;
                }));
                setNewChecklistInputs({ ...newChecklistInputs, [courseId]: '' });
            })
            .catch(err => console.error('Add checklist error:', err));
    };

    const toggleChecklist = (courseId: number, item: Checklist) => {
        api.patch(`/checklists/${item.id}/`, { completed: !item.completed })
            .then(res => {
                setCourses(courses.map(c => {
                    if (c.id !== courseId) return c;
                    const updatedChecklists = c.checklists.map(ch =>
                        ch.id === item.id ? res.data : ch
                    );
                    return {
                        ...c,
                        checklists: updatedChecklists,
                        progress_percent: calcProgress(updatedChecklists)
                    };
                }));
            })
            .catch(err => console.error('Toggle checklist error:', err));
    };

    const deleteChecklist = (courseId: number, checklistId: number) => {
        api.delete(`/checklists/${checklistId}/`)
            .then(() => {
                setCourses(courses.map(c => {
                    if (c.id !== courseId) return c;
                    const updatedChecklists = c.checklists.filter(ch => ch.id !== checklistId);
                    return {
                        ...c,
                        checklists: updatedChecklists,
                        progress_percent: calcProgress(updatedChecklists)
                    };
                }));
            })
            .catch(err => console.error('Delete checklist error:', err));
    };

    const calcProgress = (checklists: Checklist[]) => {
        if (checklists.length === 0) return 0;
        const done = checklists.filter(ch => ch.completed).length;
        return Math.round((done / checklists.length) * 100);
    };


    return (
        <>
            <nav className={styles.nav}>
                <div className={styles.navLogo}>
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
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>My Courses</h1>
                        <p className={styles.subtitle}>Track your self-learning progress</p>
                    </div>
                    <button className={styles.addCourseBtn} onClick={() => setShowNewCourse(!showNewCourse)}>
                        Add a new course
                    </button>
                </div>
                {showNewCourse && (
                    <div className={styles.newCourseForm}>
                        <input
                            className={styles.formInput}
                            placeholder="Course title"
                            value={newCourseTitle}
                            onChange={e => setNewCourseTitle(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addCourse()}
                        />
                        <textarea
                            className={styles.formTextarea}
                            placeholder="Description (optional)"
                            value={newCourseDesc}
                            onChange={e => setNewCourseDesc(e.target.value)}
                        />
                        <div className={styles.formRow}>
                            <select
                                className={styles.formSelect}
                                value={newCoursePriority}
                                onChange={e => setNewCoursePriority(e.target.value as any)}
                            >
                                <option value="low">Low Priority</option>
                                <option value="medium">Medium Priority</option>
                                <option value="high">High Priority</option>
                            </select>
                            <input
                                className={styles.formInput}
                                type="date"
                                value={newCourseDue}
                                onChange={e => setNewCourseDue(e.target.value)}
                            />
                        </div>
                        <div className={styles.formButtons}>
                            <button className={styles.saveBtn} onClick={addCourse}>Create</button>
                            <button className={styles.cancelBtn} onClick={() => setShowNewCourse(false)}>Cancel</button>
                        </div>
                    </div>
                )}

                <div className={styles.coursesList}>
                    {courses.length === 0 ? (
                        <div className={styles.emptyState}>
                            No courses yet — create your first one!
                        </div>
                    ) : (
                        courses.map(course => {
                            const statusConfig = STATUS_COLORS[course.status] || STATUS_COLORS.to_do;
                            const priorityConfig = course.priority ? PRIORITY_COLORS[course.priority] : null;
                            const isExpanded = expandedCourse === course.id;

                            return (
                                <div key={course.id} className={styles.courseCard} style={course.progress_percent === 100 ? { borderColor: '#4a7c59', backgroundColor: '#f0faf4' } : undefined}>
                                    <div className={styles.courseHeader} onClick={() => setExpandedCourse(isExpanded ? null : course.id)}>
                                        <div className={styles.courseLeft}>
                                            <span className={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</span>
                                            <div>
                                                <h3 className={styles.courseTitle}>
                                                    {course.progress_percent === 100 ? '🎉 ' : ''}
                                                    {course.title}
                                                    {course.progress_percent === 100 && (
                                                        <span style={{ fontSize: '12px', color: '#4a7c59', marginLeft: '8px', fontWeight: 400 }}>
                                                            Completed!
                                                        </span>
                                                    )}
                                                </h3>
                                                {course.description && (
                                                    <p className={styles.courseDesc}>{course.description}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className={styles.courseRight} onClick={e => e.stopPropagation()}>
                                            {priorityConfig && (
                                                <span className={styles.priorityBadge} style={{ color: priorityConfig.color, backgroundColor: priorityConfig.bg }}>
                                                    {course.priority}
                                                </span>
                                            )}
                                            <select
                                                className={styles.statusSelect}
                                                value={course.status}
                                                style={{ color: statusConfig.color, backgroundColor: statusConfig.bg }}
                                                onChange={e => updateCourseStatus(course.id, e.target.value as Course['status'])}
                                            >
                                                <option value="to_do">To Do</option>
                                                <option value="in_progress">In Progress</option>
                                                <option value="completed">Completed</option>
                                            </select>
                                            {course.due_date && (
                                                <span className={styles.dueDate}>📅 {course.due_date}</span>
                                            )}
                                            <button className={styles.deleteBtn} onClick={() => deleteCourse(course.id)}>✕</button>
                                        </div>
                                    </div>

                                    <div className={styles.progressContainer}>
                                        <div className={styles.progressBar}>
                                            <div
                                                className={styles.progressFill}
                                                style={{ width: `${course.progress_percent}%` }}
                                            />
                                        </div>
                                        <span className={styles.progressText}>{course.progress_percent}%</span>
                                    </div>

                                    {isExpanded && (
                                        <div className={styles.checklistContainer}>
                                            {course.checklists.length === 0 && (
                                                <p className={styles.emptyChecklist}>No items yet</p>
                                            )}
                                            {course.checklists.map(item => (
                                                <div key={item.id} className={styles.checklistItem}>
                                                    <input
                                                        type="checkbox"
                                                        checked={item.completed}
                                                        onChange={() => toggleChecklist(course.id, item)}
                                                        className={styles.checkbox}
                                                    />
                                                    <span className={`${styles.checklistTitle} ${item.completed ? styles.checklistDone : ''}`}>
                                                        {item.title}
                                                    </span>
                                                    <button
                                                        className={styles.deleteChecklistBtn}
                                                        onClick={() => deleteChecklist(course.id, item.id)}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}

                                            <div className={styles.addChecklistRow}>
                                                <input
                                                    className={styles.checklistInput}
                                                    placeholder="Add item"
                                                    value={newChecklistInputs[course.id] || ''}
                                                    onChange={e => setNewChecklistInputs({ ...newChecklistInputs, [course.id]: e.target.value })}
                                                    onKeyDown={e => e.key === 'Enter' && addChecklist(course.id)}
                                                />
                                                <button className={styles.addChecklistBtn} onClick={() => addChecklist(course.id)}>
                                                    + Add
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
            <footer className={styles.footer}>
                <span>© 2026 SunDo. All rights reserved.</span>
            </footer>
        </>

    );
}