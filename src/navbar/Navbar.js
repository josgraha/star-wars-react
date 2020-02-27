import React from "react";

export default function Navbar({ onSearch }) {
  return (
    <nav
      className="navbar is-fixed-top"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <div className="navbar-item branding">
          <i className="fas fa-meteor logo" alt="Star Wars" />
          <p>Starbook</p>
        </div>
      </div>
      <div className="navbar-item">
        <div className="field has-addons">
          <p className="control has-icons-left">
            <input
              className="input wide-search"
              type="text"
              placeholder="Search"
            />
            <span className="icon is-left">
              <i className="fas fa-search" aria-hidden="true"></i>
            </span>
          </p>
        </div>
      </div>
      <div className="navbar-menu">
        <div className="navbar-end">
          <div className="navbar-item">
            <a
              href="https://github.com/josgraha/star-wars-react"
              title="Open Github project"
              rel="noopener noreferrer"
              target="_blank"
            >
              <i className="fab fa-github menu-icon" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
