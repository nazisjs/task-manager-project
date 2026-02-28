import styles from "./landing.module.css";
// 1. Import useNavigate for switching pages
import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom"; 

export const Landing: FC = () => {
  const navigate = useNavigate();

  // 2. Simulated authentication state
  // Set to true to see Account/Log out, false to see Log in
  const [isLoggedIn, setIsLoggedIn] = useState(true); 

  // Function to handle logging out
  const handleLogout = () => {
    // Perform actual logout logic here (e.g., clearing tokens)
    // authService.logout();
    
    setIsLoggedIn(false); // Update state
    navigate("/login"); // Redirect to login page
  };

  // 3. Function to navigate to the account page
  const handleAccountClick = () => {
    navigate("/account");
  };

  return (
    <div className={styles["contain"]}>
      <div className={styles["column"]}>
        <div className={styles["row-view"]}>
          <div className={styles["column2"]}>
            <img
              src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/QyuSuwnY5C/jbhncgec_expires_30_days.png"} 
              className={styles["image"]}
              alt="Logo"
            />
            <img
              src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/QyuSuwnY5C/0d7teo7d_expires_30_days.png"} 
              className={styles["absolute-image"]}
              alt="Decoration"
            />
          </div>
          <span className={styles["text"]} >
            {"SunDo"}
          </span>
          <div className={styles["box"]}>
          </div>
          <div className={styles["row-view2"]}>
            {/* 4. Conditional Rendering based on auth state */}
            {isLoggedIn ? (
              <>
                <span 
                  className={styles["text2"]} 
                  onClick={handleAccountClick} // Navigate to /account
                  style={{ cursor: "pointer" }}
                >
                  {"Account"}
                </span>
                <span 
                  className={styles["text2"]} 
                  onClick={handleLogout} // Navigate to /login
                  style={{ cursor: "pointer" }}
                >
                  {"Log out"}
                </span>
              </>
            ) : (
              <span 
                className={styles["text2"]} 
                onClick={() => navigate("/login")}
                style={{ cursor: "pointer" }}
              >
                {"Log in"}
              </span>
            )}
          </div>
        </div>

        <div className={styles["row-view3"]}>
          <div className={styles["column3"]}>
            <span className={styles["text3"]} >
              {"Mastering skills is a crucial part of a successful future."}
            </span>
            <button className={styles["button"]}
              onClick={()=>alert("Pressed!")}>
              <span className={styles["text4"]} >
                {"start"}
              </span>
            </button>
          </div>
          <img
            src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/QyuSuwnY5C/ybsq5y3e_expires_30_days.png"} 
            className={styles["image2"]}
            alt="Hero Image"
          />
        </div>

        <div className={styles["row-view4"]}>
          <div className={styles["column4"]}>
            <div className={styles["column5"]}>
              <img
                src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/QyuSuwnY5C/ii6l9rg8_expires_30_days.png"} 
                className={styles["image3"]}
                alt="Feature"
              />
              <span className={styles["absolute-text"]} >
                {"Explore trending courses designed to elevate your skills."}
              </span>
            </div>
            <img
              src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/QyuSuwnY5C/ar92xgev_expires_30_days.png"} 
              className={styles["image4"]}
              alt="Decoration"
            />
          </div>
          <div className={styles["row-view5"]}>
            <div className={styles["box2"]}>
            </div>
            <div className={styles["box3"]}>
            </div>
            <div className={styles["box3"]}>
            </div>
            <div className={styles["box3"]}>
            </div>
          </div>
          <div className={styles["box"]}>
          </div>
          <img
            src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/QyuSuwnY5C/z6sn1qrk_expires_30_days.png"} 
            className={styles["image5"]}
            alt="Decoration"
          />
        </div>

        <div className={styles["row-view3"]}>
          <div className={styles["column6"]}>
            <span className={styles["text5"]} >
              {"Trending Courses"}
            </span>
            <span className={styles["text2"]} >
              {"Popular courses among our learners"}
            </span>
          </div>
          <div className={styles["column7"]}>
            <div className={styles["row-view6"]}>
              <img
                src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/QyuSuwnY5C/q0wstju1_expires_30_days.png"} 
                className={styles["image6"]}
                alt="Course 1"
              />
              <div className={styles["column8"]}>
                <span className={styles["text6"]} >
                  {"Course Title 1"}
                </span>
                <span className={styles["text7"]} >
                  {"Subtitle 1"}
                </span>
                <span className={styles["text8"]} >
                  {"Short description about Course Title 1."}
                </span>
                <div className={styles["view"]}>
                  <span className={styles["text9"]} >
                    {"Trending"}
                  </span>
                </div>
              </div>
            </div>
            <div className={styles["row-view6"]}>
              <img
                src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/QyuSuwnY5C/weejmvv6_expires_30_days.png"} 
                className={styles["image6"]}
                alt="Course 2"
              />
              <div className={styles["column8"]}>
                <span className={styles["text10"]} >
                  {"Course Title 2"}
                </span>
                <span className={styles["text11"]} >
                  {"Subtitle 2"}
                </span>
                <span className={styles["text8"]} >
                  {"Short description about Course Title 2."}
                </span>
                <div className={styles["view2"]}>
                  <span className={styles["text9"]} >
                    {"Recommended"}
                  </span>
                </div>
              </div>
            </div>
            <div className={styles["row-view6"]}>
              <img
                src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/QyuSuwnY5C/7meh4nvm_expires_30_days.png"} 
                className={styles["image6"]}
                alt="Course 3"
              />
              <div className={styles["column8"]}>
                <span className={styles["text10"]} >
                  {"Course Title 3"}
                </span>
                <span className={styles["text11"]} >
                  {"Subtitle 3"}
                </span>
                <span className={styles["text8"]} >
                  {"Short description about Course Title 3."}
                </span>
                <div className={styles["view3"]}>
                  <span className={styles["text9"]} >
                    {"New"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles["view4"]}>
          <div className={styles["view5"]}>
            <span className={styles["text12"]} >
              {"© 2026 sundo. All Rights Reserved."}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}