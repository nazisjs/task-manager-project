import React, { useState } from "react";
import styles from './account.module.css';
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate

export default (props: any) => {
    const navigate = useNavigate();
    
    // State for inputs
    const [input1, onChangeInput1] = useState('');
    const [input2, onChangeInput2] = useState('');

    // 2. Simulated authentication state
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    // 3. Log out function
    const handleLogout = () => {
        // Perform logout logic here (e.g., clear tokens)
        setIsLoggedIn(false);
        navigate("/login"); // Redirect to login page
    };

    // 4. Function to navigate to home
    const handleNavigation = (path: string) => {
        navigate(path);
    };

    return (
        <div className={styles["contain"]}>
            <div className={styles["column"]}>
                <div className={styles["row-view"]}>
                    <div className={styles["column2"]}>
                        <img
                            src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/QyuSuwnY5C/jqed6732_expires_30_days.png"} 
                            className={styles["image"]}
                            alt="Logo"
                        />
                        <img
                            src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/QyuSuwnY5C/whx2vamu_expires_30_days.png"} 
                            className={styles["absolute-image"]}
                            alt="Logo Decoration"
                        />
                    </div>
                    <span className={styles["text"]} >
                        {"Account Management"}
                    </span>
                    <div className={styles["box"]}>
                    </div>
                    <div className={styles["row-view2"]}>
                        {/* Updated links with navigation */}
                        <span className={styles["text2"]} onClick={() => handleNavigation("/")} style={{cursor: "pointer"}}>
                            {"Home"}
                        </span>
                        <span className={styles["text3"]} onClick={() => handleNavigation("/courses")} style={{cursor: "pointer"}}>
                            {"Courses"}
                        </span>
                        <span className={styles["text3"]} onClick={() => handleNavigation("/settings")} style={{cursor: "pointer"}}>
                            {"Settings"}
                        </span>
                        <button className={styles["button-row-view"]}
                            onClick={() => alert("Search Pressed!")}>
                            <span className={styles["text4"]} >
                                {"Search in site"}
                            </span>
                            <img
                                src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/QyuSuwnY5C/u3aycr4m_expires_30_days.png"} 
                                className={styles["image2"]}
                                alt="Search Icon"
                            />
                        </button>
                    </div>
                </div>
                
                <div className={styles["column3"]}>
                    <span className={styles["text5"]} >
                        {"Your Account"}
                    </span>
                    <span className={styles["text6"]} >
                        {"Manage your account details and study sessions."}
                    </span>
                    <div className={styles["row-view3"]}>
                        {/* 5. Attach logout function */}
                        <button className={styles["button"]}
                            onClick={handleLogout}>
                            <span className={styles["text6"]} >
                                {"Log Out"}
                            </span>
                        </button>
                        <button className={styles["button2"]}
                            onClick={() => handleNavigation("/edit-account")}>
                            <span className={styles["text7"]} >
                                {"Edit Account"}
                            </span>
                        </button>
                    </div>
                </div>

                {/* --- Rest of the component remains the same --- */}
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

                <div className={styles["row-view6"]}>
                    <div className={styles["column8"]}>
                        <span className={styles["text5"]} >
                            {"Study Sessions"}
                        </span>
                        <span className={styles["text6"]} >
                            {"Manage your study sessions."}
                        </span>
                        <button className={styles["button5"]}
                            onClick={() => alert("Save Pressed!")}>
                            <span className={styles["text7"]} >
                                {"Save"}
                            </span>
                        </button>
                    </div>
                    <div className={styles["column9"]}>
                        <div className={styles["row-view9"]}>
                            <img
                                src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/QyuSuwnY5C/wq4p657f_expires_30_days.png"} 
                                className={styles["image5"]}
                                alt="Session Icon"
                            />
                            <div className={styles["column6"]}>
                                <span className={styles["text13"]} >
                                    {"Mathematics 101"}
                                </span>
                                <span className={styles["text14"]} >
                                    {"Session in progress. Do you want to end this session?"}
                                </span>
                                <div className={styles["view6"]}>
                                    <span className={styles["text9"]} >
                                        {"Active"}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className={styles["row-view10"]}>
                            <img
                                src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/QyuSuwnY5C/xbvapvhe_expires_30_days.png"} 
                                className={styles["image5"]}
                                alt="Session Icon"
                            />
                            <div className={styles["column6"]}>
                                <span className={styles["text15"]} >
                                    {"Computer Science Basics"}
                                </span>
                                <span className={styles["text16"]} >
                                    {"Completed your session? End it here."}
                                </span>
                                <div className={styles["view7"]}>
                                    <span className={styles["text9"]} >
                                        {"Completed"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className={styles["row-view6"]}>
                    <div className={styles["view8"]}>
                        <span className={styles["text5"]} >
                            {"Change Your Password"}
                        </span>
                    </div>
                    <div className={styles["column10"]}>
                        <div className={styles["column11"]}>
                            <span className={styles["text17"]} >
                                {"Current Password"}
                            </span>
                            <input
                                type="password"
                                placeholder={"Enter your current password"}
                                value={input1}
                                onChange={(event) => onChangeInput1(event.target.value)}
                                className={styles["input"]}
                            />
                        </div>
                        <div className={styles["column11"]}>
                            <span className={styles["text18"]} >
                                {"New Password"}
                            </span>
                            <input
                                type="password"
                                placeholder={"Enter a new password"}
                                value={input2}
                                onChange={(event) => onChangeInput2(event.target.value)}
                                className={styles["input"]}
                            />
                        </div>
                        <button className={styles["button6"]}
                            onClick={() => alert("Password Updated!")}>
                            <span className={styles["text7"]} >
                                {"Update Password"}
                            </span>
                        </button>
                    </div>
                </div>
                
                <div className={styles["view9"]}>
                    <div className={styles["row-view11"]}>
                        <span className={styles["text19"]} onClick={() => handleNavigation("/terms")} style={{cursor: "pointer"}}>
                            {"Terms of Service"}
                        </span>
                        <span className={styles["text20"]} onClick={() => handleNavigation("/privacy")} style={{cursor: "pointer"}}>
                            {"Privacy Policy"}
                        </span>
                        <span className={styles["text12"]} onClick={() => handleNavigation("/help")} style={{cursor: "pointer"}}>
                            {"Help Center"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}