import styles from "./home.module.css";
import React, { FC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./photos/logo.svg";
import api from "../api/client";

export const Home: FC = () => {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem("access");
    const [userName, setUserName] = useState("");
    const [stats, setStats] = useState({
        streak_days: 0,
        total_daily_tasks: 0,
        total_completed_daily_tasks: 0,
        completed_courses: 0,
        total_courses: 0,
        completed_checklists: 0,
        total_checklists: 0,
    });
    const [recentTasks, setRecentTasks] = useState<any[]>([]);
    const [recentCourses, setRecentCourses] = useState<any[]>([]);

    useEffect(() => {
        if (!isLoggedIn) return;
        api.get("/api/user/")
            .then((res) => {
                const u = res.data;
                setUserName(u.first_name && u.last_name
                    ? `${u.first_name} ${u.last_name}`
                    : u.username || "there");
            })
            .catch(() => { });

        api.get("/api/statistics/")
            .then((res) => setStats(res.data))
            .catch(() => { });

        api.get("/api/tasks/")
            .then((res) => setRecentTasks((res.data as any[]).slice(0, 4)))
            .catch(() => { });

        api.get("/api/courses/")
            .then((res) => setRecentCourses((res.data as any[]).slice(0, 3)))
            .catch(() => { });
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("profileName");
        localStorage.removeItem("profileEmail");
        localStorage.removeItem("profileBio");
        localStorage.removeItem("avatarUrl");
        localStorage.removeItem("loggedInUser");
        navigate("/landing");
    };

    const avatarUrl = localStorage.getItem("avatarUrl") || "";
    const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
    const tasksLeft = stats.total_daily_tasks - stats.total_completed_daily_tasks;
    const tasksPct = stats.total_daily_tasks > 0
        ? Math.round((stats.total_completed_daily_tasks / stats.total_daily_tasks) * 100)
        : 0;

    const priorityColors: Record<string, { color: string; bg: string }> = {
        high: { color: "#dc2626", bg: "#fee2e2" },
        medium: { color: "#d97706", bg: "#fef3c7" },
        low: { color: "#8b7355", bg: "#f5e6d3" },
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

            <section className={styles.hero}>
                <div className={styles.heroCopy}>
                    <div className={styles.heroKicker}>
                        {isLoggedIn ? today : "Stop putting it off."}
                    </div>
                    <h1 className={styles.heroTitle}>
                        {isLoggedIn ? <>Welcome back,<br /><span className={styles.heroUnderline}>{userName || "friend"}.</span></> : <>Your routines,<br /><span className={styles.heroUnderline}>done daily.</span></>}
                    </h1>
                    <p className={styles.heroSub}>
                        {isLoggedIn
                            ? stats.streak_days > 0
                                ? <>You're on a <strong>{stats.streak_days}-day streak</strong> 🌻 - keep the momentum going.</>
                                : <>Complete a task today to <strong>start your streak</strong> and build the habit.</>
                            : <>SunDo splits your life into two simple tracks — <strong>Daily</strong> habits and <strong>Academic</strong> goals. You build the plan. SunDo keeps you honest.</>
                        }
                    </p>
                    <div className={styles.heroActions}>
                        {isLoggedIn ? (
                            <>
                                <button className={styles.btnPrimary} onClick={() => navigate("/tasks")}>Go to my tasks</button>
                                <button className={styles.btnGhost} onClick={() => navigate("/courses")}>My courses</button>
                            </>
                        ) : (
                            <>
                                <button className={styles.btnPrimary} onClick={() => navigate("/signup")}>Start for free</button>
                                <button className={styles.btnGhost} onClick={() => navigate("/login")}>I have an account</button>
                            </>
                        )}
                    </div>
                </div>

                <div className={styles.appPreview}>
                    <div className={styles.previewHeader}>
                        <div className={styles.previewUser}>
                            {avatarUrl
                                ? <img src={avatarUrl} className={styles.previewAvatar} alt="avatar" />
                                : <div className={styles.previewAvatarPlaceholder}>{userName ? userName.charAt(0).toUpperCase() : "?"}</div>
                            }
                            <span className={styles.previewDate}>Today's overview</span>
                        </div>
                        {stats.streak_days > 0 && (
                            <span className={styles.previewStreak}>🌻 {stats.streak_days} day streak</span>
                        )}
                    </div>


                    <div className={styles.previewSection}>
                        <div className={styles.previewSectionLabel}>
                            <span className={styles.dot} style={{ background: "#f97316" }} />
                            Daily Tasks
                        </div>
                        {recentTasks.length === 0 ? (
                            <div className={styles.previewEmpty}>
                                No tasks yet. <span className={styles.previewLink} onClick={() => navigate("/tasks")}>Add one →</span>
                            </div>
                        ) : (
                            <>
                                <div className={styles.taskProgressBar}>
                                    <div className={styles.taskProgressFill} style={{ width: `${tasksPct}%` }} />
                                </div>
                                <div className={styles.taskProgressLabel}>
                                    {stats.total_completed_daily_tasks}/{stats.total_daily_tasks} done
                                    {tasksLeft > 0 && <span> · {tasksLeft} left</span>}
                                </div>
                                <div className={styles.miniTaskList}>
                                    {recentTasks.slice(0, 3).map((t) => (
                                        <div key={t.id} className={`${styles.miniTaskRow} ${t.status === "completed" ? styles.miniTaskDone : ""}`}>
                                            <div className={`${styles.miniDot} ${t.status === "completed" ? styles.miniDotDone : t.status === "in_progress" ? styles.miniDotProgress : ""}`} />
                                            <span className={styles.miniTaskTitle}>{t.title}</span>
                                            {t.priority && (
                                                <span className={styles.miniPriority} style={{
                                                    color: priorityColors[t.priority]?.color,
                                                    background: priorityColors[t.priority]?.bg,
                                                }}>{t.priority}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>


                    <div className={styles.previewSection}>
                        <div className={styles.previewSectionLabel}>
                            <span className={styles.dot} style={{ background: "#6366f1" }} />
                            Courses
                        </div>
                        {recentCourses.length === 0 ? (
                            <div className={styles.previewEmpty}>
                                No courses yet. <span className={styles.previewLink} onClick={() => navigate("/courses")}>Add one →</span>
                            </div>
                        ) : (
                            <div className={styles.miniCourseList}>
                                {recentCourses.map((c: any) => {
                                    const done = c.checklists?.filter((x: any) => x.completed)?.length ?? 0;
                                    const total = c.checklists?.length ?? 0;
                                    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                                    return (
                                        <div key={c.id} className={styles.miniCourseRow}>
                                            <span className={styles.miniCourseIcon}>{c.emoji || "📘"}</span>
                                            <span className={styles.miniCourseTitle}>{c.title}</span>
                                            <div className={styles.miniTrack}>
                                                <div className={styles.miniFill} style={{ width: `${pct}%` }} />
                                            </div>
                                            <span className={styles.miniPct}>{pct}%</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </section>


            <section className={styles.statsStrip}>
                <div className={styles.statCard} onClick={() => navigate("/tasks")}>
                    <div className={styles.statEmoji}>🌻</div>
                    <div className={styles.statVal}>{stats.streak_days}</div>
                    <div className={styles.statLabel}>Day streak</div>
                </div>
                <div className={styles.statCard} onClick={() => navigate("/tasks")}>
                    <div className={styles.statEmoji}>✅</div>
                    <div className={styles.statVal}>{stats.total_completed_daily_tasks}<span className={styles.statOf}>/{stats.total_daily_tasks}</span></div>
                    <div className={styles.statLabel}>Tasks done</div>
                </div>
                <div className={styles.statCard} onClick={() => navigate("/courses")}>
                    <div className={styles.statEmoji}>📚</div>
                    <div className={styles.statVal}>{stats.completed_courses}<span className={styles.statOf}>/{stats.total_courses}</span></div>
                    <div className={styles.statLabel}>Courses</div>
                </div>
                <div className={styles.statCard} onClick={() => navigate("/courses")}>
                    <div className={styles.statEmoji}>📋</div>
                    <div className={styles.statVal}>{stats.completed_checklists}<span className={styles.statOf}>/{stats.total_checklists}</span></div>
                    <div className={styles.statLabel}>Checklists done</div>
                </div>
            </section>


            <section className={styles.quickSection}>
                <div className={styles.quickInner}>
                    <h2 className={styles.sectionTitle}>What do you want to do?</h2>
                    <div className={styles.quickGrid}>
                        <div className={styles.quickCard} onClick={() => navigate("/tasks")}>
                            <div className={styles.quickIcon} style={{ background: "#fff7ed", color: "#ea580c" }}>🌅</div>
                            <div className={styles.quickCardTitle}>Daily Tasks</div>
                            <div className={styles.quickCardDesc}>Check off today's tasks and keep your streak alive.</div>
                            <div className={styles.quickCardCta}>Go to tasks →</div>
                        </div>
                        <div className={styles.quickCard} onClick={() => navigate("/courses")}>
                            <div className={styles.quickIcon} style={{ background: "#eef2ff", color: "#4f46e5" }}>📚</div>
                            <div className={styles.quickCardTitle}>My Courses</div>
                            <div className={styles.quickCardDesc}>Pick up where you left off in your academic courses.</div>
                            <div className={styles.quickCardCta}>Go to courses →</div>
                        </div>
                        <div className={styles.quickCard} onClick={() => navigate("/account")}>
                            <div className={styles.quickIcon} style={{ background: "#f0fdf4", color: "#16a34a" }}>📊</div>
                            <div className={styles.quickCardTitle}>My Progress</div>
                            <div className={styles.quickCardDesc}>See your full stats, streaks, and overall progress.</div>
                            <div className={styles.quickCardCta}>View account →</div>
                        </div>
                    </div>
                </div>
            </section>


            <section className={styles.ctaBanner}>
                <h2 className={styles.ctaTitle}>
                    {tasksLeft > 0
                        ? `${tasksLeft} task${tasksLeft > 1 ? "s" : ""} left today.`
                        : stats.total_daily_tasks > 0
                            ? "All done!"
                            : "No tasks yet today."}
                </h2>
                <p className={styles.ctaSub}>
                    {tasksLeft > 0
                        ? "Finish them to keep your streak going."
                        : stats.total_daily_tasks > 0
                            ? "You made it! Come back tomorrow."
                            : "Add your first task and start building a habit."}
                </p>
                <button className={styles.ctaBtn} onClick={() => navigate("/tasks")}>
                    {tasksLeft > 0 ? "Finish my tasks →" : "Go to tasks →"}
                </button>
            </section>

            <footer className={styles.footer}>
                <span>© 2026 SunDo. All rights reserved.</span>
            </footer>
        </div>
    );
};
