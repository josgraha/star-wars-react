import React from "react";

import "./styles.css";

const noop = () => {};
export default function GridList({ options = [], selected = "", onChange }) {
  const renderItems = lst =>
    lst.map(item => {
      const [className, onClick] =
        selected === item
          ? ["selected", noop]
          : [null, () => onChange({ value: item })];
      return (
        <li key={item} className={className} onClick={onClick}>
          {item}
        </li>
      );
    });

  return <ul className="grid-list">{renderItems(options)}</ul>;
}
