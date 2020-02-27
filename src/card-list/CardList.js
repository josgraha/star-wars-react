import React, { useCallback, useMemo } from "react";
import classnames from "classnames";
import DetailCard from "../detail-card";

import "./styles.css";

export default function CardList({
  cards = [],
  className,
  detailsLabel,
  columnCount = 1,
  details,
  selected = "",
  onChange
}) {
  const asTable = useCallback(
    (list = []) =>
      list.reduce(
        (rows, col) => {
          const rowIndex = rows.length - 1;
          const row = rows[rowIndex] || [];
          if (row.length < columnCount) {
            row.push(col);
            rows[rowIndex] = row;
            return rows;
          }
          rows[rows.length] = [col];
          return rows;
        },
        [[]]
      ),
    [columnCount]
  );
  const renderCard = useCallback(
    ({ content, imageUrl, key, showDetails, subtitle, title }) => {
      const expanded = key === selected;
      const className = expanded ? " selected" : "";
      const handleToggleSelect = () => {
        const value = expanded ? null : key;
        onChange({ value });
      };
      return (
        <DetailCard
          columnCount={columnCount}
          className={className}
          content={content}
          detailsLabel={detailsLabel}
          expanded={expanded}
          imageUrl={imageUrl}
          key={key}
          toggleSelect={handleToggleSelect}
          showDetails={showDetails}
          title={title}
          subtitle={subtitle}
        />
      );
    },
    [columnCount, detailsLabel, onChange, selected]
  );

  const table = useMemo(() => asTable(cards), [asTable, cards]);

  const renderCards = useCallback(() => {
    return table.map((row = [], rowId) => {
      const hasSelection = row.filter(({ key }) => key === selected).length > 0;
      const selectedClassName = hasSelection ? "selection-row" : null;
      return (
        <>
          <div key={`tile-row-${rowId}`} className={classnames("tile","is-12","is-parent", selectedClassName)}>
            {row.map(renderCard)}
          </div>
          {hasSelection && details}
        </>
      );
    });
  }, [details, renderCard, selected, table]);

  return (
    <div className={classnames("card-list", className)}>
      {renderCards()}
    </div>
  );
}
