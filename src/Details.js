import React from "react";
import List from "./List";

function Details({ characterName = "", films = [] }) {
  return (
    <div>
      <h2>{characterName}</h2>
      <List label="Films" items={films} />
    </div>
  );
}

export default Details;
