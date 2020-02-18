import React from "react";

import "./styles.css";

const noop = () => {};
export default function GridList({ options = [], selected = "", onChange }) {
  const renderItems = lst =>
    lst.map(({ key, title, subtitle, imageUrl }) => {
      const [className, onClick] =
        selected === title
          ? ["selected", noop]
          : [null, () => onChange({ value: title })];
      return (
        <li key={key || title} className={className} onClick={onClick}>
          <div className="grid-image">
            {imageUrl && <img src={imageUrl} alt={title} />}
          </div>
          <h3>{title}</h3>
          <div>{subtitle}</div>
        </li>
      );
    });

  return <ul className="grid-list">{renderItems(options)}</ul>;
}
