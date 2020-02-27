import React, { useMemo } from "react";

import "./styles.css";

export default function DetailCard({
  columnCount = 1,
  className,
  content = "",
  detailsLabel = "Details",
  expanded,
  imageUrl,
  toggleSelect,
  showDetails = false,
  subtitle,
  title
}) {
  const arrowStyle = expanded === true ? "down" : "right";
  const imageComponent = useMemo(() =>
    imageUrl ? (
      <img className="photo" src={imageUrl} alt={subtitle} />
    ) : (
      <i className="fas fa-id-card-alt missing-photo" />
    ), [imageUrl, subtitle]
  );
  return (
    <div className={`tile is-${parseInt(12 / columnCount, 10)}`}>
      <div className={`tile is-child box card${className}`}>
        <div className="card-image">{imageComponent}</div>
        <div className="card-content">
          <div className="media">
            <div className="media-content">
              <p className="title">{title}</p>
              <p className="subtitle">{subtitle}</p>
            </div>
          </div>
          <div className="content">{content}</div>
        </div>
        {showDetails && (
          <footer className="card-footer">
            <p className="card-footer-item"></p>
            <a
              className="card-footer-item details-button"
              onClick={toggleSelect}
            >
              <span>{detailsLabel}</span>
              <i className={`fas fa-angle-${arrowStyle} details-icon`} />
            </a>
          </footer>
        )}
      </div>
    </div>
  );
}
