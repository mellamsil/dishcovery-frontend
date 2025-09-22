import React, { forwardRef } from "react";
import "../styles/modal.css";

const ModalWithForm = forwardRef(
  (
    {
      title,
      onClose,
      onSubmit,
      children,
      submitText = "Submit",
      secondaryText,
      secondaryAction,
      isLoading = false,
      closeIcon,
      submitClassName,
      isDirty = false,
    },
    ref
  ) => {
    return (
      <div
        className="modal-overlay"
        role="dialog"
        aria-modal="true"
        onClick={(e) => {
          if (e.target.classList.contains("modal-overlay")) {
            onClose();
          }
        }}
      >
        <div className="modal" ref={ref} onClick={(e) => e.stopPropagation()}>
          {/* Close icon */}
          {closeIcon && (
            <button
              type="button"
              className="modal-close-button"
              onClick={onClose}
              aria-label="Close"
            >
              <img src={closeIcon} alt="Close" />
            </button>
          )}

          {/* Modal title */}
          <h2 className="modal-title">{title}</h2>

          {/* Form content */}
          <form className="modal-form" onSubmit={onSubmit}>
            {children}

            {/* Buttons side by side */}
            <div
              className="modal-actions"
              style={{ display: "flex", gap: "10px" }}
            >
              <button
                type="submit"
                className={`btn-primary ${isDirty ? "btn-primary-dirty" : ""} ${
                  submitClassName || ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : submitText}
              </button>

              {secondaryText && secondaryAction && (
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={secondaryAction}
                  disabled={isLoading}
                >
                  {secondaryText}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }
);

export default ModalWithForm;
