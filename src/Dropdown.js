import React from "react";

function Dropdown({
  options = [],
  defaultValue = "",
  disabled = false,
  onChange
}) {
  const renderOption = ({ label, value }) => (
    <option key={value} value={value}>
      {label}
    </option>
  );
  return (
    <>
      <div>Character</div>
      <select
        onChange={onChange}
        defaultValue={defaultValue}
        disabled={disabled}
      >
        {options.map(item => {
          const [label, value] =
            typeof item === "string" ? [item, item] : [item.label, item.value];
          return renderOption({ label, value });
        })}
      </select>
    </>
  );
}

export default Dropdown;
