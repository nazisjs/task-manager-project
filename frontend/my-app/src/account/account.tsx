import React, { useState, useEffect } from "react";
import styles from './account.module.css';
import { useNavigate } from "react-router-dom";
import logo from "../landing page/photos/logo.svg";
import api from '../api/client';

export default function Account(props: any) {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access'));
    const [stats, setStats] = useState({
        total_courses: 0,
        completed_courses: 0,
        total_checklists: 0,
        completed_checklists: 0,
        streak_days: 0,
        total_daily_tasks: 0,
        total_completed_daily_tasks: 0,
    });
    const [recentTasks, setRecentTasks] = useState<any[]>([]);
    const [recentCourses, setRecentCourses] = useState<any[]>([]);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string>(localStorage.getItem('avatarUrl') || '');
    const [profileBio, setProfileBio] = useState<string>('');

    useEffect(() => {
        api.get('/api/user/')
            .then(res => {
                const u = res.data;
                setUserName(u.first_name && u.last_name
                    ? `${u.first_name} ${u.last_name}`
                    : u.username || 'User');
                setUserEmail(u.email || '');
                setProfileBio(u.bio || '');
            })
            .catch(err => console.error('User fetch error:', err));

        api.get('/api/statistics/')
            .then(res => setStats(res.data))
            .catch(err => console.error('Statistics error:', err));

        api.get('/api/tasks/')
            .then(res => setRecentTasks((res.data as any[]).slice(0, 4)))
            .catch(err => console.error('Tasks error:', err));

        api.get('/api/courses/')
            .then(res => setRecentCourses((res.data as any[]).slice(0, 3)))
            .catch(err => console.error('Courses error:', err));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        localStorage.removeItem('profileName');
        localStorage.removeItem('profileEmail');
        localStorage.removeItem('profileBio');
        localStorage.removeItem('loggedInUser');
        setIsLoggedIn(false);
        navigate("/landing");
    };

    const tasksDoneRate = stats.total_daily_tasks > 0
        ? Math.round((stats.total_completed_daily_tasks / stats.total_daily_tasks) * 100)
        : 0;

    const coursesDoneRate = stats.total_courses > 0
        ? Math.round((stats.completed_courses / stats.total_courses) * 100)
        : 0;

    const priorityColors: Record<string, { color: string; bg: string }> = {
        high: { color: '#dc2626', bg: '#fee2e2' },
        medium: { color: '#d97706', bg: '#fef3c7' },
        low: { color: '#8b7355', bg: '#f5e6d3' },
    };

    return (
        <div className={styles.page}>

            <nav className={styles.nav}>
                <div className={styles.navLogo} onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                    <img src={logo} className={styles.logo} alt="Logo" />
                    <span className={styles.navWordmark}>SunDo</span>
                </div>
                <div className={styles.navSpacer} />
                <div className={styles.navLinks}>
                    {isLoggedIn ? (
                        <>
                            <span className={styles.navLink} onClick={() => navigate("/account")}>Account</span>
                            <span className={styles.navLink} onClick={() => navigate("/tasks")}>Daily Tasks</span>
                            <span className={styles.navLink} onClick={() => navigate("/courses")}>My Courses</span>
                            <span className={styles.navLink} onClick={() => navigate("/settings")}>Settings</span>
                            <span className={`${styles.navLink} ${styles.navLinkOutline}`} onClick={handleLogout}>Log out</span>
                        </>
                    ) : (
                        <span className={`${styles.navLink} ${styles.navLinkCta}`} onClick={() => navigate("/login")}>Get started</span>
                    )}
                </div>
            </nav>


            <section className={styles.profileSection}>
                <div className={styles.profileInner}>
                    <div className={styles.profileLeft}>
                        <div className={styles.avatarWrap}>
                            {avatarUrl ? (
                                <img src={avatarUrl} className={styles.avatar} alt="Profile" />
                            ) : (
                                <div className={styles.avatarPlaceholder}>
                                    {userName ? userName.charAt(0).toUpperCase() : '?'}
                                </div>
                            )}
                            <div className={styles.avatarOnline} />
                        </div>
                        <div className={styles.profileMeta}>
                            <h1 className={styles.profileName}>{userName || "—"}</h1>
                            <div className={styles.profileBadges}>
                                <span className={styles.badge}>Student</span>
                                <span className={`${styles.badge} ${styles.badgeGreen}`}>Active</span>
                            </div>
                            {userEmail && <p className={styles.profileEmail}>{userEmail}</p>}
                            <p className={styles.profileBio}>{profileBio || "Explore and manage your courses, tasks, and daily progress."}</p>
                        </div>
                    </div>
                    <div className={styles.profileActions}>
                        <button className={styles.btnOutline} onClick={() => navigate("/settings")}>
                            ⚙ Settings
                        </button>
                        <button className={styles.btnPrimary} onClick={() => navigate("/tasks")}>
                            View Tasks →
                        </button>
                    </div>
                </div>
            </section>

            <section className={styles.statsStrip}>
                <div className={styles.statsInner}>
                    <div className={styles.statItem}>
                        <div className={styles.statEmoji}>🌻</div>
                        <div className={styles.statVal}>{stats.streak_days}</div>
                        <div className={styles.statLabel}>Day streak</div>
                    </div>
                    <div className={styles.statDivider} />
                    <div className={styles.statItem}>
                        <div className={styles.statEmoji}>📚</div>
                        <div className={styles.statVal}>{stats.completed_courses}<span className={styles.statOf}>/{stats.total_courses}</span></div>
                        <div className={styles.statLabel}>Courses done</div>
                    </div>
                    <div className={styles.statDivider} />
                    <div className={styles.statItem}>
                        <div className={styles.statEmoji}>✅</div>
                        <div className={styles.statVal}>{stats.completed_checklists}<span className={styles.statOf}>/{stats.total_checklists}</span></div>
                        <div className={styles.statLabel}>Tasks done</div>
                    </div>
                    <div className={styles.statDivider} />
                    <div className={styles.statItem}>
                        <div className={styles.statEmoji}>☀️</div>
                        <div className={styles.statVal}>{stats.total_completed_daily_tasks}<span className={styles.statOf}>/{stats.total_daily_tasks}</span></div>
                        <div className={styles.statLabel}>Daily tasks</div>
                    </div>
                </div>
            </section>


            <main className={styles.mainGrid}>

                <section className={styles.progressSection}>
                    <h2 className={styles.sectionTitle}>Your Progress</h2>
                    <div className={styles.progressCards}>
                        <div className={styles.progressCard}>
                            <div className={styles.progressCardTop}>
                                <span className={styles.progressCardIcon}>🎯</span>
                                <span className={styles.progressCardPct}>{tasksDoneRate}%</span>
                            </div>
                            <div className={styles.progressCardTitle}>Daily Tasks</div>
                            <div className={styles.progressTrack}>
                                <div className={styles.progressFill} style={{ width: `${tasksDoneRate}%`, background: 'linear-gradient(90deg, #f97316, #ea580c)' }} />
                            </div>
                            <div className={styles.progressCardSub}>{stats.total_completed_daily_tasks} of {stats.total_daily_tasks} completed</div>
                        </div>

                        <div className={styles.progressCard}>
                            <div className={styles.progressCardTop}>
                                <span className={styles.progressCardIcon}>📖</span>
                                <span className={styles.progressCardPct} style={{ color: '#6366f1' }}>{coursesDoneRate}%</span>
                            </div>
                            <div className={styles.progressCardTitle}>Academic Courses</div>
                            <div className={styles.progressTrack}>
                                <div className={styles.progressFill} style={{ width: `${coursesDoneRate}%`, background: 'linear-gradient(90deg, #6366f1, #4f46e5)' }} />
                            </div>
                            <div className={styles.progressCardSub}>{stats.completed_courses} of {stats.total_courses} completed</div>
                        </div>

                        <div className={styles.progressCard}>
                            <div className={styles.progressCardTop}>
                                <span className={styles.progressCardIcon}>📋</span>
                                <span className={styles.progressCardPct} style={{ color: '#4a7c59' }}>
                                    {stats.total_checklists > 0 ? Math.round((stats.completed_checklists / stats.total_checklists) * 100) : 0}%
                                </span>
                            </div>
                            <div className={styles.progressCardTitle}>Checklists</div>
                            <div className={styles.progressTrack}>
                                <div className={styles.progressFill} style={{
                                    width: `${stats.total_checklists > 0 ? Math.round((stats.completed_checklists / stats.total_checklists) * 100) : 0}%`,
                                    background: 'linear-gradient(90deg, #4a7c59, #2d6a4f)'
                                }} />
                            </div>
                            <div className={styles.progressCardSub}>{stats.completed_checklists} of {stats.total_checklists} done</div>
                        </div>
                    </div>
                </section>


                <section className={styles.recentSection}>
                    <div className={styles.recentHeader}>
                        <h2 className={styles.sectionTitle}>Recent Tasks</h2>
                        <span className={styles.seeAll} onClick={() => navigate('/tasks')}>See all →</span>
                    </div>
                    <div className={styles.recentList}>
                        {recentTasks.length === 0 ? (
                            <div className={styles.emptyState}>
                                <span className={styles.emptyIcon}>📝</span>
                                <p>No tasks yet. <span className={styles.emptyLink} onClick={() => navigate('/tasks')}>Create your first task</span></p>
                            </div>
                        ) : recentTasks.map(task => (
                            <div key={task.id} className={styles.taskRow} onClick={() => navigate('/tasks')}>
                                <div className={styles.taskRowLeft}>
                                    <div className={`${styles.taskDot} ${task.status === 'completed' ? styles.taskDotDone : task.status === 'in_progress' ? styles.taskDotProgress : ''}`} />
                                    <span className={`${styles.taskRowTitle} ${task.status === 'completed' ? styles.taskDone : ''}`}>{task.title}</span>
                                </div>
                                <div className={styles.taskRowRight}>
                                    {task.priority && (
                                        <span className={styles.taskPriority} style={{
                                            color: priorityColors[task.priority]?.color,
                                            background: priorityColors[task.priority]?.bg
                                        }}>
                                            {task.priority}
                                        </span>
                                    )}
                                    <span className={styles.taskStatus}>{task.status.replace('_', ' ')}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>


                <section className={styles.recentSection}>
                    <div className={styles.recentHeader}>
                        <h2 className={styles.sectionTitle}>Your Courses</h2>
                        <span className={styles.seeAll} onClick={() => navigate('/courses')}>See all →</span>
                    </div>
                    <div className={styles.recentList}>
                        {recentCourses.length === 0 ? (
                            <div className={styles.emptyState}>
                                <span className={styles.emptyIcon}>📚</span>
                                <p>No courses yet. <span className={styles.emptyLink} onClick={() => navigate('/courses')}>Add a course</span></p>
                            </div>
                        ) : recentCourses.map((course: any) => {
                            const done = course.checklists?.filter((c: any) => c.completed)?.length ?? 0;
                            const total = course.checklists?.length ?? 0;
                            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                            return (
                                <div key={course.id} className={styles.courseRow} onClick={() => navigate('/courses')}>
                                    <div className={styles.courseRowLeft}>
                                        <div className={styles.courseEmoji}>{course.emoji || '📘'}</div>
                                        <div>
                                            <div className={styles.courseRowTitle}>{course.title}</div>
                                            <div className={styles.courseRowSub}>{done}/{total} lessons</div>
                                        </div>
                                    </div>
                                    <div className={styles.courseRowRight}>
                                        <div className={styles.miniTrack}>
                                            <div className={styles.miniFill} style={{ width: `${pct}%` }} />
                                        </div>
                                        <span className={styles.miniPct}>{pct}%</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </main>


            <section className={styles.ctaBanner}>
                <h2 className={styles.ctaTitle}>Keep the streak alive.</h2>
                <p className={styles.ctaSub}>You're on a {stats.streak_days}-day streak. Don't break it now.</p>
                <button className={styles.ctaBtn} onClick={() => navigate('/tasks')}>Go to Daily Tasks →</button>
            </section>

            <footer className={styles.footer}>
                <span>© 2026 SunDo. All rights reserved.</span>
            </footer>
        </div>
    );
}


