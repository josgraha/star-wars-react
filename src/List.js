import React from "react";

function List({ label, items = [] }) {
  const renderItem = item => <li key={item}>{item}</li>;
  return (
    <div>
      <div>{label}</div>
      <ul>{items.map(renderItem)}</ul>
    </div>
  );
}

export default List;
