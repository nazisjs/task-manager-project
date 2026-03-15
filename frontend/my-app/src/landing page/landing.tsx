import styles from "./landing.module.css";
import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./photos/logo.svg";

export const Landing: FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/login");
  };

  const dailyRoutines = [
    { icon: "🌅", label: "Morning walk", time: "07:00", done: true },
    { icon: "📖", label: "Read 20 pages", time: "08:30", done: true },
    { icon: "🧘", label: "Meditate", time: "21:00", done: false },
  ];

  const academicItems = [
    { icon: "📐", label: "Calculus – Chapter 4", progress: 72 },
    { icon: "🧬", label: "Biology – Cell division", progress: 45 },
    { icon: "🌐", label: "English – Essay draft", progress: 90 },
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Split your life in two",
      desc: "Daily routines for habits. Academic for subjects. No overlap, no noise.",
    },
    {
      step: "02",
      title: "Build your own courses",
      desc: "You create the syllabus. Divide any subject into lessons and track each one.",
    },
    {
      step: "03",
      title: "Show up every day",
      desc: "Streaks, checkboxes, progress bars. Small wins compound into big results.",
    },
  ];

  return (
    <div className={styles.page}>
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

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={styles.heroKicker}>Stop putting it off.</div>
          <h1 className={styles.heroTitle}>
            Your routines,
            <br />
            <span className={styles.heroUnderline}>done daily.</span>
          </h1>
          <p className={styles.heroSub}>
            SunDo splits your life into two simple tracks —{" "}
            <strong>Daily</strong> habits and <strong>Academic</strong> goals.
            You build the plan. SunDo keeps you honest.
          </p>
          <div className={styles.heroActions}>
            <button
              className={styles.btnPrimary}
              onClick={() => navigate("/signup")}
            >
              Start for free
            </button>
            <button
              className={styles.btnGhost}
              onClick={() => navigate("/login")}
            >
              I have an account
            </button>
          </div>
        </div>


        <div className={styles.appPreview}>
          <div className={styles.previewHeader}>
            <span className={styles.previewDate}>Today · Thursday</span>
            <span className={styles.previewStreak}>🔥 6 day streak</span>
          </div>

          <div className={styles.previewSection}>
            <div className={styles.previewSectionLabel}>
              <span
                className={styles.dot}
                style={{ background: "#f97316" }}
              />
              Daily
            </div>
            <div className={styles.routineList}>
              {dailyRoutines.map((r) => (
                <div
                  key={r.label}
                  className={`${styles.routineRow} ${r.done ? styles.routineDone : ""
                    }`}
                >
                  <div
                    className={`${styles.checkbox} ${r.done ? styles.checkboxDone : ""
                      }`}
                  >
                    {r.done && (
                      <svg viewBox="0 0 12 12" fill="none" width="10" height="10">
                        <path
                          d="M2 6l3 3 5-5"
                          stroke="#fff"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <span className={styles.routineIcon}>{r.icon}</span>
                  <span className={styles.routineLabel}>{r.label}</span>
                  <span className={styles.routineTime}>{r.time}</span>
                </div>
              ))}
            </div>
          </div>


          <div className={styles.previewSection}>
            <div className={styles.previewSectionLabel}>
              <span
                className={styles.dot}
                style={{ background: "#6366f1" }}
              />
              Academic
            </div>
            <div className={styles.academicList}>
              {academicItems.map((a) => (
                <div key={a.label} className={styles.academicRow}>
                  <div className={styles.academicLeft}>
                    <span className={styles.routineIcon}>{a.icon}</span>
                    <span className={styles.routineLabel}>{a.label}</span>
                  </div>
                  <div className={styles.academicRight}>
                    <span className={styles.academicPct}>{a.progress}%</span>
                    <div className={styles.miniTrack}>
                      <div
                        className={styles.miniFill}
                        style={{
                          width: `${a.progress}%`,
                          background: "#6366f1",
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      <section className={styles.tracks}>
        <div
          className={styles.track}
          style={{
            borderColor: "rgba(249,115,22,0.2)",
            background: "#fffbf7",
          }}
        >
          <div
            className={styles.trackIcon}
            style={{ background: "#fff7ed", color: "#ea580c" }}
          >
            🌅
          </div>
          <h3 className={styles.trackTitle}>Daily routines</h3>
          <p className={styles.trackDesc}>
            Build the habits that define your day. Exercise, reading, water
            intake, journaling — check them off every day and watch the streak
            grow.
          </p>
          <div
            className={styles.trackPill}
            style={{
              background: "#fff7ed",
              color: "#c2410c",
              border: "0.5px solid #fed7aa",
            }}
          >
            Habits · Wellness · Rituals
          </div>
        </div>

        <div className={styles.trackDivider}>
          <div className={styles.trackDividerLine} />
          <span className={styles.trackDividerLabel}>+</span>
          <div className={styles.trackDividerLine} />
        </div>

        <div
          className={styles.track}
          style={{
            borderColor: "rgba(99,102,241,0.2)",
            background: "#fafafe",
          }}
        >
          <div
            className={styles.trackIcon}
            style={{ background: "#eef2ff", color: "#4f46e5" }}
          >
            📚
          </div>
          <h3 className={styles.trackTitle}>Academic courses</h3>
          <p className={styles.trackDesc}>
            You create the syllabus. Break any subject into chapters or lessons
            and track your progress lesson by lesson, at your own pace.
          </p>
          <div
            className={styles.trackPill}
            style={{
              background: "#eef2ff",
              color: "#4338ca",
              border: "0.5px solid #c7d2fe",
            }}
          >
            Self-made · Any subject
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className={styles.howSection}>
        <p className={styles.eyebrow}>How it works</p>
        <h2 className={styles.sectionTitle}>Simple by design</h2>
        <div className={styles.stepsGrid}>
          {howItWorks.map((s) => (
            <div key={s.step} className={styles.stepCard}>
              <div className={styles.stepNum}>{s.step}</div>
              <div className={styles.stepTitle}>{s.title}</div>
              <div className={styles.stepDesc}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.ctaBanner}>
        <h2 className={styles.ctaTitle}>Less scrolling. More doing.</h2>
        <p className={styles.ctaSub}>
          Work hard, stay focused, and achieve anything you set your mind to.
        </p>
        <button
          className={styles.ctaBtn}
          onClick={() => navigate("/signup")}
        >
          Create your plan →
        </button>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <span>© 2026 SunDo. All rights reserved.</span>
      </footer>
    </div>
  );
};
