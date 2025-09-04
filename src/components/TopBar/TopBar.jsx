import React, { useState, useRef } from "react";
import "./TopBar.css";
import { Settings, SquarePen, LogOut, Menu } from "lucide-react";
import Signup from "../Signup/Signup";
import Login from "../Signup/Login";

export default function TopBar({
  onToggleSidebar,
  darkMode,
  onToggleDarkMode,
  userProfile,
  onUpdateProfile,
}) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempProfile, setTempProfile] = useState({ ...userProfile });
  const [showAuth, setShowAuth] = useState(null); // "signup" | "login" | null
  const fileInputRef = useRef(null);

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
    setShowAuth(null);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setTempProfile({ ...tempProfile, photo: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    onUpdateProfile(tempProfile);
    setIsEditingProfile(false);
  };

  const handleCancelEdit = () => {
    setTempProfile({ ...userProfile });
    setIsEditingProfile(false);
  };

  const getProfileInitial = () => {
    return userProfile.name ? userProfile.name.charAt(0).toUpperCase() : "A";
  };

  const handleLogout = () => {
    onUpdateProfile({ name: "", email: "", photo: "" });
    setShowAuth(null);
    setProfileDropdownOpen(false);
  };

  const handleAuthSuccess = (userData) => {
    onUpdateProfile(userData);
    setShowAuth(null);
    setProfileDropdownOpen(false);
  };

  const handleCloseAuth = () => {
    setShowAuth(null);
  };

  return (
    <div className="top-bar">
      <div className="top-bar-left">
        <button className="sidebar-toggle" onClick={onToggleSidebar}>
          <span className="hamburger"><Menu /></span>
        </button>
        <h1 className="top-bar-title">📚 BookFinder</h1>
      </div>

      <div className="top-bar-right">
        {/* 🌙 Dark mode toggle */}
        <button className="dark-mode-toggle" onClick={onToggleDarkMode}>
          {darkMode ? (
            <i className="bx bx-sun"></i>
          ) : (
            <i className="bx bx-moon"></i>
          )}
        </button>

        {/* 👤 Profile Section - agar user login hai */}
        {userProfile?.email ? (
          <div className="profile-section">
            <button className="profile-button" onClick={toggleProfileDropdown}>
              <div className="profile-avatar">
                {userProfile.photo ? (
                  <img
                    src={userProfile.photo}
                    alt="Profile"
                    className="profile-photo"
                  />
                ) : (
                  <span>{getProfileInitial()}</span>
                )}
              </div>
            </button>

            {profileDropdownOpen && (
              <>
                <div className="profile-dropdown">
                  <div className="dropdown-header">
                    {isEditingProfile ? (
                      <div className="profile-edit">
                        <div className="photo-upload-section">
                          <div
                            className="profile-avatar large"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            {tempProfile.photo ? (
                              <img
                                src={tempProfile.photo}
                                alt="Profile"
                                className="profile-photo"
                              />
                            ) : (
                              <span>
                                {tempProfile.name
                                  ? tempProfile.name.charAt(0).toUpperCase()
                                  : "A"}
                              </span>
                            )}
                            <div className="photo-overlay">
                              <i className="bx bx-image"></i>
                            </div>
                          </div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            style={{ display: "none" }}
                          />
                        </div>
                        <div className="profile-form">
                          <input
                            type="text"
                            value={tempProfile.name}
                            onChange={(e) =>
                              setTempProfile({
                                ...tempProfile,
                                name: e.target.value,
                              })
                            }
                            placeholder="Name"
                            className="profile-input"
                          />
                          <input
                            type="email"
                            value={tempProfile.email}
                            onChange={(e) =>
                              setTempProfile({
                                ...tempProfile,
                                email: e.target.value,
                              })
                            }
                            placeholder="Email"
                            className="profile-input"
                          />
                          <div className="profile-actions">
                            <button
                              className="pro-btn"
                              onClick={handleSaveProfile}
                            >
                              Save
                            </button>
                            <button
                              className="pro-btn"
                              onClick={handleCancelEdit}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="profile-info">
                        <div className="profile-avatar large">
                          {userProfile.photo ? (
                            <img
                              src={userProfile.photo}
                              alt="Profile"
                              className="profile-photo"
                            />
                          ) : (
                            <span>{getProfileInitial()}</span>
                          )}
                        </div>
                        <div className="profile-details">
                          <div className="profile-name">{userProfile.name}</div>
                          <div className="profile-email">
                            {userProfile.email}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="dropdown-options">
                    <button
                      className="dropdown-item"
                      onClick={() => setIsEditingProfile(!isEditingProfile)}
                    >
                      <span className="dropdown-icon">
                        <SquarePen size={20} />
                      </span>
                      <span>
                        {isEditingProfile ? "View Profile" : "Edit Profile"}
                      </span>
                    </button>

                    <button className="dropdown-item">
                      <span className="dropdown-icon">
                        <Settings size={20} />
                      </span>
                      <span>Settings</span>
                    </button>

                    <div className="dropdown-divider"></div>

                    <button className="dropdown-item">
                      <span>Help & Support</span>
                    </button>

                    <button className="dropdown-item">
                      <span>Terms & Privacy</span>
                    </button>

                    <button
                      className="dropdown-item logout"
                      onClick={handleLogout}
                    >
                      <LogOut size={18} />
                      <span>Log out</span>
                    </button>
                  </div>
                </div>
                <div
                  className="dropdown-overlay"
                  onClick={toggleProfileDropdown}
                ></div>
              </>
            )}
          </div>
        ) : (
          // 👇 Agar login nahi hai toh ek hi button jo modal open kare
          <div className="auth-buttons">
            <button className="auth-btn" onClick={() => setShowAuth("login")}>
              Login
            </button>
            <button className="auth-btn" onClick={() => setShowAuth("signup")}>
              Sign Up
            </button>
          </div>
        )}

        {/* 🔑 Login & Signup Modal */}
        {showAuth && (
          <div className="auth-backdrop" onClick={handleCloseAuth}>
            <div
              className={`auth-container ${darkMode ? "dark" : ""}`}
              onClick={(e) => e.stopPropagation()}
            >
              {showAuth === "signup" && (
                <Signup
                  onSwitchToLogin={() => setShowAuth("login")}
                  onUpdateProfile={handleAuthSuccess}
                  onClose={handleCloseAuth}
                />
              )}
              {showAuth === "login" && (
                <Login
                  onSwitchToSignup={() => setShowAuth("signup")}
                  onUpdateProfile={handleAuthSuccess}
                  onClose={handleCloseAuth}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}