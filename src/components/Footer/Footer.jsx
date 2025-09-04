import React from 'react';
import './Footer.css';
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = ({ darkMode, isSidebarOpen }) => {
  return (
    <footer className={`footer ${darkMode ? 'dark' : 'light'} ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">BookFinder</h3>
          <p className="footer-description">
            Discover amazing books and expand your reading horizons with our comprehensive book search platform.
          </p>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Quick Links</h4>
          <ul className="footer-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#search">Search Books</a></li>
            <li><a href="#categories">Categories</a></li>
            <li><a href="#authors">Authors</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Support</h4>
          <ul className="footer-links">
            <li><a href="#help">Help Center</a></li>
            <li><a href="#contact">Contact Us</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#feedback">Feedback</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Follow Us</h4>
          <div className="social-links">
            <a href="#facebook" className="social-link" aria-label="Facebook"><Facebook strokeWidth={2} /></a>
            <a href="#twitter" className="social-link" aria-label="Twitter"><Twitter strokeWidth={2} /></a>
            <a href="#instagram" className="social-link" aria-label="Instagram"><Instagram strokeWidth={2} /></a>
            <a href="#linkedin" className="social-link" aria-label="LinkedIn"><Linkedin strokeWidth={2} /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="copyright">
          © 2024 BookFinder. All rights reserved. |
          <a href="#privacy"> Privacy Policy</a> |
          <a href="#terms"> Terms of Service</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
