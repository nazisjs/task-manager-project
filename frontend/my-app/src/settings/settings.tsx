import { useEffect } from "react";
import React, { useState } from "react";
import styles from './settings.module.css';
import { useNavigate } from "react-router-dom";
import logo from "../landing page/photos/logo.svg";
import api from '../api/client';

type Tab = 'profile' | 'security' | 'notifications';

export default function Settings() {
    const navigate = useNavigate();
    const [isLoggedIn] = useState(!!localStorage.getItem('access'));
    const [activeTab, setActiveTab] = useState<Tab>('profile');

    const [profileName, setProfileName] = useState('');
    const [profileEmail, setProfileEmail] = useState('');
    const [profileBio, setProfileBio] = useState('');
    const [username, setUsername] = useState('');
    const [profileSaved, setProfileSaved] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string>(localStorage.getItem('avatarUrl') || '');

    useEffect(() => {
        api.get('/api/user/')
            .then(res => {
                const u = res.data;
                setUsername(u.username || '');
                setProfileName(u.first_name && u.last_name
                    ? `${u.first_name} ${u.last_name}`
                    : u.username || '');
                setProfileEmail(u.email || '');
                setProfileBio(u.bio || '');
            })
            .catch(err => console.error('User fetch error:', err));
    }, []);


    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState(false);

    const [notifDailyReminder, setNotifDailyReminder] = useState(true);
    const [notifStreakAlert, setNotifStreakAlert] = useState(true);
    const [notifWeeklyReport, setNotifWeeklyReport] = useState(false);
    const [notifSaved, setNotifSaved] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        localStorage.removeItem('profileName');
        localStorage.removeItem('profileEmail');
        localStorage.removeItem('profileBio');
        localStorage.removeItem('loggedInUser');
        navigate('/login');
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            setAvatarUrl(result);
            localStorage.setItem('avatarUrl', result);
        };
        reader.readAsDataURL(file);
    };

    const handleSaveProfile = () => {
        api.patch('/api/user/', {
            username: username.trim(),
            display_name: profileName.trim(),
            email: profileEmail.trim(),
            bio: profileBio.trim(),
        })
            .then(res => {
                const u = res.data;
                setUsername(u.username || '');
                setProfileName(u.first_name && u.last_name
                    ? `${u.first_name} ${u.last_name}`
                    : u.username || '');
                setProfileEmail(u.email || '');
                setProfileBio(u.bio || '');
                setProfileSaved(true);
                setTimeout(() => setProfileSaved(false), 2500);
            })
            .catch(err => {
                console.error('Save error:', err?.response);
                setProfileSaved(false);
            });
    };

    const handleChangePassword = () => {
        setPasswordError('');
        setPasswordSuccess(false);
        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordError('All fields are required.');
            return;
        }
        if (newPassword.length < 8) {
            setPasswordError('New password must be at least 8 characters.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordError('New passwords do not match.');
            return;
        }
        api.post('/api/change-password/', {
            old_password: currentPassword,
            new_password: newPassword,
        })
            .then(res => {
                if (res.data.access) localStorage.setItem('access', res.data.access);
                if (res.data.refresh) localStorage.setItem('refresh', res.data.refresh);
                setPasswordSuccess(true);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            })
            .catch(err => {
                setPasswordError(err?.response?.data?.detail || 'Failed to change password. Check your current password.');
            });
    };

    const handleSaveNotifications = () => {
        setNotifSaved(true);
        setTimeout(() => setNotifSaved(false), 2500);
    };

    const tabs: { key: Tab; label: string; icon: string }[] = [
        { key: 'profile', label: 'Profile', icon: '👤' },
        { key: 'security', label: 'Security', icon: '🔒' },
        { key: 'notifications', label: 'Notifications', icon: '🔔' },
    ];

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


            <div className={styles.pageHeader}>
                <div className={styles.pageHeaderInner}>
                    <div>
                        <p className={styles.eyebrow}>Account</p>
                        <h1 className={styles.pageTitle}>Settings</h1>
                    </div>
                </div>
            </div>


            <div className={styles.contentWrap}>

                <aside className={styles.sidebar}>
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            className={`${styles.tabBtn} ${activeTab === tab.key ? styles.tabBtnActive : ''}`}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            <span className={styles.tabIcon}>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}

                    <div className={styles.sidebarDivider} />

                    <button className={styles.dangerBtn} onClick={handleLogout}>
                        Sign out
                    </button>
                </aside>


                <div className={styles.panel}>


                    {activeTab === 'profile' && (
                        <div className={styles.panelSection}>
                            <h2 className={styles.panelTitle}>Profile</h2>
                            <p className={styles.panelSub}>How you appear on SunDo.</p>

                            <div className={styles.avatarRow}>
                                <div className={styles.avatarUploadWrap}>
                                    {avatarUrl ? (
                                        <img src={avatarUrl} className={styles.settingsAvatar} alt="Avatar" />
                                    ) : (
                                        <div className={styles.settingsAvatarPlaceholder}>
                                            {profileName ? profileName.charAt(0).toUpperCase() : '?'}
                                        </div>
                                    )}
                                    <label className={styles.avatarOverlay} title="Change photo">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            onChange={handleAvatarChange}
                                        />
                                        📷
                                    </label>
                                </div>
                                <div>
                                    <p className={styles.avatarHint}>Profile picture</p>
                                    <p className={styles.avatarNote}>Click the photo to upload a new one. Stored locally on your device.</p>
                                    {avatarUrl && (
                                        <button className={styles.removeAvatarBtn} onClick={() => {
                                            setAvatarUrl('');
                                            localStorage.removeItem('avatarUrl');
                                        }}>Remove photo</button>
                                    )}
                                </div>
                            </div>

                            <div className={styles.fieldGrid}>
                                <div className={styles.field}>
                                    <label className={styles.fieldLabel}>Username</label>
                                    <input
                                        className={styles.fieldInput}
                                        type="text"
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                        placeholder="username"
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label className={styles.fieldLabel}>Display name</label>
                                    <input
                                        className={styles.fieldInput}
                                        type="text"
                                        value={profileName}
                                        onChange={e => setProfileName(e.target.value)}
                                        placeholder="Your name"
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label className={styles.fieldLabel}>Email address</label>
                                    <input
                                        className={styles.fieldInput}
                                        type="email"
                                        value={profileEmail}
                                        onChange={e => setProfileEmail(e.target.value)}
                                        placeholder="your@email.com"
                                    />
                                </div>
                                <div className={`${styles.field} ${styles.fieldFull}`}>
                                    <label className={styles.fieldLabel}>Bio <span className={styles.fieldOptional}>(optional)</span></label>
                                    <textarea
                                        className={`${styles.fieldInput} ${styles.fieldTextarea}`}
                                        value={profileBio}
                                        onChange={e => setProfileBio(e.target.value)}
                                        placeholder="A short description about yourself…"
                                    />
                                </div>
                            </div>

                            <div className={styles.panelActions}>
                                <button className={styles.saveBtn} onClick={handleSaveProfile}>
                                    {profileSaved ? 'Saved' : 'Save changes'}
                                </button>
                            </div>
                        </div>
                    )}
                    {activeTab === 'security' && (
                        <div className={styles.panelSection}>
                            <h2 className={styles.panelTitle}>Security</h2>
                            <p className={styles.panelSub}>Manage your password and account access.</p>

                            <div className={styles.securityCard}>
                                <h3 className={styles.secCardTitle}>Change password</h3>
                                <p className={styles.secCardSub}>Use a strong password — at least 8 characters.</p>

                                <div className={styles.fieldGrid}>
                                    <div className={`${styles.field} ${styles.fieldFull}`}>
                                        <label className={styles.fieldLabel}>Current password</label>
                                        <input
                                            className={styles.fieldInput}
                                            type="password"
                                            value={currentPassword}
                                            onChange={e => setCurrentPassword(e.target.value)}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div className={styles.field}>
                                        <label className={styles.fieldLabel}>New password</label>
                                        <input
                                            className={styles.fieldInput}
                                            type="password"
                                            value={newPassword}
                                            onChange={e => setNewPassword(e.target.value)}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div className={styles.field}>
                                        <label className={styles.fieldLabel}>Confirm new password</label>
                                        <input
                                            className={styles.fieldInput}
                                            type="password"
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                {passwordError && <p className={styles.errorMsg}>⚠ {passwordError}</p>}
                                {passwordSuccess && <p className={styles.successMsg}>✓ Password changed successfully!</p>}

                                <div className={styles.panelActions}>
                                    <button className={styles.saveBtn} onClick={handleChangePassword}>
                                        Update password
                                    </button>
                                </div>
                            </div>

                            <div className={styles.securityCard} style={{ marginTop: '20px' }}>
                                <h3 className={styles.secCardTitle}>Danger zone</h3>
                                <p className={styles.secCardSub}>Permanently delete your account and all of your data.</p>
                                <button className={styles.deleteAccountBtn}>Delete account</button>
                            </div>
                        </div>
                    )}
                    {activeTab === 'notifications' && (
                        <div className={styles.panelSection}>
                            <h2 className={styles.panelTitle}>Notifications</h2>
                            <p className={styles.panelSub}>Choose what keeps you on track.</p>

                            <div className={styles.toggleList}>
                                <div className={styles.toggleRow}>
                                    <div className={styles.toggleInfo}>
                                        <div className={styles.toggleTitle}>Daily reminder</div>
                                        <div className={styles.toggleSub}>Get a nudge to check off your daily tasks every morning.</div>
                                    </div>
                                    <button
                                        className={`${styles.toggle} ${notifDailyReminder ? styles.toggleOn : ''}`}
                                        onClick={() => setNotifDailyReminder(!notifDailyReminder)}
                                        aria-label="Toggle daily reminder"
                                    >
                                        <div className={styles.toggleThumb} />
                                    </button>
                                </div>
                                <div className={styles.toggleDivider} />
                                <div className={styles.toggleRow}>
                                    <div className={styles.toggleInfo}>
                                        <div className={styles.toggleTitle}>Streak alert</div>
                                        <div className={styles.toggleSub}>Get warned before your streak is about to break.</div>
                                    </div>
                                    <button
                                        className={`${styles.toggle} ${notifStreakAlert ? styles.toggleOn : ''}`}
                                        onClick={() => setNotifStreakAlert(!notifStreakAlert)}
                                        aria-label="Toggle streak alert"
                                    >
                                        <div className={styles.toggleThumb} />
                                    </button>
                                </div>
                                <div className={styles.toggleDivider} />
                                <div className={styles.toggleRow}>
                                    <div className={styles.toggleInfo}>
                                        <div className={styles.toggleTitle}>Weekly report</div>
                                        <div className={styles.toggleSub}>A summary of your week — tasks done, progress made.</div>
                                    </div>
                                    <button
                                        className={`${styles.toggle} ${notifWeeklyReport ? styles.toggleOn : ''}`}
                                        onClick={() => setNotifWeeklyReport(!notifWeeklyReport)}
                                        aria-label="Toggle weekly report"
                                    >
                                        <div className={styles.toggleThumb} />
                                    </button>
                                </div>
                            </div>

                            <div className={styles.panelActions}>
                                <button className={styles.saveBtn} onClick={handleSaveNotifications}>
                                    {notifSaved ? 'Saved' : 'Save preferences'}
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            <footer className={styles.footer}>
                <span>© 2026 SunDo. All rights reserved.</span>
            </footer>
        </div>
    );
}
