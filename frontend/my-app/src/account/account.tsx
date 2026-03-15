import React, { useState, useEffect } from "react";
import styles from './account.module.css';
import { useNavigate } from "react-router-dom";
import logo from "../landing page/photos/logo.svg";
import api from '../api/client'


export default (props: any) => {
    const [stats, setStats] = useState({
        total_courses: 0,
        completed_courses: 0,
        total_checklists: 0,
        completed_checklists: 0,
        streak_days: 0,
        total_daily_tasks: 0,
        total_completed_daily_tasks: 0,
    });

    useEffect(() => {
        api.get('/api/statistics/')
            .then(res => setStats(res.data))
            .catch(err => console.error('Statistics error:', err))

    }, []);
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access'));
    const handleLogout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        setIsLoggedIn(false);
        navigate('/login');
    }
    const [input1, onChangeInput1] = useState('');
    const [input2, onChangeInput2] = useState('');

    const handleNavigation = (path: string) => {
        navigate(path);
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
            <div style={{ display: 'flex', gap: '16px', margin: '24px 0', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '140px', background: '#faf7f2', border: '1.5px solid #e8dfd0', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', fontWeight: '700', color: '#754c17' }}>🌻 {stats.streak_days}</div>
                    <div style={{ fontSize: '13px', color: '#8a7560', marginTop: '4px' }}>Day streak</div>
                </div>
                <div style={{ flex: 1, minWidth: '140px', background: '#faf7f2', border: '1.5px solid #e8dfd0', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', fontWeight: '700', color: '#4a7c59' }}>{stats.completed_courses}/{stats.total_courses}</div>
                    <div style={{ fontSize: '13px', color: '#8a7560', marginTop: '4px' }}>Academic Courses</div>
                </div>
                <div style={{ flex: 1, minWidth: '140px', background: '#faf7f2', border: '1.5px solid #e8dfd0', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', fontWeight: '700', color: '#9f9a58' }}>{stats.completed_checklists}/{stats.total_checklists}</div>
                    <div style={{ fontSize: '13px', color: '#8a7560', marginTop: '4px' }}>Academic tasks</div>
                </div>
                <div style={{ flex: 1, minWidth: '140px', background: '#faf7f2', border: '1.5px solid #e8dfd0', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', fontWeight: '700', color: '#9f9a58' }}>{stats.total_completed_daily_tasks}/{stats.total_daily_tasks}</div>
                    <div style={{ fontSize: '13px', color: '#8a7560', marginTop: '4px' }}>Daily tasks</div>
                </div>
            </div>
            <div className={styles["contain"]}>
                <div className={styles["column"]}>

                    <div className={styles["row-view4"]}>
                        <img
                            src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/QyuSuwnY5C/wnn0x2v0_expires_30_days.png"}
                            className={styles["image3"]}
                            alt="Profile"
                        />
                        <div className={styles["column4"]}>
                            <span className={styles["text8"]} >
                                {"John Doe"}
                            </span>
                            <div className={styles["row-view5"]}>
                                <div className={styles["view"]}>
                                    <span className={styles["text9"]} >
                                        {"Student"}
                                    </span>
                                </div>
                                <div className={styles["view2"]}>
                                    <span className={styles["text9"]} >
                                        {"Active"}
                                    </span>
                                </div>
                            </div>
                            <span className={styles["text10"]} >
                                {"Explore and manage your courses."}
                            </span>
                        </div>
                        <div className={styles["column4"]}>
                            <button className={styles["button3"]}
                                onClick={() => handleNavigation("/change-password")}>
                                <span className={styles["text6"]} >
                                    {"Change Password"}
                                </span>
                            </button>
                            <button className={styles["button4"]}
                                onClick={() => handleNavigation("/courses")}>
                                <span className={styles["text7"]} >
                                    {"View Courses"}
                                </span>
                            </button>
                            <button onClick={() => navigate('/tasks')}>
                                View Tasks
                            </button>
                        </div>
                    </div>

                    <div className={styles["row-view6"]}>
                        <div className={styles["column5"]}>
                            <span className={styles["text5"]} >
                                {"Your Courses"}
                            </span>
                            <span className={styles["text6"]} >
                                {"Current courses you are enrolled in."}
                            </span>
                        </div>
                        <div className={styles["column6"]}>
                            <div className={styles["row-view7"]}>
                                <div className={styles["view3"]}>
                                    <span className={styles["text11"]} >
                                        {"📘"}
                                    </span>
                                </div>
                                <div className={styles["view4"]}>
                                    <span className={styles["text12"]} >
                                        {"Mathematics 101"}
                                    </span>
                                </div>
                                <span className={styles["text12"]} >
                                    {"Ongoing"}
                                </span>
                            </div>
                            <div className={styles["column7"]}>
                                <div className={styles["row-view8"]}>
                                    <div className={styles["view3"]}>
                                        <span className={styles["text11"]} >
                                            {"📗"}
                                        </span>
                                    </div>
                                    <div className={styles["view5"]}>
                                        <span className={styles["text12"]} >
                                            {"Computer Science Basics"}
                                        </span>
                                    </div>
                                    <span className={styles["text12"]} >
                                        {"Ongoing"}
                                    </span>
                                </div>
                                <img
                                    src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/QyuSuwnY5C/qe4tnt5o_expires_30_days.png"}
                                    className={styles["image4"]}
                                    alt="Course Art"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}