import React, { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { formatUnitLabel } from "../unitLabels";
import "./EventDetailModal.css";

/** Lấy giá trị cột từ dòng sheet (hỗ trợ tên cột hơi lệch khi export). */
function fieldFromRow(row, candidates) {
  if (!row) return "";
  for (const key of candidates) {
    if (Object.prototype.hasOwnProperty.call(row, key)) {
      const v = row[key];
      if (v != null && String(v).trim() !== "") return String(v).trim();
    }
  }
  const lowerMap = {};
  for (const k of Object.keys(row)) {
    lowerMap[k.toLowerCase().trim()] = row[k];
  }
  for (const name of candidates) {
    const v = lowerMap[name.toLowerCase()];
    if (v != null && String(v).trim() !== "") return String(v).trim();
  }
  return "";
}

function isNihil(value) {
  return String(value).trim().toLowerCase() === "nihil";
}

export function EventDetailModal({ event, onClose }) {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!event) return undefined;
    document.addEventListener("keydown", handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [event, handleKeyDown]);

  if (!event) return null;

  const title = fieldFromRow(event, ["EventName", "eventname"]);
  const imageUrl = fieldFromRow(event, ["ImageLink", "imagelink"]);
  const unit = fieldFromRow(event, ["Unit", "unit"]);
  const redraw = fieldFromRow(event, ["Redraw", "redraw"]);
  const typeset = fieldFromRow(event, ["Typeset", "typeset"]);

  const modal = (
    <div
      className="event-modal-overlay"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="event-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="event-modal__close"
          onClick={onClose}
          aria-label="Đóng"
        >
          ×
        </button>

        <div className="event-modal__layout">
          <div className="event-modal__media">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title || "Logo sự kiện"}
                className="event-modal__img"
                draggable={false}
              />
            ) : null}
          </div>

          <div className="event-modal__body">
            <h2 id="event-modal-title" className="event-modal__title">
              {title || "—"}
            </h2>

            <dl className="event-modal__meta">
              <div className="event-modal__row">
                <dt>Unit</dt>
                <dd>{formatUnitLabel(unit)}</dd>
              </div>
              <div className="event-modal__row">
                <dt>Redraw</dt>
                <dd
                  className={
                    isNihil(redraw) ? "event-modal__value--muted" : undefined
                  }
                >
                  {redraw || "—"}
                </dd>
              </div>
              <div className="event-modal__row">
                <dt>Typeset</dt>
                <dd
                  className={
                    isNihil(typeset) ? "event-modal__value--muted" : undefined
                  }
                >
                  {typeset || "—"}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
